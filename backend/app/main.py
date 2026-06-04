from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, resume, chat, jobs, portfolio


Base.metadata.create_all(bind=engine)

app = FastAPI(title="HireAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://hire-ai-beta-two.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resume.router) 
app.include_router(chat.router)
app.include_router(jobs.router)
app.include_router(portfolio.router)

@app.get("/")
def root():
    return {"message": "HireAI API is running"}