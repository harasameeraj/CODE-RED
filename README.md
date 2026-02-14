# AI Smart Patient Triage System

A full-stack healthcare application that uses an AI model to triage patients based on vitals and symptoms.

## Features
- **AI-Powered Analysis**: Python backend uses a custom ML model (`health_model.pkl`) to predict patient risk (Low, Medium, High).
- **Real-Time Dashboard**: Visualizes patient flow and risk distribution.
- **Secure Records**: Saves patient history for future reference.
- **Modern UI**: Dark/Light mode, glassmorphism, and smooth animations.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, Express, Python (for AI inference)
- **Model**: Scikit-Learn (RandomForest Classifier)

## Setup Instructions

1.  **Clone the Repository**
    ```bash
    git clone <your-repo-url>
    cd ai-smart-triage
    ```

2.  **Install Dependencies**
    ```bash
    # Frontend
    cd frontend
    npm install

    # Backend
    cd ../backend
    npm install
    pip3 install -r requirements.txt
    ```

3.  **Run the Application**
    Open two terminals:

    *Terminal 1 (Backend)*:
    ```bash
    cd backend
    npm run dev
    ```

    *Terminal 2 (Frontend)*:
    ```bash
    cd frontend
    npm run dev
    ```

4.  **Access the App**
    Open [http://localhost:5173](http://localhost:5173) in your browser.
    
    *Default Login*:
    - Username: `admin`
    - Password: `admin123`
