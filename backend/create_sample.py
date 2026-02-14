from reportlab.pdfgen import canvas

def create_pdf(filename):
    c = canvas.Canvas(filename)
    # Header
    c.setFont("Helvetica-Bold", 16)
    c.drawString(100, 750, "CITY GENERAL HOSPITAL - MEDICAL REPORT")
    
    # Patient Info
    c.setFont("Helvetica", 12)
    c.drawString(100, 720, "Date: 02/14/2026")
    c.drawString(100, 700, "Patient Name: Michael Scott")
    c.drawString(100, 680, "Age: 46")
    c.drawString(100, 660, "Gender: Male")
    
    # Vitals
    c.setFont("Helvetica-Bold", 12)
    c.drawString(100, 630, "VITALS:")
    c.setFont("Helvetica", 12)
    c.drawString(120, 610, "- Blood Pressure: 155/95 mmHg")
    c.drawString(120, 590, "- Heart Rate: 105 bpm")
    c.drawString(120, 570, "- Temperature: 99.2 F")
    
    # Clinical Notes
    c.setFont("Helvetica-Bold", 12)
    c.drawString(100, 540, "CHIEF COMPLAINT:")
    c.setFont("Helvetica", 12)
    c.drawString(100, 520, "Patient presents with sudden onset of chest tightness and shortness of breath.")
    c.drawString(100, 500, "Reports feeling dizzy and nauseous.")
    
    # History
    c.setFont("Helvetica-Bold", 12)
    c.drawString(100, 470, "MEDICAL HISTORY:")
    c.setFont("Helvetica", 12)
    c.drawString(100, 450, "Hypertension, High Cholesterol.")
    
    c.save()

if __name__ == "__main__":
    create_pdf("sample_report.pdf")
    print("PDF created: sample_report.pdf")
