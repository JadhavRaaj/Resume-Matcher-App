import re
import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Ensure the Google API key is loaded
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment variables.")

# Initialize the LLM with the API key
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-preview-05-20", google_api_key=api_key)

def clean_text(text):
    """
    Cleans and preprocesses text for analysis.
    """
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text

def extract_text_from_pdf(pdf_file):
    """
    Extracts text from an uploaded PDF file.
    """
    text = ""
    try:
        reader = PyPDF2.PdfReader(pdf_file)
        for page_num in range(len(reader.pages)):
            page_text = reader.pages[page_num].extract_text()
            if page_text:
                text += page_text
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return None
    return text

@app.route('/api/match', methods=['POST'])
def match_resumes():
    """
    Calculates the match score and extracts keywords.
    """
    if 'jobDescription' not in request.form or 'resume' not in request.files:
        return jsonify({'error': 'Missing job description or resume file'}), 400

    job_description_raw = request.form['jobDescription']
    resume_file = request.files['resume']

    resume_text = extract_text_from_pdf(resume_file)
    if not resume_text:
        return jsonify({'error': 'Failed to extract text from PDF'}), 400
    
    # Preprocess text
    job_description_clean = clean_text(job_description_raw)
    resume_text_clean = clean_text(resume_text)

    # Combine texts for TF-IDF vectorization
    documents = [job_description_clean, resume_text_clean]

    # Vectorize using TF-IDF
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(documents)

    # Calculate Cosine Similarity
    cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    match_score = round(cosine_sim[0][0] * 100, 2)

    # Get feature names (keywords)
    feature_names = vectorizer.get_feature_names_out()
    
    # Get TF-IDF scores for the resume
    resume_tfidf_scores = tfidf_matrix[1].toarray()[0]
    
    # Find top keywords from resume that are in both documents
    keyword_indices = np.argsort(resume_tfidf_scores)[::-1]
    top_keywords = []
    
    # Check if the keywords are in both documents before adding them
    for i in keyword_indices:
        keyword = feature_names[i]
        if keyword in job_description_clean:
            top_keywords.append(keyword)
        if len(top_keywords) >= 10:  # Limit to a reasonable number of keywords
            break

    # Placeholder for chart data based on top keywords
    # This is a simplified way to create chart data for the demo
    chart_data = {
        'labels': top_keywords,
        'data': [float(tfidf_matrix[0, vectorizer.vocabulary_[kw]] * 100) for kw in top_keywords]
    }
    
    # Get the extracted resume text back to the frontend
    return jsonify({
        'score': match_score, 
        'resumeText': resume_text,
        'keywords': top_keywords,
        'chartData': chart_data
    })

@app.route('/api/optimize', methods=['POST'])
def optimize_resume():
    """
    Analyzes resume and job description using an LLM.
    """
    data = request.json
    job_description = data.get('jobDescription')
    resume_text = data.get('resumeText')

    if not job_description or not resume_text:
        return jsonify({'error': 'Missing job description or resume text'}), 400

    # Define the LLM prompt template
    template = """
    You are an expert career coach and AI-powered resume optimizer. Your task is to analyze a resume against a specific job description.

    Based on the provided RESUME and JOB DESCRIPTION, generate a comprehensive analysis in a structured JSON format.

    The JSON object should have three keys:
    1.  `optimized_resume`: A rewritten, concise, and professional version of the RESUME, tailored to the keywords and requirements of the JOB DESCRIPTION.
    2.  `skill_gaps`: A list of 3-5 specific skills, technologies, or experiences mentioned in the JOB DESCRIPTION that are missing or underdeveloped in the RESUME.
    3.  `growth_paths`: A list of 3-5 actionable steps or resources (e.g., specific courses, certifications, personal projects) to help the user acquire the missing skills.

    ---
    RESUME:
    {resume_text}

    ---
    JOB DESCRIPTION:
    {job_description}

    ---
    JSON OUTPUT:
    """

    prompt = PromptTemplate.from_template(template)
    chain = prompt | llm

    try:
        response = chain.invoke({"resume_text": resume_text, "job_description": job_description})
        llm_output_text = response.content.strip()

        # Extract the JSON part from the response
        json_match = re.search(r'\{.*\}', llm_output_text, re.DOTALL)
        if json_match:
            json_string = json_match.group(0)
            llm_output_json = json.loads(json_string)
            return jsonify(llm_output_json)
        else:
            print("LLM response did not contain a valid JSON object.")
            return jsonify({'error': 'LLM response could not be parsed'}), 500

    except Exception as e:
        print(f"LLM API call failed: {e}")
        return jsonify({'error': f'Failed to get LLM response: {e}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
