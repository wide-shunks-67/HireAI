# HireAI — AI-Powered Job Platform

> An intelligent career platform that analyzes resumes, provides AI-powered career coaching, matches users to live job listings, generates shareable portfolios, creates tailored cover letters, and prepares you for interviews — all powered by Google Gemini AI.

🌐 **Live Demo:** [hire-ai-beta-two.vercel.app](https://hire-ai-beta-two.vercel.app)  
⚙️ **Backend API:** [hireai-n00h.onrender.com](https://hireai-n00h.onrender.com)  
📁 **GitHub:** [wide-shunks-67/HireAI](https://github.com/wide-shunks-67/HireAI)

---

## Features

### 🔐 Authentication
- Secure JWT-based register and login system
- bcrypt password hashing
- Session persistence across page refreshes and device resizes

### 📄 AI Resume Analysis
- Upload a PDF resume and get instant ATS score (out of 100)
- AI detects all skills, experience, and education automatically
- Section-wise scoring — Experience, Education, Skills, Summary
- Personalized improvement suggestions powered by Gemini AI

### 🤖 AI Career Coach
- Conversational chatbot that knows your resume personally
- Gives specific, actionable career advice
- Suggests jobs, skills to learn, and companies to apply to
- Pre-built prompt chips for quick questions

### 💼 Live Job Matching
- Fetches real live job listings from JSearch API
- Calculates match percentage based on your skills
- Custom search bar for specific roles and locations
- Filters by location, job type, remote, date posted, and minimum match score

### 🎨 Portfolio Generator
- Auto-generates a beautiful, colorful shareable portfolio page
- Unique public URL anyone can view — no login required
- Shows skills, experience, education, and ATS score
- Shareable link for recruiters and LinkedIn

### 📝 Cover Letter Generator
- AI writes a tailored, professional cover letter
- Personalized based on your resume + job title + company + job description
- Copy to clipboard or download as a text file

### 🎯 Interview Preparation
- AI generates 6 interview questions based on your resume and target role
- Mix of Technical, Behavioral, HR, and Situational questions
- Model answers and tips for each question
- Three difficulty levels — Easy, Medium, Hard

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| Tailwind CSS | Styling and responsive design |
| Axios | API calls to backend |

### Backend
| Technology | Purpose |
|---|---|
| Python + FastAPI | REST API framework |
| SQLAlchemy | ORM for database queries |
| PostgreSQL (Supabase) | Cloud database |
| bcrypt | Secure password hashing |
| JWT (python-jose) | Authentication tokens |
| pdfplumber | PDF text extraction |
| python-multipart | File upload handling |

### AI & External APIs
| Service | Purpose |
|---|---|
| Google Gemini API | Resume parsing, scoring, chat, cover letters, interview prep |
| JSearch (RapidAPI) | Real live job listings |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting (free) |
| Render | Backend hosting (free) |
| Supabase | PostgreSQL database hosting (free) |

---

## Project Structure

```
HireAI/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point + CORS
│   │   ├── config.py         # Environment variables (pydantic-settings)
│   │   ├── database.py       # Supabase PostgreSQL connection
│   │   ├── models/
│   │   │   └── user.py       # SQLAlchemy models (User, Portfolio)
│   │   ├── routers/
│   │   │   ├── auth.py       # Register & Login endpoints
│   │   │   ├── resume.py     # Resume upload & Gemini AI parsing
│   │   │   ├── chat.py       # AI career coach chat
│   │   │   ├── jobs.py       # Job search & skill matching
│   │   │   ├── portfolio.py  # Portfolio generation & public view
│   │   │   └── tools.py      # Cover letter & interview prep
│   │   └── schemas/
│   │       └── user.py       # Pydantic request/response schemas
│   ├── requirements.txt
│   ├── Procfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js      # Axios instance with base URL
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx # Main dashboard with all tabs
│   │   │   ├── Chat.jsx      # AI career coach chat UI
│   │   │   ├── Jobs.jsx      # Job matching and filters
│   │   │   └── Tools.jsx     # Cover letter & interview prep
│   │   └── App.jsx           # Root component with auth flow
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get JWT token |
| POST | `/resume/upload` | Upload PDF → AI parsing + ATS score |
| POST | `/chat/message` | Send message to AI career coach |
| POST | `/jobs/search` | Search and match live jobs |
| POST | `/portfolio/generate` | Generate portfolio page |
| GET | `/portfolio/view/{slug}` | View public portfolio (no auth needed) |
| POST | `/tools/cover-letter` | Generate tailored cover letter |
| POST | `/tools/interview-prep` | Generate interview questions + answers |

---

## How It Works

```
User uploads PDF resume
        ↓
pdfplumber extracts raw text
        ↓
Text sent to Gemini AI with structured prompt
        ↓
Gemini returns JSON (skills, experience, ATS score, improvements)
        ↓
Results displayed on dashboard
        ↓
User chats with AI (resume injected as system context)
        ↓
Jobs fetched from JSearch API → match score calculated per job
        ↓
Cover letter generated using resume + job details
        ↓
Interview questions generated based on resume + target role
        ↓
Portfolio generated as public shareable HTML page
```

---

## Getting Started Locally

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/wide-shunks-67/HireAI.git
cd HireAI
```

### 2. Backend setup
```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder (see `.env.example`):
```env
DATABASE_URL=postgresql://postgres:yourpassword@db.xxxx.supabase.co:5432/postgres
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GEMINI_API_KEY=your-gemini-api-key
RAPIDAPI_KEY=your-rapidapi-key
```

Run the backend:
```bash
uvicorn app.main:app --reload
```

- Backend runs at: `http://localhost:8000`
- API docs at: `http://localhost:8000/docs`

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Environment Variables

| Variable | Description | Where to get |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | [supabase.com](https://supabase.com) |
| `SECRET_KEY` | JWT secret key | Any random string |
| `ALGORITHM` | JWT algorithm | Use `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry | Use `60` |
| `GEMINI_API_KEY` | Google Gemini API key | [aistudio.google.com](https://aistudio.google.com) |
| `RAPIDAPI_KEY` | RapidAPI key for JSearch | [rapidapi.com](https://rapidapi.com) |

---

## Deployment

| Service | URL |
|---|---|
| Frontend (Vercel) | [hire-ai-beta-two.vercel.app](https://hire-ai-beta-two.vercel.app) |
| Backend (Render) | [hireai-n00h.onrender.com](https://hireai-n00h.onrender.com) |
| Database (Supabase) | PostgreSQL cloud database |

> **Note:** Backend is on Render's free tier. First request after inactivity may take up to 50 seconds (cold start). This is a known free tier limitation.

---

## What's New

- ✅ **Cover Letter Generator** — AI writes tailored cover letters per job
- ✅ **Interview Prep** — 6 AI-generated questions with model answers and tips
- ✅ **Mobile Responsive** — Works on all screen sizes
- ✅ **Session Persistence** — Login stays active after page refresh or resize
- ✅ **Job Filters** — Filter by location, type, remote, date, match score
- ✅ **Custom Job Search** — Search for any specific role or location
- ✅ **Portfolio Generator** — Shareable public URL with colorful design

---

## Future Improvements

- [ ] Resume rewriter — AI rewrites weak bullet points
- [ ] Email notifications for new job matches
- [ ] Stripe subscription for premium features
- [ ] Application tracker with Kanban board
- [ ] LinkedIn profile optimization tips

---

## Author

**Ansh Tayal**
- 2nd Year B.Tech CSE (AI) — CSVTU, Bhilai
- GitHub: [@wide-shunks-67](https://github.com/wide-shunks-67)
- Live Project: [hire-ai-beta-two.vercel.app](https://hire-ai-beta-two.vercel.app)

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
Built with ❤️ using React, FastAPI, and Google Gemini AI
</div>
