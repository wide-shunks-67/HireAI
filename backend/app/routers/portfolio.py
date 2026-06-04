from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.user import Portfolio
import re

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

class PortfolioCreate(BaseModel):
    email: str
    resume_data: dict

def make_slug(name: str, email: str) -> str:
    slug = re.sub(r'[^a-z0-9]', '-', name.lower().strip())
    slug = re.sub(r'-+', '-', slug).strip('-')
    unique = email.split('@')[0].lower()
    return f"{slug}-{unique}"

@router.post("/generate")
def generate_portfolio(data: PortfolioCreate, db: Session = Depends(get_db)):
    slug = make_slug(data.resume_data.get('full_name', 'user'), data.email)
    existing = db.query(Portfolio).filter(Portfolio.slug == slug).first()
    if existing:
        existing.resume_data = data.resume_data
        db.commit()
        return {"success": True, "slug": slug, "url": f"https://hireai-n00h.onrender.com/portfolio/view/{slug}"}
    portfolio = Portfolio(slug=slug, user_email=data.email, resume_data=data.resume_data)
    db.add(portfolio)
    db.commit()
    return {"success": True, "slug": slug, "url": f"https://hireai-n00h.onrender.com/portfolio/view/{slug}"}

@router.get("/view/{slug}", response_class=HTMLResponse)
def view_portfolio(slug: str, db: Session = Depends(get_db)):
    p = db.query(Portfolio).filter(Portfolio.slug == slug).first()
    if not p:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    r = p.resume_data
    name = r.get('full_name', 'Developer')
    email = r.get('email', '')
    phone = r.get('phone', '')
    summary = r.get('summary', '')
    skills = r.get('skills', [])
    experience = r.get('experience', [])
    education = r.get('education', [])
    ats_score = r.get('ats_score', 0)
    initials = ''.join([w[0].upper() for w in name.split()[:2]])

    skill_colors = [
        ('rgba(102,126,234,0.15)', '#667eea'),
        ('rgba(240,147,251,0.15)', '#c026d3'),
        ('rgba(245,87,108,0.15)', '#f5576c'),
        ('rgba(79,209,197,0.15)', '#0d9488'),
        ('rgba(251,191,36,0.15)', '#d97706'),
        ('rgba(52,211,153,0.15)', '#059669'),
    ]

    skill_tags = ''
    for i, s in enumerate(skills):
        bg, color = skill_colors[i % len(skill_colors)]
        skill_tags += f'<span style="background:{bg};color:{color};padding:8px 16px;border-radius:20px;font-size:13px;font-weight:600;display:inline-block;margin:4px">{s}</span>'

    exp_html = ''
    for i, exp in enumerate(experience):
        colors = ['#667eea,#764ba2', '#f093fb,#f5576c', '#4facfe,#00f2fe', '#43e97b,#38f9d7']
        grad = colors[i % len(colors)]
        exp_html += f'''
        <div style="display:flex;gap:16px;margin-bottom:28px;align-items:flex-start">
            <div style="width:50px;height:50px;border-radius:14px;background:linear-gradient(135deg,{grad});display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;box-shadow:0 4px 12px rgba(0,0,0,0.15)">🏢</div>
            <div style="flex:1;padding-top:4px">
                <div style="font-weight:700;color:#1a1a2e;font-size:16px">{exp.get('role','')}</div>
                <div style="color:#666;font-size:14px;margin-top:4px">{exp.get('company','')} &nbsp;·&nbsp; <span style="color:#667eea">{exp.get('duration','')}</span></div>
            </div>
        </div>'''

    edu_html = ''
    for edu in education:
        edu_html += f'''
        <div style="display:flex;gap:16px;margin-bottom:24px;align-items:flex-start">
            <div style="width:50px;height:50px;border-radius:14px;background:linear-gradient(135deg,#f093fb,#f5576c);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;box-shadow:0 4px 12px rgba(0,0,0,0.15)">🎓</div>
            <div style="flex:1;padding-top:4px">
                <div style="font-weight:700;color:#1a1a2e;font-size:16px">{edu.get('degree','')}</div>
                <div style="color:#666;font-size:14px;margin-top:4px">{edu.get('institution','')} &nbsp;·&nbsp; <span style="color:#f5576c">{edu.get('year','')}</span></div>
            </div>
        </div>'''

    score_color = '#10b981' if ats_score >= 70 else '#f59e0b' if ats_score >= 50 else '#ef4444'

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} — Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        *{{margin:0;padding:0;box-sizing:border-box}}
        body{{font-family:'Inter',sans-serif;background:#f8f7ff;color:#1a1a2e}}
        .card{{background:white;border-radius:24px;padding:36px;margin-bottom:24px;box-shadow:0 4px 24px rgba(102,126,234,0.08);border:1px solid rgba(102,126,234,0.08)}}
        .card:hover{{box-shadow:0 8px 32px rgba(102,126,234,0.15);transform:translateY(-2px);transition:all 0.3s}}
        h2{{font-size:20px;font-weight:800;color:#1a1a2e;margin-bottom:24px;display:flex;align-items:center;gap:10px}}
        .container{{max-width:780px;margin:0 auto;padding:32px 20px}}
    </style>
</head>
<body>

<!-- Hero Section -->
<div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 50%,#f093fb 100%);padding:70px 20px 80px;position:relative;overflow:hidden">
    <div style="position:absolute;top:-60px;right:-60px;width:300px;height:300px;border-radius:50%;background:rgba(255,255,255,0.06)"></div>
    <div style="position:absolute;bottom:-80px;left:-40px;width:250px;height:250px;border-radius:50%;background:rgba(255,255,255,0.04)"></div>

    <div style="max-width:780px;margin:0 auto;text-align:center;position:relative">
        <!-- Avatar -->
        <div style="width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:800;color:white;margin:0 auto 20px;border:3px solid rgba(255,255,255,0.5);backdrop-filter:blur(10px)">
            {initials}
        </div>

        <h1 style="color:white;font-size:42px;font-weight:900;margin-bottom:10px;letter-spacing:-1px">{name}</h1>
        <p style="color:rgba(255,255,255,0.85);font-size:16px;line-height:1.7;max-width:560px;margin:0 auto 28px">{summary}</p>

        <!-- Contact pills -->
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            {'<a href="mailto:'+email+'" style="background:rgba(255,255,255,0.18);color:white;padding:10px 20px;border-radius:25px;text-decoration:none;font-size:13px;font-weight:500;border:1px solid rgba(255,255,255,0.35);backdrop-filter:blur(10px)"> &nbsp;'+email+'</a>' if email else ''}
            {'<span style="background:rgba(255,255,255,0.18);color:white;padding:10px 20px;border-radius:25px;font-size:13px;font-weight:500;border:1px solid rgba(255,255,255,0.35)"> &nbsp;'+phone+'</span>' if phone else ''}
        </div>
    </div>
</div>

<!-- Score banner -->
<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:20px;text-align:center">
    <span style="color:rgba(255,255,255,0.6);font-size:13px">AI Resume Score &nbsp;</span>
    <span style="color:{score_color};font-size:28px;font-weight:900">{ats_score}</span>
    <span style="color:rgba(255,255,255,0.4);font-size:16px">/100</span>
    
</div>

<div class="container">

    <!-- Skills -->
    <div class="card">
        <h2>Skills & Technologies</h2>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
            {skill_tags}
        </div>
    </div>

    <!-- Experience -->
    {'<div class="card"><h2> Experience & Projects</h2>'+exp_html+'</div>' if experience else ''}

    <!-- Education -->
    {'<div class="card"><h2> Education</h2>'+edu_html+'</div>' if education else ''}

    <!-- Footer -->
    <div style="text-align:center;padding:20px 0 10px;color:#999;font-size:13px">
        Generated by <span style="background:linear-gradient(135deg,#667eea,#f093fb);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:700">HireAI</span> · AI-Powered Career Platform
    </div>

</div>
</body>
</html>"""

    return HTMLResponse(content=html)