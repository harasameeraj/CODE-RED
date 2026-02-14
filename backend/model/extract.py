import sys
import json
import os
import PyPDF2
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        return None, str(e)
    return text, None

def extract_data_with_gpt(text):
    prompt = f"""
    You are a medical data extraction assistant. Extract the following patient details from the medical report below.
    Return the result ONLY as a VALID JSON object. Do not add any markdown formatting like ```json ... ```.
    
    Fields to extract:
    - name (string, or "Unknown" if not found)
    - age (integer, default 30 if not found)
    - gender (string: "Male", "Female", or "Other")
    - symptoms (string, summary of complaints)
    - bp (string, format "120/80")
    - heartRate (integer)
    - temperature (float)
    - history (string, medical history if any)
    
    If a value is missing, use a reasonable default or empty string.
    
    Medical Report:
    {text[:2000]} # Limit text length to avoid token limits
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful medical assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No PDF file provided"}))
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    
    if not os.path.exists(pdf_path):
        print(json.dumps({"error": "File not found"}))
        sys.exit(1)
        
    text, error = extract_text_from_pdf(pdf_path)
    
    if error:
        print(json.dumps({"error": f"PDF parsing error: {error}"}))
        sys.exit(1)
        
    if not text.strip():
        print(json.dumps({"error": "Empty PDF"}))
        sys.exit(1)
        
    json_output = extract_data_with_gpt(text)
    print(json_output)
