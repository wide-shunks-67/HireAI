from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.config import settings
import google.generativeai as genai
import pdfplumber
import json
import io

router = APIRouter(prefix="/resume", tags=["resume"])

genai.configure(api_key=settings.GEMINI_API_KEY)

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def parse_resume_with_gemini(resume_text: str) -> dict:
    model = genai.GenerativeModel("gemini-3.5-flash")
    prompt = f"""
    Analyze this resume and extract information in JSON format only.
    Return ONLY valid JSON, no extra text.

    {{
        "full_name": "candidate name",
        "email": "email address",
        "phone": "phone number",
        "summary": "professional summary in 2 sentences",
        "experience_years": 0,
        "skills": ["skill1", "skill2"],
        "experience": [
            {{
                "company": "company name",
                "role": "job title",
                "duration": "duration"
            }}
        ],
        "education": [
            {{
                "degree": "degree name",
                "institution": "university name",
                "year": "graduation year"
            }}
        ],
        "ats_score": 0,
        "section_scores": {{
            "experience": 0,
            "education": 0,
            "skills": 0,
            "summary": 0
        }},
        "improvements": ["improvement tip 1", "improvement tip 2"]
    }}

    Score ats_score and section_scores out of 100 based on resume quality.

    Resume:
    {resume_text}
    """
    response = model.generate_content(prompt)
    text = response.text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files supported")
    
    file_bytes = await file.read()
    
    try:
        resume_text = extract_text_from_pdf(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read PDF: {e}")
    
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="PDF appears to be empty or scanned")
    
    try:
        parsed = parse_resume_with_gemini(resume_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI parsing failed: {e}")
    
    return {
        "success": True,
        "filename": file.filename,
        "parsed": parsed
    }