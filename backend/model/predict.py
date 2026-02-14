import sys
import json
import joblib
import pandas as pd
import numpy as np
import os

# Load the model
risk_model_path = os.path.join(os.path.dirname(__file__), 'risk_model.pkl')
health_model_path = os.path.join(os.path.dirname(__file__), 'health_model.pkl')

def load_model():
    # Try loading the new Risk Model first
    if os.path.exists(risk_model_path):
        try:
            sys.stderr.write("Loading new Risk Model...\n")
            return joblib.load(risk_model_path)
        except Exception as e:
            sys.stderr.write(f"Error loading Risk Model: {str(e)}\n")
    
    # Fallback to original Health Model
    if os.path.exists(health_model_path):
        try:
            sys.stderr.write("Fallback: Loading original Health Model...\n")
            return joblib.load(health_model_path)
        except Exception as e:
            sys.stderr.write(f"Error loading Health Model: {str(e)}\n")
            return None
    return None

model = load_model()

def preprocess_input(data):
    # Map incoming frontend data to the exact features the model expects
    
    # Defaults for missing fields
    age = int(data.get('age', 30))
    
    # Map Gender (Model expects: 'Male', 'Female', 'Other')
    gender_input = data.get('gender', 'Male')
    if gender_input in ['Male', 'Female']:
        gender = gender_input
    else:
        gender = 'Other'
    
    # Parse BP
    bp = data.get('bp', '120/80')
    try:
        systolic = int(bp.split('/')[0])
        diastolic = int(bp.split('/')[1])
    except:
        systolic = 120
        diastolic = 80
        
    heart_rate = int(data.get('heartRate', 70))
    temp = float(data.get('temperature', 98.6))
    
    # Calculate Derived_MAP = (SBP + 2*DBP)/3
    derived_map = (systolic + (2 * diastolic)) / 3.0

    # Categorical Defaults (Model expects strings)
    # Smoking: 'Current', 'Former', 'Never'
    smoking = 'Never' 
    
    # Alcohol: float (unit/week)
    alcohol = 1.0 
    
    # Physical Activity: float (hours/week)
    activity = 3.0
    
    # Sleep: float (hours/day)
    sleep = 7.0   
    
    # Chronic Disease: 'Diabetes', 'Heart Disease', 'Hypertension', nan
    # We map any user input string to these if it matches, else None (nan)
    history_input = data.get('history', '').lower()
    chronic = 'Diabetes' # Default to Diabetes to avoid nan crash (prototype limitation)
    if 'heart' in history_input:
        chronic = 'Heart Disease'
    elif 'hypertension' in history_input or 'pressure' in history_input:
        chronic = 'Hypertension'
    
    stress = 5  # Moderate stress
    resp_rate = 16  # Normal range: 12-20
    oxygen_sat = 98 # Normal: 95-100%
    bmi = 24.5  # Average

    # Create DataFrame with exact column order from inspection
    df = pd.DataFrame([{
        'Age': age,
        'Gender': gender,
        'BMI': bmi,
        'Smoking Status': smoking,
        'Alcohol Consumption (per week)': alcohol,
        'Physical Activity (hours/week)': activity,
        'Sleep Duration (hours/day)': sleep,
        'Chronic Disease History': chronic,
        'Stress Level (1-10)': stress,
        'Heart Rate': heart_rate,
        'Respiratory Rate': resp_rate,
        'Body Temperature': temp,
        'Oxygen Saturation': oxygen_sat,
        'Systolic Blood Pressure': systolic,
        'Diastolic Blood Pressure': diastolic,
        'Derived_MAP': derived_map
    }])

    # Convert object columns to category for XGBoost
    for col in ['Gender', 'Smoking Status', 'Chronic Disease History']:
        df[col] = df[col].astype('category')
    
    return df

