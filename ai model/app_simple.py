"""
SIMPLE AGRICULTURE ASSISTANT API - NO TRAINING REQUIRED
Sends the photo straight to a vision-capable LLM (Google Gemini here, free tier)
instead of a custom-trained classifier. One API call does both the identification
and the write-up.

WHY THIS IS EASIER THAN THE TRAINING APPROACH:
 - No dataset download, no Colab, no GPU, no merging datasets
 - No model files to manage (no .keras, no class_names.json)
 - Works on ANY crop/disease the LLM has seen, not just what you trained on
 - You can be live in under an hour

TRADE-OFF TO KNOW:
 - A purpose-trained model can be more consistently accurate on the exact
   diseases it was trained on, especially at high volume.
 - This approach depends on the LLM's general knowledge, which is strong for
   common diseases but can be less certain on rare/local ones. The prompt
   below asks it to say so honestly when unsure, instead of guessing.

SETUP:
  pip install -r requirements_simple.txt
  Get a free Gemini API key: https://aistudio.google.com/apikey
  export GEMINI_API_KEY="your-key-here"
  uvicorn app_simple:app --host 0.0.0.0 --port 8000

ENDPOINTS:
  POST /diagnose  - image in -> full structured diagnosis out
  POST /ask       - text question -> general agriculture Q&A
"""

import os
import json
import base64
import requests
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Simple Agriculture Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict to your real domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.0-flash:generateContent"
)

SYSTEM_INSTRUCTION = (
    "You are an agricultural expert analyzing a photo of a crop or plant. "
    "Identify the crop, and check for signs of disease, pest damage, or nutrient "
    "deficiency. Give practical, region-neutral treatment guidance. When naming "
    "pesticides/fungicides, use general chemical classes (e.g. copper-based "
    "fungicide) rather than specific brand products, and note that exact product "
    "choice and dosage should follow the product label and local agricultural "
    "extension guidance. If the photo is unclear or you're not confident, say so "
    "honestly rather than guessing. "
    "Respond with ONLY a raw JSON object (no markdown fences, no preamble) with "
    "exactly these keys: crop (string), disease (string, 'Healthy' if no issue "
    "found, or 'Unclear' if you can't tell), confidence (string: low/medium/high), "
    "cause (string), symptoms (string), treatment (string), organic_alternative "
    "(string), prevention (string), recovery_time (string), severity (string: "
    "none/low/medium/high)."
)

AG_SYSTEM_PROMPT = (
    "You are an agricultural expert assistant. Give practical, region-neutral "
    "guidance on crop diseases, pests, soil, fertilizer, irrigation, and general "
    "farming practices. When recommending pesticides/fungicides, name general "
    "chemical classes rather than specific brand products, and note that exact "
    "product choice/dosage should follow the product label and local agricultural "
    "extension guidance. Keep answers concise and farmer-friendly."
)


def call_gemini_vision(image_bytes: bytes, mime_type: str) -> dict:
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on server")

    b64_image = base64.b64encode(image_bytes).decode("utf-8")
    payload = {
        "system_instruction": {"parts": [{"text": SYSTEM_INSTRUCTION}]},
        "contents": [{
            "parts": [
                {"text": "Analyze this crop/plant photo."},
                {"inline_data": {"mime_type": mime_type, "data": b64_image}},
            ]
        }],
        "generationConfig": {"temperature": 0.2},
    }

    response = requests.post(
        f"{GEMINI_URL}?key={GEMINI_API_KEY}", json=payload, timeout=30
    )
    response.raise_for_status()
    data = response.json()
    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]

    cleaned = raw_text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Fall back gracefully instead of crashing the request
        return {
            "crop": "Unknown", "disease": "Unclear", "confidence": "low",
            "cause": raw_text, "symptoms": "", "treatment": "",
            "organic_alternative": "", "prevention": "", "recovery_time": "",
            "severity": "none",
        }


def call_gemini_text(prompt: str) -> str:
    if not GEMINI_API_KEY:
        return "(LLM not configured yet - set the GEMINI_API_KEY environment variable.)"

    payload = {
        "system_instruction": {"parts": [{"text": AG_SYSTEM_PROMPT}]},
        "contents": [{"parts": [{"text": prompt}]}],
    }
    response = requests.post(
        f"{GEMINI_URL}?key={GEMINI_API_KEY}", json=payload, timeout=30
    )
    response.raise_for_status()
    data = response.json()
    return data["candidates"][0]["content"]["parts"][0]["text"]


@app.get("/")
def root():
    return {"status": "ok", "message": "Simple Agriculture Assistant API is running"}


@app.post("/diagnose")
async def diagnose(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file")

    image_bytes = await file.read()
    report = call_gemini_vision(image_bytes, file.content_type)

    return {
        "class": f"{report.get('crop')}___{report.get('disease')}",
        "crop": report.get("crop"),
        "disease": report.get("disease"),
        "confidence_label": report.get("confidence"),
        "report": report,
    }


@app.post("/ask")
async def ask(question: str = Form(...)):
    if not question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    answer = call_gemini_text(question)
    return {"question": question, "answer": answer}
