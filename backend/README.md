# Agro Sathi — Python FastAPI Backend

This is the **Python sidecar** for the Agro Sathi Crop Doctor feature.
It uses Google Gemini Vision to analyze crop/plant photos.

## One-time Setup

```bash
# 1. Go into this folder
cd backend

# 2. Create a Python virtual environment
python -m venv venv

# 3. Activate it (Windows)
venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements_simple.txt

# 5. Add your Gemini API key
#    Edit backend/.env and paste your key:
#    GEMINI_API_KEY=AIzaSy...your_key_here
```

Get a FREE key at: https://aistudio.google.com/app/apikey

## Run the server

```bash
# From the backend/ folder, with venv activated:
uvicorn app_simple:app --host 0.0.0.0 --port 8000 --reload
```

The server runs on http://localhost:8000

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | / | Health check |
| POST | /diagnose | Upload image → JSON diagnosis |
| POST | /ask | Text question → agriculture answer |

## Running with the full project

Open **two terminals**:

**Terminal 1 — Node.js frontend+proxy:**
```bash
pnpm dev
```

**Terminal 2 — Python Gemini backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn app_simple:app --host 0.0.0.0 --port 8000 --reload
```

Then open http://localhost:3000/detect in your browser.
