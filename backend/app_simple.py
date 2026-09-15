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
  Add GEMINI_API_KEY to backend/.env
  uvicorn app_simple:app --host 0.0.0.0 --port 8000

ENDPOINTS:
  POST /diagnose  - image in -> full structured diagnosis out
  POST /ask       - text question -> general agriculture Q&A
"""

import os
import json
import base64
from google import genai
from google.genai import types
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load .env from this backend/ directory
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = FastAPI(title="Simple Agriculture Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict to your real domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

# ── Plant / Crop Image Guard ─────────────────────────────────────────────────
# This prompt is used in a FAST pre-check before running the full diagnosis.
# We ask the model one simple YES/NO question: is this a plant / crop / leaf?
PLANT_CHECK_PROMPT = (
    "Look at this image carefully. "
    "Is this image of a plant, crop, leaf, flower, tree, vegetable, fruit, "
    "or any kind of agricultural / botanical subject? "
    "Reply with ONLY a single word — YES or NO — and nothing else. "
    "If you see ANY plant or plant part (leaf, stem, root, flower, seed, pod, "
    "fruit, bark, grass, weed) reply YES. "
    "If the image is of a person, animal, vehicle, landscape without plants, "
    "food product, building, object, or anything unrelated to plants/agriculture, "
    "reply NO."
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


FALLBACK_MODELS = [
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-1.5-flash-8b',
    'gemini-1.5-flash',
    'gemini-3.5-flash',
]


def check_is_plant(image_bytes: bytes, mime_type: str) -> bool:
    """
    Fast pre-flight check: ask Gemini if the image contains a plant / crop / leaf.
    Returns True if it IS a plant image, False otherwise.
    On any API error, returns True (fail-open: let the main diagnosis handle it).
    """
    if not client:
        return True  # Can't check without a client — let the main call handle auth error

    for model_name in FALLBACK_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    PLANT_CHECK_PROMPT,
                ],
                config=types.GenerateContentConfig(
                    temperature=0.0,  # Deterministic for a YES/NO question
                    max_output_tokens=5,
                ),
            )
            answer = (response.text or "").strip().upper()
            # Accept "YES" / "YES." / starts-with-YES
            return answer.startswith("YES")
        except Exception:
            continue  # Try next model

    return True  # Fail-open if all models fail


def call_gemini_vision(image_bytes: bytes, mime_type: str) -> dict:
    if not client:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on server")

    last_error = ""
    for model_name in FALLBACK_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    "Analyze this crop/plant photo.",
                ],
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    temperature=0.2,
                ),
            )
            raw_text = response.text or ""
            cleaned = raw_text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            try:
                return json.loads(cleaned)
            except json.JSONDecodeError:
                return {
                    "crop": "Unknown", "disease": "Unclear", "confidence": "low",
                    "cause": raw_text, "symptoms": "", "treatment": "",
                    "organic_alternative": "", "prevention": "", "recovery_time": "",
                    "severity": "none",
                }
        except Exception as e:
            last_error = str(e)
            continue

    return {
        "crop": "Error", "disease": "API Error", "confidence": "low",
        "cause": f"Google Gemini API Error: {last_error}", "symptoms": "", "treatment": "",
        "organic_alternative": "", "prevention": "", "recovery_time": "",
        "severity": "none",
    }


def call_gemini_text(prompt: str) -> str:
    if not client:
        return "(LLM not configured yet - set the GEMINI_API_KEY in backend/.env)"

    last_error = ""
    for model_name in FALLBACK_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=AG_SYSTEM_PROMPT,
                ),
            )
            if response.text:
                return response.text
        except Exception as e:
            last_error = str(e)
            continue

    return f"API Error (Quota exceeded or server issue): {last_error}"


@app.get("/")
def root():
    configured = bool(GEMINI_API_KEY)
    return {
        "status": "ok",
        "message": "Simple Agriculture Assistant API is running",
        "geminiConfigured": configured,
    }


@app.post("/diagnose")
async def diagnose(file: UploadFile = File(...)):
    # ── Step 1: Basic file type guard ────────────────────────────────────────
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file.")

    image_bytes = await file.read()

    # ── Step 2: Plant / Agriculture image guard (pre-flight AI check) ────────
    # Ask Gemini one quick YES/NO question before running the full diagnosis.
    # If the image is not a plant, crop, or leaf, return HTTP 422 immediately.
    is_plant = check_is_plant(image_bytes, file.content_type)
    if not is_plant:
        raise HTTPException(
            status_code=422,
            detail=(
                "This image does not appear to be a plant, crop, or leaf photo. "
                "Please upload a clear photo of a crop leaf, plant, or agricultural subject "
                "so Crop Doctor AI can diagnose it accurately."
            ),
        )

    # ── Step 3: Full agricultural diagnosis ──────────────────────────────────
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
