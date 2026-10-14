# CareerMatch AI — Ready-to-run MVP

A responsive React + FastAPI application for CV extraction, AI-assisted job matching, skill-gap analysis and a personalized career roadmap.

## Requirements
- Python 3.10–3.12 recommended
- Node.js 20 LTS or newer
- VS Code
- Internet connection for first-time package installation and downloading the sentence-transformers model

## 1. Open the folder
Unzip `CareerMatch-AI.zip`. In VS Code choose **File → Open Folder** and select `careermatch-ai`.

## 2. Start the backend (VS Code terminal 1)
### Windows PowerShell
```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
If PowerShell blocks activation, skip activation and use:
```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```
### macOS/Linux
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
Visit http://localhost:8000/docs for interactive API documentation.

### Account configuration
- User accounts are stored in `backend/careermatch.sqlite3` by default. Set `AUTH_DB_PATH` to change the location.
- Set a stable, long random `AUTH_SECRET` before deploying; without it, the development server generates a temporary secret and sessions end when it restarts.
- Set `AUTH_COOKIE_SECURE=true` when serving the app over HTTPS. Configure `FRONTEND_ORIGINS` with the exact frontend origin when deploying.

**First AI analysis:** `all-MiniLM-L6-v2` will download from Hugging Face on the first match request. This can take some time. If model downloading is unavailable, the backend falls back to TF-IDF matching. To force the lighter mode for demos, set `MATCH_ENGINE=tfidf` before starting the backend (`$env:MATCH_ENGINE="tfidf"` in PowerShell, `export MATCH_ENGINE=tfidf` on macOS/Linux).

## 3. Start the frontend (VS Code terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 in your browser. Keep both terminals running.

## 4. Demo the application
1. On Dashboard, click **Try sample data**.
2. On Job Matcher, click **Analyze Job Match**.
3. Review the match score, matched/missing skills and semantic similarity.
4. Open **Career Roadmap** for actionable suggestions.
5. Go to **CV Analyzer** to upload your own PDF, DOCX or TXT CV.

## Notes / MVP limitations
- Email registration and login use SQLite-backed accounts, scrypt password hashes, and signed HTTP-only session cookies. Match history (job title, score, date, missing skill count) remains in the **current browser's localStorage** only; uploaded CV text is parsed in server memory.
- LinkedIn and Indeed are not connected yet. LinkedIn OIDC requires an authorized LinkedIn app and only provides basic identity/profile information. Indeed's published APIs are partner integrations for jobs, candidates, and employers and require appropriate partner access. Choose whether the intended feature is provider sign-in, profile import, or job search before configuring those integrations; do not scrape the sites.
- This version has no OCR or generative LLM. The roadmap uses transparent rules, not generative AI.
- The match score combines 65% job-skill coverage with 35% semantic similarity when skills are detected in the job description; otherwise it uses text similarity alone. It is **not** a hiring probability.
- Skill extraction uses a curated keyword dictionary and may miss synonyms or unfamiliar skills. Users should verify extracted information.
- Only upload CVs you are authorized to process. For a public deployment, add authentication, rate limits, malware checks, deletion controls, retention policies, privacy notice and stronger data protection before accepting real personal information.
- For hosted deployment, set `VITE_API_URL` to your backend URL at frontend build time and `FRONTEND_ORIGINS` to the deployed frontend URL on the backend. Heavy model downloads and memory usage may exceed small free hosting limits.

## Structure
```
careermatch-ai/
  backend/
    main.py
    requirements.txt
  frontend/
    index.html
    package.json
    vite.config.js
    src/
      main.jsx
      LoginPage.jsx
      style.css
  README.md
```
