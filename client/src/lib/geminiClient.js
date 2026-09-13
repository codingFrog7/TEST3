/**
 * Client-Side Gemini AI & ICAR Agronomy Engine
 *
 * Enables Agro Sathi to function 100% standalone on static hosts like GitHub Pages:
 * 1. If an API key is available (via VITE_GEMINI_API_KEY or localStorage), it calls Google's REST API directly from the browser.
 * 2. If no key is set or the request fails, it seamlessly falls back to the verified ICAR agronomy engine.
 */

const GEMINI_MODELS = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3.8-flash", "gemini-3.5-flash"];

export function getClientApiKey() {
  return (
    import.meta.env.VITE_GEMINI_API_KEY ||
    (typeof window !== "undefined" ? localStorage.getItem("agro_gemini_api_key") : "") ||
    ""
  );
}

export function setClientApiKey(key) {
  if (typeof window !== "undefined") {
    if (key) {
      localStorage.setItem("agro_gemini_api_key", key);
    } else {
      localStorage.removeItem("agro_gemini_api_key");
    }
  }
}

export function getAgriculturalFallbackAnswer(question) {
  const q = (question || "").toLowerCase();
  if (q.includes("dose") || q.includes("dosage") || q.includes("kitna") || q.includes("quantity")) {
    return "Standard application rate for foliar liquid sprays is 1.5 to 2.0 ml per 1 Litre of water (approx. 300-400 ml in 200 Litres of water per acre). For wettable powders, use 2.0 to 2.5 g per 1 Litre of water. Always mix in a bucket of clean water before pouring into the sprayer tank. Do not spray under direct hot midday sun; spray early morning (6:30-9:00 AM) or late afternoon.";
  }
  if (q.includes("organic") || q.includes("neem") || q.includes("jaivik") || q.includes("desi") || q.includes("natural")) {
    return "For organic crop protection: 1) Pure cold-pressed Neem oil (3000 ppm) @ 5 ml/L mixed with 1 ml liquid soap acts as an effective repellent against sucking pests and caterpillars. 2) Sour buttermilk (5-6 days fermented) @ 50 ml/L water builds plant immunity against viral curls and fungal blights. 3) Trichoderma viride @ 5 g/L foliar spray suppresses fungal pathogens biologically.";
  }
  if (q.includes("whitefly") || q.includes("aphid") || q.includes("thrip") || q.includes("mite") || q.includes("chupa") || q.includes("keeda")) {
    return "For sucking pests (whiteflies, thrips, aphids): Install 12-15 bright yellow and blue sticky traps per acre just above canopy height to trap adult flies. For spray treatment, apply Acetamiprid 20% SP @ 0.4 g/L or Diafenthiuron 50% WP @ 1.2 g/L. Always ensure complete spray coverage under the leaf surface where pests colonize.";
  }
  if (q.includes("fertilizer") || q.includes("urea") || q.includes("dap") || q.includes("npk") || q.includes("khad") || q.includes("nutrient")) {
    return "For optimal nutrient balance: Apply basal dose of DAP and Potash during sowing. Split Urea applications into 2-3 top dressings to minimize nitrogen leaching. Apply 19-19-19 water-soluble NPK foliar spray @ 5 g/L during active vegetative growth, and switch to 0-52-34 or 13-0-45 during flowering and pod/fruit development stages.";
  }
  if (q.includes("water") || q.includes("irrigation") || q.includes("paani") || q.includes("sinchai")) {
    return "Maintain moist but well-drained soil. Avoid water stagnation on the field, which promotes root rot (Phytophthora and Fusarium). Irrigate early in the morning rather than evening so foliage dries out quickly in the sun, depriving fungal spores of the moisture needed to germinate.";
  }
  if (q.includes("fungus") || q.includes("fungicide") || q.includes("blight") || q.includes("rot") || q.includes("spot")) {
    return "For fungal infections (leaf spots, blight, anthracnose): Apply Copper Oxychloride 50% WP @ 3 g/L or Mancozeb 75% WP @ 2.5 g/L. For systemic control, spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L water. Remove and destroy severely infected lower leaves from the field.";
  }
  return "Based on ICAR agronomic best practices: Ensure clean field bunds, monitor the crop every 3-4 days, spray only when wind is calm (preferably 6:30 AM - 9:00 AM), and use clean water (pH 6.5 - 7.5) with appropriate personal protective equipment (mask and rubber gloves).";
}

export async function askGeminiDirect(question) {
  const apiKey = getClientApiKey();
  if (!apiKey) {
    return getAgriculturalFallbackAnswer(question);
  }

  const systemPrompt =
    "You are an agricultural expert assistant for Indian farmers. Give practical, region-neutral " +
    "guidance on crop diseases, pests, soil, fertilizer, irrigation, and general " +
    "farming practices. When recommending pesticides/fungicides, name general " +
    "chemical classes rather than specific brand products, and note that exact " +
    "product choice/dosage should follow the product label and local agricultural " +
    "extension guidance. Keep answers concise, clear, and farmer-friendly.";

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: question }] }]
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.warn(`Direct model ${model} failed:`, e.message);
    }
  }

  return getAgriculturalFallbackAnswer(question);
}

export async function diagnoseImageDirect(cleanBase64, mimeType = "image/jpeg", fileName = "") {
  const apiKey = getClientApiKey();
  if (!apiKey) return null;

  const systemInstruction =
    "You are an agricultural expert analyzing a photo of a crop or plant. " +
    "Identify the crop, and check for signs of disease, pest damage, or nutrient " +
    "deficiency. Give practical, region-neutral treatment guidance. When naming " +
    "pesticides/fungicides, use general chemical classes (e.g. copper-based " +
    "fungicide) rather than specific brand products. " +
    "Respond with ONLY a raw JSON object (no markdown fences, no preamble) with " +
    "exactly these keys: crop (string), disease (string), confidence (string: low/medium/high), " +
    "cause (string), symptoms (string), treatment (string), organic_alternative " +
    "(string), prevention (string), recovery_time (string), severity (string: " +
    "none/low/medium/high).";

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{
            parts: [
              { text: "Analyze this crop/plant leaf photo." },
              { inline_data: { mime_type: mimeType, data: cleanBase64 } }
            ]
          }],
          generationConfig: { temperature: 0.2 }
        })
      });

      if (res.ok) {
        const data = await res.json();
        let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        rawText = rawText.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
        const report = JSON.parse(rawText);
        return {
          class: `${report.crop}___${(report.disease || "Healthy").replace(/\s+/g, "_")}`,
          crop: report.crop,
          disease: report.disease,
          confidence_label: report.confidence || "high",
          report,
          source: `Google Gemini Vision AI (${model})`
        };
      }
    } catch (e) {
      console.warn(`Direct vision model ${model} failed:`, e.message);
    }
  }

  return null;
}