def predict():
    try:
        # Read JSON from stdin
        input_str = sys.stdin.read()
        if not input_str:
            return
        
        data = json.loads(input_str)
        
        if not model:
            print(json.dumps({
                "risk_level": "Medium", 
                "confidence": 0.0, 
                "error": "Model file not found or failed to load in backend/model/"
            }))
            return

        # Preprocess
        features = preprocess_input(data)

        # NEW MODEL (Risk Model) Feature Selection
        # The new xgboost model was trained on a specific subset of features.
        # We must filter the dataframe to match exactly what it expects.
        expected_features = [
            'Age', 'Heart Rate', 'Respiratory Rate', 'Body Temperature', 
            'Oxygen Saturation', 'Systolic Blood Pressure', 'Diastolic Blood Pressure'
        ]
        
        # Check if we are using the new model (by checking if it is an XGBClassifier/Booster)
        # For safety, we just try to select these columns if they exist
        try:
             # If using the new complicated model, it might fail on extra columns
             # But if we reverted to old model, we might need all columns.
             # HACK: matches the error "feature_names mismatch" which listed these 7.
             if "XGB" in str(type(model)):
                 features = features[expected_features]
        except:
             pass

        # Predict
        prediction = model.predict(features)[0]
        
        # Extract vitals for explanation logic
        age = int(data.get('age', 30))
        heart_rate = int(data.get('heartRate', 70))
        temp = float(data.get('temperature', 98.6))
        
        bp = data.get('bp', '120/80')
        try:
            systolic = int(bp.split('/')[0])
            diastolic = int(bp.split('/')[1])
        except:
            systolic = 120
            diastolic = 80

        # Handle Multi-Output (Risk, Department) - Take first output for Risk
        # prediction might be [0, 2]
        pred_val = prediction
        if isinstance(prediction, (np.ndarray, list)):
            pred_val = prediction[0]
            
        # Handle probability if available
        try:
            # predict_proba returns list of arrays for multi-output
            probas = model.predict_proba(features)
            if isinstance(probas, list):
                # Take max prob of the first output (Risk)
                proba = probas[0].max()
            else:
                proba = probas.max()
        except:
            proba = 0.85
        
        # Map output
        # Assuming model returns: 0=Low, 1=Medium, 2=High
        risk_map = {0: 'Low', 1: 'Medium', 2: 'High'}
        risk_level = risk_map.get(int(pred_val), 'Medium')

        # ---------------------------------------------------------
        # SAFETY OVERRIDE RULES (Hybrid AI Approach)
        # ---------------------------------------------------------
        # The ML model might underestimate risk for young patients.
        # We apply rule-based heuristics for critical symptoms.
        symptoms = data.get('symptoms', '').lower()
        department = 'General Practice' # Default initialization
        
        # Rule 1: Chest Pain or Cardiac symptoms -> Immediate High Risk
        if 'chest' in symptoms or 'heart' in symptoms or 'stroke' in symptoms or 'breathe' in symptoms:
            risk_level = "High"
            department = "Cardiology"
            proba = max(proba, 0.95) # High confidence for rule-based match
            
        # Rule 2: Hypertensive Crisis (Systolic > 160 or Diastolic > 100) -> High Risk
        elif systolic >= 160 or diastolic >= 100:
            risk_level = "High"
            department = "Cardiology"
            proba = max(proba, 0.90)

        # Fallback departmental logic
        if department == "General Practice": # Only set if not already set by override
            if risk_level == "High":
                 department = "Cardiology" 
            elif risk_level == "Medium":
                 department = "Internal Medicine"

        # Generate dynamic explanations
        explanations = []
        
        # Vital Checks
        if systolic > 140 or diastolic > 90:
             explanations.append(f"Elevated Blood Pressure ({systolic}/{diastolic}) indicates hypertension.")
        if heart_rate > 100:
             explanations.append(f"Abnormal Heart Rate detected ({heart_rate} BPM).")
        if temp > 100.4:
             explanations.append(f"High Fever detected ({temp}°F).")
             
        # Symptom Checks
        if 'chest' in symptoms or 'pain' in symptoms:
             explanations.append("Reported symptoms match critical cardiac warning signs.")
        if 'breath' in symptoms or 'breathing' in symptoms:
             explanations.append("Respiratory distress reported.")
             
        # Demographic Checks
        if age > 60:
            explanations.append("Patient age group indicates higher vulnerability.")
            
        # Fallback
        if not explanations:
            explanations.append("Routine analysis based on vitals and lifestyle factors.")

        result = {
            "risk_level": risk_level,
            "confidence": float(proba),
            "department": department,
            "priority": "Emergency" if risk_level == "High" else "Normal",
            "wait_time": "10 mins" if risk_level == "High" else "45 mins",
            "explanations": explanations
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        sys.stderr.write(f"Prediction error: {str(e)}\n")
        print(json.dumps({"error": str(e), "risk_level": "Medium"}))

if __name__ == "__main__":
    predict()
