from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from app.config import settings

router = APIRouter(prefix="/chat", tags=["chat"])

genai.configure(api_key=settings.GEMINI_API_KEY)

class ChatRequest(BaseModel):
    message: str
    resume_data: dict = {}
    chat_history: list = []

@router.post("/message")
async def chat(req: ChatRequest):
    try:
        model = genai.GenerativeModel("gemini-3.5-flash")

        resume_context = ""
        if req.resume_data:
            resume_context = f"""
CANDIDATE RESUME DATA:
- Name: {req.resume_data.get('full_name', 'N/A')}
- Email: {req.resume_data.get('email', 'N/A')}
- Skills: {', '.join(req.resume_data.get('skills', []))}
- Experience: {req.resume_data.get('experience_years', 0)} years
- Education: {req.resume_data.get('education', [{}])[0].get('degree', 'N/A') if req.resume_data.get('education') else 'N/A'} from {req.resume_data.get('education', [{}])[0].get('institution', 'N/A') if req.resume_data.get('education') else 'N/A'}
- ATS Score: {req.resume_data.get('ats_score', 'N/A')}/100
- Current Summary: {req.resume_data.get('summary', 'N/A')}
- Projects/Experience: {', '.join([f"{e.get('role')} at {e.get('company')}" for e in req.resume_data.get('experience', [])])}
- Areas to improve: {', '.join(req.resume_data.get('improvements', []))}

Always use this data to give PERSONALIZED advice specific to this candidate.
"""

        system_prompt = f"""You are HireAI, an expert career coach, resume advisor, and job placement specialist with 10+ years of experience.

Your personality:
- Friendly, encouraging, and professional
- Give specific, actionable advice — never vague
- Use bullet points and structure in responses
- Be concise but thorough

{resume_context}

Your capabilities:
- Analyze resumes and suggest specific improvements
- Recommend specific job titles and companies based on skills
- Give interview preparation tips for specific roles
- Write cover letters tailored to job descriptions
- Explain skill gaps and how to fill them
- Suggest specific online courses, certifications
- Give salary insights for roles

Rules:
- Always personalize advice based on the resume data provided
- When suggesting jobs, name SPECIFIC companies and roles
- When suggesting skills, name SPECIFIC technologies to learn
- Format responses clearly with bullet points when listing items
- Keep responses under 200 words unless writing a cover letter
- Always end with an encouraging note or follow-up question"""

        history = []
        for msg in req.chat_history[-6:]:
            history.append({
                "role": msg["role"],
                "parts": [msg["content"]]
            })

        chat_session = model.start_chat(history=history)
        full_message = f"{system_prompt}\n\nUser: {req.message}"
        response = chat_session.send_message(full_message)

        return {
            "success": True,
            "reply": response.text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))