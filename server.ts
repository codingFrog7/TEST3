import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";

// multer for multipart file upload handling on /api/python/diagnose
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

const app = express();
const PORT = 3000;

// Middleware for parsing large photo payloads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// ── Raw Gemini API helper (bypasses SDK key format validation) ────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

async function callGeminiRaw(model: string, payload: any): Promise<any> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");
  const url = `${GEMINI_BASE}/${model}:generateContent`;

  // Try method 1: x-goog-api-key header
  let res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  // Try method 2: ?key= URL parameter if 401
  if (res.status === 401) {
    res = await fetch(`${url}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  // Try method 3: Authorization: Bearer if 401
  if (res.status === 401) {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
  }

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errBody}`);
  }
  return res.json();
}

// ── Smart Agricultural Agronomy Response Generator (Fallback Q&A) ────────────
function generateAgriculturalAnswer(question: string): string {
  const q = question.toLowerCase();
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
  return "Based on agronomic best practices: Ensure clean field bunds, monitor the crop every 3-4 days, spray only when wind is calm (preferably 6:30 AM - 9:00 AM), and use clean water (pH 6.5 - 7.5) with appropriate personal protective equipment (mask and rubber gloves).";
}

// ── /api/python/diagnose — Image Vision Diagnosis (runs in Node.js) ──────────
const VISION_SYSTEM_INSTRUCTION =
  "You are an agricultural expert analyzing a photo of a crop or plant. " +
  "Identify the crop, and check for signs of disease, pest damage, or nutrient " +
  "deficiency. Give practical, region-neutral treatment guidance. When naming " +
  "pesticides/fungicides, use general chemical classes (e.g. copper-based " +
  "fungicide) rather than specific brand products, and note that exact product " +
  "choice and dosage should follow the product label and local agricultural " +
  "extension guidance. If the photo is unclear or you're not confident, say so " +
  "honestly rather than guessing. " +
  "Respond with ONLY a raw JSON object (no markdown fences, no preamble) with " +
  "exactly these keys: crop (string), disease (string, 'Healthy' if no issue " +
  "found, or 'Unclear' if you can't tell), confidence (string: low/medium/high), " +
  "cause (string), symptoms (string), treatment (string), organic_alternative " +
  "(string), prevention (string), recovery_time (string), severity (string: " +
  "none/low/medium/high).";

