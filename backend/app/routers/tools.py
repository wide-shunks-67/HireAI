from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from app.config import settings

router = APIRouter(prefix="/tools", tags=["tools"])
genai.configure(api_key=settings.GEMINI_API_KEY)

class CoverLetterRequest(BaseModel):
    resume_data: dict
    job_title: str
    company_name: str
    job_description: str = ""

class InterviewRequest(BaseModel):
    resume_data: dict
    job_title: str
    difficulty: str = "medium"

@router.post("/cover-letter")
async def generate_cover_letter(req: CoverLetterRequest):
    try:
        model = genai.GenerativeModel("gemini-3.5-flash")
        prompt = f"""Write a professional cover letter for this candidate applying for the role below.

CANDIDATE DETAILS:
- Name: {req.resume_data.get('full_name', '')}
- Skills: {', '.join(req.resume_data.get('skills', []))}
- Experience: {req.resume_data.get('experience_years', 0)} years
- Education: {req.resume_data.get('education', [{}])[0].get('degree', '') if req.resume_data.get('education') else ''}
- Summary: {req.resume_data.get('summary', '')}
- Projects: {', '.join([e.get('role','') + ' at ' + e.get('company','') for e in req.resume_data.get('experience', [])])}

JOB DETAILS:
- Role: {req.job_title}
- Company: {req.company_name}
- Description: {req.job_description}

Write a compelling, personalized cover letter that:
1. Opens with a strong hook
2. Highlights relevant skills and projects
3. Shows enthusiasm for the specific company
4. Ends with a clear call to action
5. Is professional but not robotic
6. Is 3-4 paragraphs, under 350 words

Write only the cover letter body, no subject line needed."""

        response = model.generate_content(prompt)
        return {"success": True, "cover_letter": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/interview-prep")
async def generate_interview_questions(req: InterviewRequest):
    try:
        model = genai.GenerativeModel("gemini-3.5-flash")
        prompt = f"""Generate interview questions and model answers for this candidate.

CANDIDATE:
- Skills: {', '.join(req.resume_data.get('skills', []))}
- Experience: {req.resume_data.get('experience_years', 0)} years  
- Projects: {', '.join([e.get('role','') for e in req.resume_data.get('experience', [])])}
- Education: {req.resume_data.get('education', [{}])[0].get('degree', '') if req.resume_data.get('education') else ''}

ROLE: {req.job_title}
DIFFICULTY: {req.difficulty}

Generate exactly 6 interview questions with model answers. Return ONLY valid JSON, no extra text:

{{
  "questions": [
    {{
      "id": 1,
      "category": "Technical/Behavioral/HR",
      "question": "question here",
      "model_answer": "detailed model answer here",
      "tip": "quick tip for answering this"
    }}
  ]
}}

Mix of: 2 technical, 2 behavioral, 1 HR, 1 situational questions."""

        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        import json
        data = json.loads(text.strip())
        return {"success": True, "questions": data["questions"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))