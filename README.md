# HireAI — AI-Powered Job Platform

> An intelligent career platform that analyzes resumes, provides AI-powered career coaching, matches users to live job listings, and generates shareable portfolios — all powered by Google Gemini AI.

🌐 **Live Demo:** [hire-ai-beta-two.vercel.app](https://hire-ai-beta-two.vercel.app)

---

## Screenshots

| Resume Analysis | AI Career Coach | Job Matching |
|---|---|---|
| Upload PDF → AI scores and parses instantly | Chat with AI about your resume | Live jobs matched to your skills |

---

## Features

- **AI Resume Analysis** — Upload a PDF resume and get instant ATS score, skill detection, section-wise scoring, and improvement suggestions powered by Gemini AI
- **AI Career Coach** — Conversational chatbot that knows your resume and gives personalized career advice, interview tips, and cover letter help
- **Live Job Matching** — Fetches real job listings from JSearch API and matches them to your skills with a match percentage score
- **Job Filters** — Filter jobs by location, type, remote, date posted, and minimum match score
- **Portfolio Generator** — Auto-generates a beautiful, shareable portfolio page from your resume with a unique public URL
- **Authentication** — Secure JWT-based register and login system with bcrypt password hashing

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| Tailwind CSS | Styling |
| Axios | API calls |
| React Router | Navigation |

### Backend
| Technology | Purpose |
|---|---|
| Python + FastAPI | REST API framework |
| SQLAlchemy | ORM for database |
| PostgreSQL (Supabase) | Cloud database |
| bcrypt | Password hashing |
| JWT (python-jose) | Authentication tokens |
| pdfplumber | PDF text extraction |

### AI & External APIs
| Service | Purpose |
|---|---|
| Google Gemini API | Resume parsing, scoring, and chat |
| JSearch (RapidAPI) | Live job listings |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Supabase | Database hosting |

---

## Project Structure

```
HireAI/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── config.py        # Environment variables
│   │   ├── database.py      # Database connection
│   │   ├── models/
│   │   │   └── user.py      # SQLAlchemy models
│   │   ├── routers/
│   │   │   ├── auth.py      # Register & Login endpoints
│   │   │   ├── resume.py    # Resume upload & AI parsing
│   │   │   ├── chat.py      # AI career coach chat
│   │   │   ├── jobs.py      # Job search & matching
│   │   │   └── portfolio.py # Portfolio generation
│   │   └── schemas/
│   │       └── user.py      # Pydantic schemas
│   ├── requirements.txt
│   ├── Procfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js     # Axios instance
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx # Main dashboard
│   │   │   ├── Chat.jsx      # AI chat interface
│   │   │   └── Jobs.jsx      # Job matching page
│   │   └── App.jsx           # Root component
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
| POST | `/resume/upload` | Upload PDF and get AI analysis |
| POST | `/chat/message` | Send message to AI career coach |
| POST | `/jobs/search` | Search and match jobs |
| POST | `/portfolio/generate` | Generate portfolio page |
| GET | `/portfolio/view/{slug}` | View public portfolio |

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

Create a `.env` file in the `backend` folder:
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

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

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
| `GEMINI_API_KEY` | Google Gemini API key | [aistudio.google.com](https://aistudio.google.com) |
| `RAPIDAPI_KEY` | RapidAPI key for JSearch | [rapidapi.com](https://rapidapi.com) |

---

## How It Works

```
User uploads PDF resume
        ↓
pdfplumber extracts raw text
        ↓
Text sent to Gemini AI with structured prompt
        ↓
Gemini returns JSON (skills, experience, score)
        ↓
Results displayed on dashboard
        ↓
User chats with AI (resume injected as context)
        ↓
Jobs fetched from JSearch API
        ↓
Match score calculated per job
        ↓
Portfolio generated as public HTML page
```

---

## Deployment

| Service | URL |
|---|---|
| Frontend (Vercel) | [hire-ai-beta-two.vercel.app](https://hire-ai-beta-two.vercel.app) |
| Backend (Render) | [hireai-n00h.onrender.com](https://hireai-n00h.onrender.com) |
| Database (Supabase) | PostgreSQL cloud database |

> **Note:** The backend is hosted on Render's free tier and may take up to 50 seconds to respond after a period of inactivity (cold start). This is a free tier limitation.

---

## Future Improvements

- [ ] Cover letter generator
- [ ] Interview preparation with mock questions
- [ ] Resume rewriter with AI suggestions
- [ ] Email notifications for job matches
- [ ] Mobile responsive design
- [ ] Stripe subscription for premium features

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