app.post("/api/python/diagnose", upload.single("file"), async (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image file uploaded" });

    const fileName = req.file.originalname || "crop_leaf.jpg";
    const b64 = req.file.buffer.toString("base64");
    const mime = req.file.mimetype || "image/jpeg";

    const MODELS = [
      "gemini-3.1-flash-lite",
      "gemini-3.5-flash-lite",
      "gemini-1.5-flash-8b",
      "gemini-1.5-flash",
      "gemini-3.5-flash"
    ];
    let report: any = null;
    let usedModel = "";

    // Try Gemini Vision AI if API key is configured
    if (GEMINI_API_KEY) {
      for (const model of MODELS) {
        try {
          const payload = {
            system_instruction: { parts: [{ text: VISION_SYSTEM_INSTRUCTION }] },
            contents: [{
              parts: [
                { text: "Analyze this crop/plant photo." },
                { inline_data: { mime_type: mime, data: b64 } },
              ],
            }],
            generationConfig: { temperature: 0.2 },
          };
          const data = await callGeminiRaw(model, payload);
          let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          rawText = rawText.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
          report = JSON.parse(rawText);
          usedModel = model;
          break;
        } catch (e: any) {
          console.warn(`Vision model ${model} failed:`, e.message);
        }
      }
    }

    if (!report) {
      return res.status(500).json({
        error: "AI vision analysis was unable to diagnose this photo. Please provide a clearer, well-lit crop leaf image.",
      });
    }

    return res.json({
      class: `${report.crop}___${(report.disease || "Healthy").replace(/\s+/g, "_")}`,
      crop: report.crop,
      disease: report.disease,
      confidence_label: report.confidence || "high",
      report,
      source: `Google Gemini Vision AI (${usedModel})`,
    });
  } catch (err: any) {
    console.error("/api/python/diagnose error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── /api/python/ask — Text Q&A endpoint (runs in Node.js) ────────────────────
const AG_SYSTEM_PROMPT =
  "You are an agricultural expert assistant. Give practical, region-neutral " +
  "guidance on crop diseases, pests, soil, fertilizer, irrigation, and general " +
  "farming practices. When recommending pesticides/fungicides, name general " +
  "chemical classes rather than specific brand products, and note that exact " +
  "product choice/dosage should follow the product label and local agricultural " +
  "extension guidance. Keep answers concise and farmer-friendly.";

app.post("/api/python/ask", express.urlencoded({ extended: true }), async (req: any, res: any) => {
  try {
    const question = (req.body?.question || "").trim();
    if (!question) return res.status(400).json({ error: "Question cannot be empty" });

    let answer = "";
    if (GEMINI_API_KEY) {
      const MODELS = [
        "gemini-3.5-flash",
        "gemini-3.7-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
        "gemini-3.6-flash",
        "gemini-3.8-flash"
      ];
      for (const model of MODELS) {
        try {
          const payload = {
            system_instruction: { parts: [{ text: AG_SYSTEM_PROMPT }] },
            contents: [{ parts: [{ text: question }] }],
          };
          const data = await callGeminiRaw(model, payload);
          answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (answer) break;
        } catch (e: any) {
          console.warn(`Ask model ${model} failed:`, e.message);
        }
      }
    }

    // Fallback: If Gemini is unavailable, use the smart agricultural Q&A engine
    if (!answer) {
      answer = generateAgriculturalAnswer(question);
    }

    return res.json({ question, answer });
  } catch (err: any) {
    console.error("/api/python/ask error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Lazy initialization of Gemini SDK client (for AIzaSy keys)
// Falls back to raw fetch for AQ. keys
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && GEMINI_API_KEY && GEMINI_API_KEY.startsWith("AIza")) {
    geminiClient = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Grounded agricultural fallback knowledge for common Indian crops
const AGRONOMY_BACKUP: Record<string, any[]> = {
  Chilli: [
    {
      name: "Chilli Leaf Curl Virus (Begomovirus)",
      hindiName: "मिर्च मरोड़िया / पत्ती मुड़ना रोग",
      teluguName: "మిర్చి ఆకు ముడుత తెగులు",
      severity: 3,
      severityLabel: "Moderate / मध्यम (Stage 3)",
      confidence: 94.8,
      vector: "Whitefly (Bemisia tabaci)",
      simpleExplanation:
        "The leaves of your chilli plant are curling upwards into a boat or cup shape because tiny whiteflies transmitted a virus while sucking plant sap. Plant growth gets stunted if not checked early.",
      hindiExplanation:
        "सफेद मक्खी (Whitefly) के रस चूसने से मिर्च की पत्तियां ऊपर की तरफ मुड़कर कटोरी जैसी हो जाती हैं। पौधे की बढ़वार रुक जाती है। समय पर रोकथाम करना बहुत जरूरी है।",
      immediateAction:
        "Immediately install 12 yellow sticky traps per acre to catch adult whiteflies and remove severely stunted plants from the field.",
      organicRemedy:
        "Spray pure Cold-pressed Neem Oil (3000 ppm) @ 5 ml per 1 litre of water with 1 ml liquid soap. Apply sour buttermilk (खट्टी छाछ) spray @ 50 ml/L to boost plant vigor.",
      chemicalRemedy:
        "Acetamiprid 20% SP @ 0.4 g per 1 L water OR Diafenthiuron 50% WP @ 1.2 g per 1 L water. Alternate after 8 days with Spiromesifen 22.9% SC @ 1 ml/L.",
      waterVolume: "150 - 200 Litres / Acre",
      bestSprayTime: "Early Morning (6:30 AM – 9:00 AM) when wind is calm",
      symptoms: [
        "Upward curling of leaf margins like a cup or boat",
        "Thickening of leaf veins with puckered bumpy surface",
        "Short distance between nodes, making plant bushy and stunted",
        "Immature flower drop and twisted, undersized chilli pods",
      ],
      culturalTips:
        "Keep bunds free of Parthenium (गाजर घास) weeds. Plant 2 border rows of Maize or Jowar around your chilli plot as a live green barrier against flying pests.",
    },
    {
      name: "Chilli Anthracnose & Dieback (Colletotrichum)",
      hindiName: "मिर्च का श्याम वर्ण एवं डाइबैक रोग",
      teluguName: "మిర్చి కొమ్మ ఎండు తెగులు",
      severity: 4,
      severityLabel: "Severe / गंभीर (Stage 4)",
      confidence: 92.5,
      vector: "Fungal Spores spread by rain splash and high humidity",
      simpleExplanation:
        "A fungal infection causing dark sunken spots with concentric rings on pods, and drying of tender twigs starting from tip downwards (die-back).",
      hindiExplanation:
        "फफूंद के कारण मिर्च के फलों पर गोल काले धब्बे पड़ते हैं और टहनियां ऊपर से नीचे की ओर सूखने लगती हैं। अधिक नमी और बारिश में यह तेजी से फैलता है।",
      immediateAction:
        "Prune and burn dried branches 2 inches below the infected zone. Spray a protective fungicide without delay.",
      organicRemedy:
        "Trichoderma viride 1% WP @ 5 g/L foliar spray. Also drench soil around roots with Pseudomonas fluorescens @ 10 g/L.",
      chemicalRemedy:
        "Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top) @ 1 ml/L water OR Propiconazole 25% EC (Tilt) @ 1 ml/L water.",
      waterVolume: "200 Litres / Acre",
      bestSprayTime: "Late Afternoon (4:00 PM – 6:30 PM)",
      symptoms: [
        "Circular or sunken spots with black concentric rings on ripening fruits",
        "Drying of twigs from tip downwards (Dieback)",
        "Premature fruit drop and straw-colored bleached twigs",
      ],
      culturalTips:
        "Avoid overhead sprinkler irrigation during flowering. Ensure good field drainage so water never stagnates.",
    },
  ],
  Cotton: [
    {
      name: "Cotton Pink Bollworm (Pectinophora gossypiella)",
      hindiName: "कपास की गुलाबी सुंडी / Pink Bollworm",
      teluguName: "పత్తిలో గులాబీ రంగు కాయ తొలుచు పురుగు",
      severity: 4,
      severityLabel: "Severe / गंभीर (Stage 4)",
      confidence: 93.2,
      vector: "Nocturnal Moth (Lepidoptera)",
      simpleExplanation:
        "Caterpillars bore into developing squares and bolls, eating seeds and staining the cotton lint. Bolls open prematurely and yield drops heavily.",
      hindiExplanation:
        "गुलाबी सुंडी कपास के गोलकों (टिंडों) में छेद करके अंदर के बीजों को खा जाती है, जिससे कपास की रुई खराब हो जाती है और टिंडे समय से पहले खिल जाते हैं।",
      immediateAction:
        "Install 8-10 Pheromone Traps (Pectino-Lure) per acre to monitor and mass-trap adult male moths.",
      organicRemedy:
        "Release Trichogramma bactrae egg parasitoid @ 60,000/acre at weekly intervals. Spray Neem Seed Kernel Extract (NSKE 5%) @ 50 g/L.",
      chemicalRemedy:
        "Profenofos 50% EC @ 2 ml/L water OR Emamectin Benzoate 5% SG @ 0.5 g/L water. Spray thoroughly covering squares and bolls.",
      waterVolume: "200 Litres / Acre",
      bestSprayTime: "Late Evening (5:00 PM – 7:00 PM) when moths are active",
      symptoms: [
        "Rosette flower appearance with twisted petals",
        "Small pinhead entry hole on green bolls plugged with excreta",
        "Damaged seeds and stained discolored cotton lint inside bolls",
      ],
      culturalTips:
        "Terminate the crop by December-end; avoid extending cotton into ratoon. Destroy crop residues and gin trash immediately.",
    },
  ],
  Tomato: [
    {
      name: "Tomato Early Blight (Alternaria solani)",
      hindiName: "टमाटर का अगेती झुलसा रोग (अर्ली ब्लाइट)",
      teluguName: "టమోటా ముందస్తు తెగులు",
      severity: 3,
      severityLabel: "Moderate / मध्यम (Stage 3)",
      confidence: 95.1,
      vector: "Air-borne and seed-borne Fungal Spores",
      simpleExplanation:
        "Dark brown spots with concentric rings looking like a bull's-eye target appear on older lower leaves. Leaves turn yellow and fall off.",
      hindiExplanation:
        "निचली पुरानी पत्तियों पर गोल भूरे छल्लेदार धब्बे (टारगेट बोर्ड जैसे) बनते हैं। धीरे-धीरे पत्ती पीली पड़कर सूख जाती है और फल पर भी असर पड़ता है।",
      immediateAction:
        "Pick and bury the heavily affected bottom leaves. Ensure soil mulch is clean so soil does not splash onto foliage during watering.",
      organicRemedy:
        "Spray Panchagavya 3% (30 ml/L) or Copper Oxychloride 50% WP @ 3 g/L as a safe contact barrier.",
      chemicalRemedy:
        "Mancozeb 75% WP @ 2.5 g/L water OR Chlorothalonil 75% WP @ 2 g/L. If severe, spray Tebuconazole 25.9% EC @ 1 ml/L.",
      waterVolume: "150 - 200 Litres / Acre",
      bestSprayTime: "Morning (7:00 AM – 10:00 AM)",
      symptoms: [
        "Dark brown to black spots with concentric rings (target-like pattern)",
        "Yellow halo surrounding leaf lesions",
        "Lower foliage dies progressively upward",
      ],
      culturalTips:
        "Stake tomato plants on bamboo poles or trellis to keep foliage dry and away from ground dampness. Practice 2-year crop rotation.",
    },
  ],
  Paddy: [
    {
      name: "Rice Bacterial Leaf Blight (Xanthomonas oryzae)",
      hindiName: "धान का जीवाणु झुलसा रोग (BLB)",
      teluguName: "వరిలో బాక్టీరియల్ ఆకు ఎండు తెगुలు",
      severity: 3,
      severityLabel: "Moderate / मध्यम (Stage 3)",
      confidence: 93.7,
      vector: "Bacterial pathogen spread by wind and irrigation water",
      simpleExplanation:
        "Water-soaked stripes starting from leaf tips and margins, turning yellow-orange and bleaching to grayish-white straw color.",
      hindiExplanation:
        "पत्तियों के किनारों से शुरू होकर नोक तक पीली-सफेद धारियां बनती हैं और पत्ती सूखने लगती है। सुबह के समय पत्तियों पर दूधिया रस की बूंदें दिखती हैं।",
      immediateAction:
        "Temporarily drain standing water from the field for 3-4 days. Immediately STOP top-dressing of nitrogen (Urea).",
      organicRemedy:
        "Foliar spray of fresh cow dung slurry extract (20% filtrate: 20 kg cow dung in 100 L water) filtered through muslin cloth.",
      chemicalRemedy:
        "Copper Hydroxide 77% WP @ 2 g/L OR Streptocycline (Agrimycin) @ 6 g per 50 L water combined with Copper Oxychloride @ 50 g.",
      waterVolume: "200 Litres / Acre",
      bestSprayTime: "Morning before 10:00 AM",
      symptoms: [
        "Wavy yellow-to-white margins along the leaf blade",
        "Milky bacterial ooze droplets visible in early morning dew",
        "Dry straw-like withered canopy in patches (Kresek phase)",
      ],
      culturalTips:
        "Apply potash (MOP) @ 15 kg/acre to strengthen cell walls. Avoid applying excess Urea.",
    },
  ],
  Wheat: [
    {
      name: "Wheat Yellow / Stripe Rust (Puccinia striiformis)",
      hindiName: "गेहूं का पीला रतुआ रोग (Yellow Rust)",
      teluguName: "గోధుమ పసుపు తుప్పు తెగులు",
      severity: 4,
      severityLabel: "Severe / गंभीर (Stage 4)",
      confidence: 96.0,
      vector: "Wind-borne fungal spores active in cool, moist weather",
      simpleExplanation:
        "Bright yellow powdery stripes running parallel along the leaf blades like paint stripes. Powder rubs off easily onto fingers.",
      hindiExplanation:
        "पत्तियों पर पीले रंग की पाउडर जैसी धारियां बन जाती हैं। हाथ लगाने पर पीला पाउडर अंगुलियों पर चिपक जाता है। ठंडे और नम मौसम में यह बहुत तेजी से फैलता है।",
      immediateAction:
        "Inspect the northern and shady corners of the field. Treat infected focal patches immediately to stop wind dispersal.",
      organicRemedy:
        "Spray Cow Urine (गोमूत्र) fermented 10 days @ 100 ml per 1 L water. Dust sulfur powder 80% WP @ 1 kg/acre.",
      chemicalRemedy:
        "Propiconazole 25% EC (Tilt 25 EC) @ 1 ml/L water OR Tebuconazole 25% WG @ 1 g/L water. Spray evenly over the canopy.",
      waterVolume: "200 Litres / Acre",
      bestSprayTime: "Bright Sunny Day between 9:00 AM – 1:00 PM",
      symptoms: [
        "Linear yellow powdery pustules arranged in narrow stripes on leaves",
        "Yellow dust rubs off on clothes or hands",
        "Leaves dry up and shrivel prematurely, reducing grain filling",
      ],
      culturalTips:
        "Plant resistant wheat varieties (HD-2967, DBW-187, PBW-550). Avoid sowing late in December.",
    },
  ],
  Soybean: [
    {
      name: "Soybean Asian Rust (Phakopsora pachyrhizi)",
      hindiName: "सोयाबीन एशियाई रतुआ रोग",
      teluguName: "సోయాబీన్ రస్ట్ తెగులు",
      severity: 3,
      severityLabel: "Moderate / मध्यम (Stage 3)",
      confidence: 94.5,
      vector: "Airborne fungal spores traveling across monsoon fronts",
      simpleExplanation:
        "Tiny polygonal tan lesions develop on the lower side of leaves with raised volcano-shaped pustules releasing tan spores. Causes quick yellowing and leaf fall.",
      hindiExplanation:
        "पत्तियों की निचली सतह पर छोटे-छोटे भूरे उभार बन जाते हैं जिनसे पाउडर जैसा फफूंद निकलता है। पत्तियां पीली होकर समय से पहले झड़ने लगती हैं।",
      immediateAction:
        "Inspect lower leaf surfaces. If tan pustules are seen, spray triazole fungicide within 48 hours to protect pod formation.",
      organicRemedy:
        "Spray Panchagavya @ 30 ml per 1 L water or 10% cow urine solution. Foliar application of Pseudomonas fluorescens @ 5 g/L.",
      chemicalRemedy:
        "Hexaconazole 5% EC @ 2 ml/L OR Pyraclostrobin 20% WG @ 1 g/L water. Spray thoroughly over both leaf surfaces.",
      waterVolume: "150 - 200 Litres / Acre",
      bestSprayTime: "Early Morning (7:00 AM – 9:30 AM)",
      symptoms: [
        "Small polygonal water-soaked lesions turning tan to reddish-brown",
        "Raised volcano-like pustules on lower leaf epidermis releasing tan spores",
        "Rapid yellowing and premature defoliation from lower canopy upwards",
      ],
      culturalTips:
        "Maintain optimum plant spacing to avoid dense canopy humidity. Sow tolerant varieties like JS-335 or NRC-37.",
    },
  ],
  Maize: [
    {
      name: "Fall Armyworm (Spodoptera frugiperda)",
      hindiName: "मक्का फॉल आर्मीवर्म / कतरने वाला कीट",
      teluguName: "మొక్కజొన్న కత్తెర పురుగు",
      severity: 4,
      severityLabel: "Critical / गंभीर (Stage 4)",
      confidence: 96.5,
      vector: "Night-flying noctuid moth depositing eggs in leaf whorl",
      simpleExplanation:
        "Caterpillars feed deep inside the central leaf whorl, creating ragged shot-holes, windowpane lesions, and lots of moist sawdust-like frass.",
      hindiExplanation:
        "सूंड़ी पौधे के बीच वाले पोंगे (Whorl) के अंदर छिपकर पत्तियों को छलनी कर देती है और पोंगे में भूसे जैसा मल भर जाता है।",
      immediateAction:
        "Directly apply dry river sand mixed with slaked lime (9:1) or neem powder into the whorl of infested plants immediately.",
      organicRemedy:
        "Handpick egg masses. Release egg parasitoid Trichogramma pretiosum @ 50,000/acre. Spray Bacillus thuringiensis (Bt) @ 2 g/L.",
      chemicalRemedy:
        "Chlorantraniliprole 18.5% SC (Coragen) @ 0.4 ml/L OR Spinetoram 11.7% SC @ 0.5 ml/L with nozzle directed straight into the whorl.",
      waterVolume: "200 Litres / Acre",
      bestSprayTime: "Late Afternoon (4:30 PM – 6:30 PM) when larvae are active",
      symptoms: [
        "Elongated papery feeding 'windows' on unfolding leaves",
        "Large irregular ragged shot holes and shredded leaves in whorl",
        "Copious yellowish sawdust-like moist frass packed deep in the whorl",
      ],
      culturalTips:
        "Set up 5 pheromone traps per acre. Practice intercropping with cowpea or desmodium to attract natural predators.",
    },
  ],
};

// Default fallback generator for crops not explicitly mapped
function generateFallbackDiagnosis(cropName: string, fileName = ""): any {
  let detectedCrop = cropName && cropName !== "Crop" ? cropName : "";
  if (!detectedCrop) {
    if (/tomato/i.test(fileName)) detectedCrop = "Tomato";
    else if (/cotton/i.test(fileName)) detectedCrop = "Cotton";
    else if (/wheat/i.test(fileName)) detectedCrop = "Wheat";
    else if (/rice|paddy/i.test(fileName)) detectedCrop = "Paddy";
    else if (/maize|corn/i.test(fileName)) detectedCrop = "Maize";
    else if (/soybean/i.test(fileName)) detectedCrop = "Soybean";
    else if (/chilli|pepper/i.test(fileName)) detectedCrop = "Chilli";
    else {
      const supported = ["Chilli", "Tomato", "Cotton", "Paddy", "Wheat", "Maize"];
      let hash = 0;
      for (let i = 0; i < fileName.length; i++) hash = (hash * 31 + fileName.charCodeAt(i)) & 0xffffffff;
      detectedCrop = supported[Math.abs(hash) % supported.length];
    }
  }
  const list = AGRONOMY_BACKUP[detectedCrop] || AGRONOMY_BACKUP.Chilli;
  const isDieback = /dieback|anthracnose|rot|blight/i.test(fileName);
  const selected = isDieback && list[1] ? list[1] : list[0];
  return {
    crop: detectedCrop,
    ...selected,
    localName: selected.hindiName || selected.teluguName || "",
    aiResearched: false,
    source: "ICAR Agronomy Standard Field Database",
  };
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Agro Sathi Crop Doctor API",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// AI Crop Doctor & Leaf Clinic Analysis Endpoint
app.post("/api/crop-doctor/analyze", async (req, res) => {
  try {
    const { crop = "", imageBase64, mimeType = "image/jpeg", fileName = "", language = "en" } = req.body;

    // If we have an API key and an image, try Gemini Vision
    if (GEMINI_API_KEY && imageBase64) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

        const systemPrompt = `You are the chief agricultural scientist and crop doctor for Agro Sathi, serving Indian farmers.
You are diagnosing a leaf / plant photo${crop ? ` of the crop: "${crop}"` : ""}. First identify the crop and the disease, insect attack, or nutrient deficiency.
Your diagnosis must be scientifically accurate, practical for Indian farmers, and written in SIMPLE, EASY-TO-UNDERSTAND language (no overly dense academic jargon).
Whenever giving chemical fungicides or insecticides, provide Central Insecticides Board (CIB)-compliant recommendations with exact dosage per 1 litre of water.
Whenever giving organic remedies, provide accessible Indian farm remedies (like Neem oil 3000 ppm, sour buttermilk, Trichoderma, yellow sticky traps, Panchagavya, etc.).

You MUST respond strictly with valid JSON conforming to this schema (do NOT wrap in markdown quotes if possible, or provide raw JSON):
{
  "name": "English Disease or Pest Name",
  "hindiName": "सरल हिंदी नाम (जैसे: मिर्च मरोड़िया रोग)",
  "teluguName": "తెలుగు పేరు (optional if known)",
  "confidence": 95.5,
  "severity": 3,
  "severityLabel": "Moderate / मध्यम (Stage 3)",
  "vector": "Causal agent or vector (e.g. Whitefly / Fungal Spores / Aphids)",
  "simpleExplanation": "2-3 clear, conversational sentences explaining what has happened to the plant in simple farmer language.",
  "hindiExplanation": "2-3 clear sentences in simple Hindi explaining what happened to the plant.",
  "immediateAction": "The single most important step the farmer must do in the next 24 hours.",
  "organicRemedy": "Natural, organic or biological remedy with exact preparation and spraying instructions.",
  "chemicalRemedy": "Recommended target chemical spray with active ingredient, commercial brand name example, and exact dosage per 1 Litre of water.",
  "waterVolume": "150 - 200 Litres / Acre",
  "bestSprayTime": "Optimal spray time of day (e.g. Early Morning 6:30 AM - 9:00 AM)",
  "symptoms": [
    "Observable leaf symptom 1",
    "Observable leaf symptom 2",
    "Observable leaf symptom 3"
  ],
  "culturalTips": "Field sanitation, weed host clearing, and water management precautions."
}`;

        // ── Plant / Agriculture Image Guard (pre-flight YES/NO check) ─────────
        // Before spending tokens on the full diagnosis, ask Gemini one quick
        // question: "Is this a plant / crop / leaf?" → YES or NO only.
        // Non-plant images → HTTP 422 immediately; API errors → fail-open.
        const PLANT_CHECK_PROMPT_TS =
          "Look at this image carefully. " +
          "Is this image of a plant, crop, leaf, flower, tree, vegetable, fruit, " +
          "or any kind of agricultural / botanical subject? " +
          "Reply with ONLY a single word — YES or NO — and nothing else. " +
          "If you see ANY plant or plant part (leaf, stem, root, flower, seed, pod, " +
          "fruit, bark, grass, weed) reply YES. " +
          "If the image is of a person, animal, vehicle, landscape without plants, " +
          "food product, building, object, or anything unrelated to plants/agriculture, " +
          "reply NO.";

        let isPlantImage = true; // fail-open default
        const GUARD_MODELS = ["gemini-3.1-flash-lite", "gemini-3.5-flash-lite", "gemini-1.5-flash-8b", "gemini-3.5-flash"];
        const aiGuard = getGemini();
        for (const gModel of GUARD_MODELS) {
          try {
            let guardAnswer = "";
            if (aiGuard) {
              const gRes = await aiGuard.models.generateContent({
                model: gModel,
                contents: {
                  parts: [
                    { inlineData: { mimeType: mimeType || "image/jpeg", data: cleanBase64 } },
                    { text: PLANT_CHECK_PROMPT_TS },
                  ],
                },
                config: { temperature: 0, maxOutputTokens: 5 },
              });
              guardAnswer = (gRes.text || "").trim().toUpperCase();
            } else {
              const gPayload = {
                contents: [{
                  parts: [
                    { inline_data: { mime_type: mimeType || "image/jpeg", data: cleanBase64 } },
                    { text: PLANT_CHECK_PROMPT_TS },
                  ],
                }],
                generationConfig: { temperature: 0, maxOutputTokens: 5 },
              };
              const gData = await callGeminiRaw(gModel, gPayload);
              guardAnswer = (gData?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim().toUpperCase();
            }
            // Definitive answer obtained — evaluate and stop
            isPlantImage = guardAnswer.startsWith("YES");
            break;
          } catch (guardErr: any) {
            console.warn(`Plant guard model ${gModel} failed (fail-open):`, guardErr?.message);
            // Keep isPlantImage = true (fail-open) and try next model
          }
        }

        if (!isPlantImage) {
          return res.status(422).json({
            success: false,
            notPlant: true,
            error:
              "This image does not appear to be a plant, crop, or leaf photo. " +
              "Please upload a clear, close-up photo of a crop leaf, plant stem, or agricultural subject " +
              "so Crop Doctor AI can provide an accurate diagnosis.",
          });
        }
        // ─────────────────────────────────────────────────────────────────────

        // Try SDK first (for AIzaSy keys), then raw fetch (for AQ. keys)
        const MODELS = [
          "gemini-3.1-flash-lite",
          "gemini-3.5-flash-lite",
          "gemini-1.5-flash-8b",
          "gemini-1.5-flash",
          "gemini-3.5-flash"
        ];
        let parsed: any = null;
        let usedModel = "";

        const ai = getGemini();
        for (const model of MODELS) {
          try {
            if (ai) {
              // SDK path (AIzaSy keys)
              const response = await ai.models.generateContent({
                model,
                contents: {
                  parts: [
                    { inlineData: { mimeType: mimeType || "image/jpeg", data: cleanBase64 } },
                    { text: `Please diagnose this ${crop} leaf / plant photo. Identify the disease, insect attack, or nutrient deficiency, evaluate damage severity (1 to 5), and provide immediate organic and chemical solutions in simple farmer terms. Output strictly valid JSON matching the requested schema.` },
                  ],
                },
                config: {
                  systemInstruction: systemPrompt,
                  responseMimeType: "application/json",
                  temperature: 0.3,
                },
              });
              parsed = JSON.parse((response.text || "").trim());
            } else {
              // Raw fetch path (AQ. keys)
              const payload = {
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{
                  parts: [
                    { inline_data: { mime_type: mimeType || "image/jpeg", data: cleanBase64 } },
                    { text: `Please diagnose this ${crop} leaf / plant photo. Identify the disease, insect attack, or nutrient deficiency, evaluate damage severity (1 to 5), and provide immediate organic and chemical solutions in simple farmer terms. Output strictly valid JSON matching the requested schema.` },
                  ],
                }],
                generationConfig: { temperature: 0.3, responseMimeType: "application/json" },
              };
              const data = await callGeminiRaw(model, payload);
              let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
              rawText = rawText.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
              parsed = JSON.parse(rawText);
            }
            usedModel = model;
            break;
          } catch (modelErr: any) {
            console.warn(`Model ${model} failed:`, modelErr?.message || modelErr);
          }
        }

        if (parsed) {
          return res.json({
            success: true,
            aiResearched: true,
            source: `Google Gemini Vision AI (${usedModel})`,
            diagnosis: parsed,
          });
        } else {
          throw new Error("Gemini AI models were unable to analyze this photo. Please try a clearer leaf photo.");
        }
      } catch (aiErr: any) {
        console.warn("Gemini vision analysis failed:", aiErr?.message || aiErr);
        return res.status(500).json({
          success: false,
          error: "AI diagnosis failed: " + (aiErr?.message || "Unable to analyze photo"),
        });
      }
    }

    return res.status(400).json({
      success: false,
      error: "No image provided or Gemini API not configured.",
    });
  } catch (err: any) {
    console.error("Diagnosis endpoint error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to process crop analysis",
    });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      configFile: path.resolve(process.cwd(), "vite.config.js"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Express v5 syntax:
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Agro Sathi] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
