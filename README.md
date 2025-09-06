AI-Powered Resume Assistant
An intelligent web application that helps users optimize their resumes for specific job descriptions. The app provides a numerical "fit score" and leverages a large language model (LLM) to offer personalized, actionable feedback, including skill gap analysis and suggested growth paths.

Project Structure
This project is divided into two main components:

backend/: A Python-based API that performs the heavy-lifting, including text extraction, data processing, and fit score calculation.

frontend/: A React web application that provides the user interface for uploading resumes, entering job descriptions, and viewing results.

Features
Resume-Job Description Fit Score: A numerical score that quantifies the alignment between a resume and a job description using cosine similarity on TF-IDF vectors.

AI-Powered Feedback: For low-scoring resumes, an integrated LLM provides:

Optimized resume sections.

Identification of key skill gaps.

Personalized growth path suggestions.

Responsive User Interface: A clean and modern web interface built with React that is functional on both desktop and mobile devices.

Getting Started
Follow these steps to set up and run the project locally.

Prerequisites
Python 3.8 or higher

Node.js and npm/yarn

1. Backend Setup
Navigate to the backend directory in your terminal:

cd backend

Create and activate a Python virtual environment:

python -m venv venv
# On Windows
.\venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

Install the required Python packages:

pip install -r requirements.txt

(Note: You will need to create a requirements.txt file from your Python environment if you haven't already by running pip freeze > requirements.txt).

Start the backend server:

uvicorn backend_app:app --reload

Your backend API will now be running on http://localhost:8000.

2. Frontend Setup
Open a new terminal and navigate to the frontend/app directory:

cd frontend/app

Install the frontend dependencies:

npm install

Start the frontend development server:

npm run dev

The web application will be accessible at http://localhost:5173.

Deployment
To host this application for public use, you will need to deploy the backend and frontend separately.

Backend: Can be deployed to a service like Heroku, AWS Elastic Beanstalk, or Google App Engine.

Frontend: The static files from the build process can be hosted on platforms like Vercel, Netlify, or GitHub Pages.

Remember to update the API endpoint in your frontend code to point to the live URL of your deployed backend.