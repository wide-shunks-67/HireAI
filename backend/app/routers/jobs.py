from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
from app.config import settings

router = APIRouter(prefix="/jobs", tags=["jobs"])

class JobSearchRequest(BaseModel):
    skills: list = []
    experience_years: int = 0
    education: str = ""
    custom_query: str = ""
    location: str = ""
    date_posted: str = "month"

def calculate_match(job: dict, skills: list) -> int:
    if not skills:
        return 50
    job_text = f"{job.get('job_title','')} {job.get('job_description','')}".lower()
    matched = sum(1 for skill in skills if skill.lower() in job_text)
    return min(100, int((matched / max(len(skills), 1)) * 100) + 30)

@router.post("/search")
async def search_jobs(req: JobSearchRequest):
    try:
        top_skills = req.skills[:3] if req.skills else ["software engineer"]
        query = " ".join(top_skills)

        # Build search query including location if provided
        if req.custom_query:
            search_query = req.custom_query
        elif req.location:
            search_query = f"{query} {req.location}"
        else:
            search_query = query

        date_posted = req.date_posted if req.date_posted != "all" else "month"

        params = {
            "query": search_query,
            "num_pages": "2",
            "date_posted": date_posted,
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://jsearch.p.rapidapi.com/search",
                headers={
                    "x-rapidapi-key": settings.RAPIDAPI_KEY,
                    "x-rapidapi-host": "jsearch.p.rapidapi.com"
                },
                params=params,
                timeout=15.0
            )
            data = response.json()

        jobs = data.get("data", [])[:10]

        results = []
        for job in jobs:
            match = calculate_match(job, req.skills)
            results.append({
                "id": job.get("job_id"),
                "title": job.get("job_title"),
                "company": job.get("employer_name"),
                "location": f"{job.get('job_city') or ''} {job.get('job_country') or ''}".strip(),
                "type": job.get("job_employment_type", "Full-time"),
                "remote": job.get("job_is_remote", False),
                "description": job.get("job_description", "")[:300] + "...",
                "apply_link": job.get("job_apply_link"),
                "posted": job.get("job_posted_at_datetime_utc", "")[:10],
                "match": match,
                "salary": f"${job.get('job_min_salary')} - ${job.get('job_max_salary')}" if job.get('job_min_salary') else "Not specified"
            })

        results.sort(key=lambda x: x["match"], reverse=True)
        return {"success": True, "jobs": results, "query": search_query}

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))