import joblib
import os
import sys

try:
    model = joblib.load('backend/model/health_model.pkl')
    print("Model Type:", type(model))
    if hasattr(model, 'feature_names_in_'):
        print("Features:", list(model.feature_names_in_))
    
    if hasattr(model, 'named_steps') and 'classifier' in model.named_steps:
        clf = model.named_steps['classifier']
        print("Classifier:", clf)
        if hasattr(clf, 'classes_'):
            print("Classes:", clf.classes_)
    
except Exception as e:
    print(e)
