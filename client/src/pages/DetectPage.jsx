import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  BookmarkCheck,
  Camera,
  Check,
  CheckCircle2,
  Copy,
  FlaskConical,
  HelpCircle,
  History,
  ImageUp,
  Leaf,
  Lightbulb,
  Printer,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useFirebase } from "../context/FirebaseContext.jsx";
import DiagnosisResultModal from "../components/DiagnosisResultModal.jsx";

const CROPS = [
  { id: "Chilli", label: "Chilli", icon: "🌶️" },
  { id: "Cotton", label: "Cotton", icon: "🌿" },
  { id: "Tomato", label: "Tomato", icon: "🍅" },
  { id: "Paddy", label: "Rice / Paddy", icon: "🌾" },
  { id: "Wheat", label: "Wheat", icon: "🌾" },
  { id: "Maize", label: "Maize", icon: "🌽" },
  { id: "Soybean", label: "Soybean", icon: "🌱" },
];

export default function DetectPage() {
  const { scoutRecords, saveScoutRecord, deleteScoutRecord } = useFirebase();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [crop, setCrop] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [notPlant, setNotPlant] = useState(false);
  const [busy, setBusy] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(false);
  const [activeDiagnosis, setActiveDiagnosis] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedDosage, setCopiedDosage] = useState(false);
  const [isCameraStreaming, setIsCameraStreaming] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [askQuestion, setAskQuestion] = useState("");
  const [askAnswer, setAskAnswer] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [lang, setLang] = useState("en");

  const fileRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const resultRef = useRef(null);

  // Check for cached scan passed from home hero or floating dock
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("agro_pending_scan");
      const cachedName =
        sessionStorage.getItem("agro_pending_scan_name") || "scanned-leaf.jpg";
      if (cached) {
        sessionStorage.removeItem("agro_pending_scan");
        sessionStorage.removeItem("agro_pending_scan_name");
        setPreview(cached);
        setFile({ name: cachedName });
        performDiagnosis("", cached, cachedName);
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Cleanup camera stream and speech on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startLiveCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        cameraRef.current?.click();
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setIsCameraStreaming(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access fallback to file input", err);
      cameraRef.current?.click();
    }
  };

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraStreaming(false);
  };

  const captureLivePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    stopLiveCamera();
    setPreview(dataUrl);
    const snapName = crop
      ? `${crop.toLowerCase()}-live-scan.jpg`
      : "crop-live-scan.jpg";
    setFile({ name: snapName });
    performDiagnosis(crop, dataUrl, snapName);
  };

  const handleFile = nextFile => {
    if (!nextFile) return;
    setFile(nextFile);
    setResult(false);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setPreview(dataUrl);
      // Pass rawFile so Python handler can send real multipart
      performDiagnosis(crop, dataUrl, nextFile.name, nextFile);
    };
    reader.readAsDataURL(nextFile);
  };

  const handleAskQuestion = async presetQuestion => {
    const q = (presetQuestion || askQuestion).trim();
    if (!q) return;
    setAskLoading(true);
    setAskAnswer(
      lang === "hi"
        ? "फसल डॉक्टर सोच रहे हैं..."
        : "Consulting Crop Doctor AI..."
    );
    try {
      const currentCrop = activeDiagnosis?.crop || crop || "Crop";
      const currentDisease = activeDiagnosis?.name || "Plant Issue";
      const prompt = `Farmer Question regarding ${currentCrop} (${currentDisease}): "${q}". Give a clear, simple, practical answer in ${lang === "hi" ? "simple Hindi" : "simple English"} suitable for an Indian farmer.`;
      const res = await fetch("/api/python/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: prompt }),
      });
      const data = await res.json();
      setAskAnswer(
        data.answer ||
        (lang === "hi" ? "कोई उत्तर नहीं मिला।" : "No answer received.")
      );
    } catch (err) {
      console.warn("Ask error:", err);
      setAskAnswer(
        lang === "hi"
          ? "परामर्श सेवा से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।"
          : "Could not reach advisor. Please check your connection."
      );
    } finally {
      setAskLoading(false);
    }
  };

  const performDiagnosis = async (
    cropName = "",
    imageBase64OrUrl = "",
    fileName = "",
    rawFile = null
  ) => {
    setIsAnalyzing(true);
    setBusy(true);
    setResult(false);
    setActiveDiagnosis(null);
    setErrorMsg("");
    setNotPlant(false);
    setAskAnswer("");
    setAskQuestion("");

    try {
      const response = await fetch("/api/crop-doctor/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: cropName,
          imageBase64:
            imageBase64OrUrl && imageBase64OrUrl.startsWith("data:")
              ? imageBase64OrUrl
              : undefined,
          fileName: fileName || "crop-leaf.jpg",
        }),
      });

      const data = await response.json();

      // ── HTTP 422: Image is not a plant / crop / leaf ────────────────────
      if (response.status === 422) {
        setNotPlant(true);
        setErrorMsg(
          data?.error ||
          "This image does not appear to be a plant, crop, or leaf photo. " +
          "Please upload a clear photo of a crop leaf or plant so the AI can diagnose it."
        );
        setActiveDiagnosis(null);
        setResult(false);
        return; // exit early — do NOT show a modal
      }

      // ── Non-200 from server (500, 400, etc.) ────────────────────────────
      if (!response.ok) {
        throw new Error(
          data?.error ||
          data?.message ||
          "AI was unable to analyze this image. Please try a clearer photo."
        );
      }

      // ── Success: valid plant diagnosis ──────────────────────────────────
      if (data && data.success && data.diagnosis) {
        setActiveDiagnosis(data.diagnosis);
        if (data.diagnosis.crop) {
          setCrop(data.diagnosis.crop);
        }
        setResult(true);
        setShowModal(true);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 150);
      } else {
        throw new Error(
          data?.error ||
          data?.message ||
          "AI was unable to diagnose this image. Please provide a clear, well-lit photo of an infected leaf."
        );
      }
    } catch (err) {
      console.error("Diagnosis error:", err);
      setNotPlant(false);
      setErrorMsg(
        err.message ||
        "Failed to analyze photo. Please try uploading a clearer image."
      );
      setActiveDiagnosis(null);
      setResult(false);
    } finally {
      setIsAnalyzing(false);
      setBusy(false);
    }
  };

  const toggleAudioReadout = () => {
    if (!activeDiagnosis) return;
    if (isSpeaking) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const currentCrop = activeDiagnosis.crop || crop || "Crop";
    const text =
      lang === "hi"
        ? `${currentCrop} की जांच: ${activeDiagnosis.hindiName || activeDiagnosis.localName || activeDiagnosis.name}। गंभीरता स्तर: ${activeDiagnosis.severity} में से 5। ${activeDiagnosis.hindiExplanation || ""} जैविक उपाय: ${activeDiagnosis.organicRemedy || ""}। रासायनिक छिड़काव: ${activeDiagnosis.chemicalRemedy || ""}। छिड़काव समय: ${activeDiagnosis.bestSprayTime || "सुबह"}। पानी की मात्रा: ${activeDiagnosis.waterVolume || "200 लीटर"}।`
        : `Diagnosis for ${currentCrop}: ${activeDiagnosis.name}. Severity level ${activeDiagnosis.severity} of 5. ${activeDiagnosis.simpleExplanation || ""} Recommended organic remedy: ${activeDiagnosis.organicRemedy || ""}. Recommended target chemical spray: ${activeDiagnosis.chemicalRemedy || ""}. Spray timing: ${activeDiagnosis.bestSprayTime || "Early morning"}. Water volume: ${activeDiagnosis.waterVolume || "200 Litres per Acre"}.`;

    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const copyDosage = () => {
    if (!activeDiagnosis) return;
    const currentCrop = activeDiagnosis.crop || crop || "Crop";
    const text = `🌱 Agro Sathi Prescription for ${currentCrop}
Disease: ${activeDiagnosis.name} (${activeDiagnosis.localName || activeDiagnosis.hindiName || activeDiagnosis.scientificName || ""})
Severity: Level ${activeDiagnosis.severity}/5 (${activeDiagnosis.severityLabel || ""})
⚡ Immediate Action: ${activeDiagnosis.immediateAction || "Inspect crop and apply treatment spray."}
🌿 Organic Remedy: ${activeDiagnosis.organicRemedy || "Neem oil 3000 ppm spray"}
🧪 Chemical Spray: ${activeDiagnosis.chemicalRemedy || "Consult local Krishi Vigyan Kendra"}
💧 Water Volume: ${activeDiagnosis.waterVolume || "150-200 Litres / Acre"}
⏱️ Best Spray Time: ${activeDiagnosis.bestSprayTime || "Early Morning"}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedDosage(true);
      setTimeout(() => setCopiedDosage(false), 2200);
    });
  };

  const saveToFieldLog = async () => {
    if (!activeDiagnosis) return;
    try {
      const currentCrop = activeDiagnosis.crop || crop || "Crop";
      await saveScoutRecord({
        crop: currentCrop,
        disease: activeDiagnosis.name,
        scientific: activeDiagnosis.scientificName || "",
        severity: activeDiagnosis.severity || 1,
        remedy:
          activeDiagnosis.organicRemedy || activeDiagnosis.chemicalRemedy || "",
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.warn("Storage error", e);
    }
  };

  const handleScanAnother = () => {
    setFile(null);
    setPreview("");
    setResult(false);
    setActiveDiagnosis(null);
    setErrorMsg("");
    setNotPlant(false);
    setPythonResult(null);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDragOver = e => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <main className="page-width page-shell">
      <div className="crop-doctor-shell">
        {/* Clean Header */}
        <div className="crop-doctor-header">
          <div
            className="crop-doctor-brand-pill"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 12px 4px 6px",
              borderRadius: "999px",
              marginBottom: "10px",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
            }}
          >
            <img
              src="/agro-sathi-icon.png"
              alt="AGRO SATHI"
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "6px",
                display: "block",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: "800",
                color: "var(--foreground, #0f172a)",
                letterSpacing: "0.04em",
              }}
            >
              AGRO SATHI
            </span>
          </div>
          <h1>AI Crop Doctor</h1>
          <p>
            Take or upload a photo of your crop leaf for instant disease
            diagnosis, organic remedies, and chemical spray guidance.
          </p>
        </div>

        {/* Central Scanner Card */}
        <div className="scanner-main-card">
          {/* Live Camera Viewfinder */}
          {isCameraStreaming && (
            <div className="live-camera-viewfinder">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="live-camera-video"
              />
              <div className="live-camera-reticle" />
              <div className="live-camera-controls">
                <button
                  type="button"
                  className="live-snap-btn"
                  onClick={captureLivePhoto}
                >
                  <Camera size={18} /> Snap & Diagnose
                </button>
                <button
                  type="button"
                  className="live-close-btn"
                  onClick={stopLiveCamera}
                  title="Close camera"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Photo Preview Mode */}
          {!isCameraStreaming && preview && (
            <div className="scanner-preview-wrap">
              <div className="scanner-preview-img-box">
                <img src={preview} alt="Crop leaf preview" />
                <span className="scanner-preview-tag">Uploaded Leaf Photo</span>
              </div>
              <div className="scanner-preview-actions">
                <button
                  type="button"
                  className="scanner-secondary-btn"
                  onClick={handleScanAnother}
                >
                  <RotateCcw size={16} /> Choose Another Photo
                </button>
                <button
                  type="button"
                  className="scanner-primary-btn"
                  disabled={busy}
                  onClick={() =>
                    performDiagnosis(crop, preview, file?.name || "")
                  }
                >
                  {busy ? (
                    <>
                      <div className="spinner" /> Diagnosing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Run Diagnosis
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Upload / Drag & Drop Mode */}
          {!isCameraStreaming && !preview && (
            <div
              className={`scanner-dropzone ${isDragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="scanner-dropzone-icon">
                <Leaf size={26} />
              </div>
              <h3>Take photo or upload leaf image</h3>
              <p>Supports camera capture, photo upload, or drag & drop</p>

              <div className="scanner-btn-group">
                <button
                  type="button"
                  className="scanner-primary-btn"
                  onClick={startLiveCamera}
                >
                  <Camera size={18} /> Take Photo
                </button>
                <button
                  type="button"
                  className="scanner-secondary-btn"
                  onClick={() => fileRef.current?.click()}
                >
                  <ImageUp size={18} /> Upload Image
                </button>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
            </div>
          )}

          {/* Real-time Inline Analyzing Banner */}
          {isAnalyzing && (
            <div
              style={{
                marginTop: "16px",
                padding: "14px 18px",
                borderRadius: "14px",
                background: "rgba(182, 240, 34, 0.12)",
                border: "1px solid rgba(1, 82, 15, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                className="spinner"
                style={{
                  width: "22px",
                  height: "22px",
                  borderWidth: "3px",
                  borderColor: "#01520f",
                  borderTopColor: "transparent",
                  flexShrink: 0,
                }}
              />
              <div>
                <strong
                  style={{
                    fontSize: "14px",
                    color: "#01520f",
                    display: "block",
                  }}
                >
                  Analyzing crop leaf & identifying symptoms...
                </strong>
                <span style={{ fontSize: "12px", color: "#586256" }}>
                  Evaluating discoloration, spots, and pathogen damage to
                  formulate remedies
                </span>
              </div>
            </div>
          )}

          {/* Not-a-plant Banner (amber) — shown for HTTP 422 responses */}
          {notPlant && errorMsg && (
            <div
              style={{
                marginTop: "16px",
                padding: "16px 18px",
                borderRadius: "14px",
                background: "#fffbeb",
                border: "1.5px solid #fcd34d",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
              }}
            >
              <span style={{ fontSize: "26px", flexShrink: 0, lineHeight: 1 }}>
                🌿
              </span>
              <div>
                <strong
                  style={{
                    fontSize: "14px",
                    display: "block",
                    color: "#92400e",
                    marginBottom: "4px",
                  }}
                >
                  Not a Plant or Crop Photo
                </strong>
                <span
                  style={{
                    fontSize: "12.5px",
                    color: "#78350f",
                    lineHeight: 1.5,
                    display: "block",
                  }}
                >
                  {errorMsg}
                </span>
                <button
                  type="button"
                  onClick={handleScanAnother}
                  style={{
                    marginTop: "10px",
                    padding: "7px 16px",
                    borderRadius: "8px",
                    border: "1px solid #fcd34d",
                    background: "#ffffff",
                    color: "#92400e",
                    fontWeight: 700,
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  📷 Upload a Crop Photo Instead
                </button>
              </div>
            </div>
          )}

          {/* Generic Error Banner (red) — shown for API / technical failures */}
          {!notPlant && errorMsg && (
            <div
              style={{
                marginTop: "16px",
                padding: "14px 18px",
                borderRadius: "14px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                color: "#991b1b",
              }}
            >
              <AlertTriangle
                size={22}
                style={{ flexShrink: 0, color: "#dc2626" }}
              />
              <div>
                <strong style={{ fontSize: "14px", display: "block" }}>
                  Diagnosis Failed
                </strong>
                <span style={{ fontSize: "12px", color: "#b91c1c" }}>
                  {errorMsg}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Single Unified Diagnosis & Prescription Result (Matches Card 8 & 9 Flow) */}
        {result && activeDiagnosis && (
          <div
            ref={resultRef}
            style={{
              marginTop: "24px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
              border: "1.5px solid #86efac",
              padding: "24px",
              boxShadow: "0 10px 25px -5px rgba(22, 163, 74, 0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {preview && (
                <img
                  src={preview}
                  alt="Diagnosed crop leaf"
                  style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "14px",
                    objectFit: "cover",
                    border: "2px solid #bbf7d0",
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: "240px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      background: "#ffffff",
                      border: "1px solid #bbf7d0",
                      color: "#166534",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "999px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Leaf size={13} /> Crop:{" "}
                    {activeDiagnosis.crop || crop || "Identified Plant"}
                  </span>
                  <span
                    style={{
                      background: "#ffffff",
                      border: "1px solid #bbf7d0",
                      color: "#166534",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "999px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <ShieldCheck size={13} /> Confidence:{" "}
                    {Math.round(activeDiagnosis.confidence || 92)}%
                  </span>
                  <span
                    style={{
                      background: "#fefce8",
                      border: "1px solid #fef08a",
                      color: "#a16207",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "999px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <AlertTriangle size={13} /> Severity:{" "}
                    {activeDiagnosis.severity || 3}/5
                  </span>
                </div>

                <h2
                  style={{
                    margin: "0 0 4px",
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  {activeDiagnosis.disease || activeDiagnosis.name}
                </h2>
                {activeDiagnosis.hindiName && (
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#15803d",
                      marginBottom: "6px",
                    }}
                  >
                    {activeDiagnosis.hindiName}
                  </div>
                )}
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#475569",
                    lineHeight: 1.5,
                  }}
                >
                  {activeDiagnosis.simpleExplanation || activeDiagnosis.cause}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  alignSelf: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  style={{
                    padding: "12px 22px",
                    borderRadius: "12px",
                    border: "none",
                    background: "#16a34a",
                    color: "#ffffff",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)",
                    transition: "transform 0.15s ease",
                  }}
                >
                  <Sparkles size={16} />
                  <span>View Details in Pop-up</span>
                </button>

                <button
                  type="button"
                  onClick={handleScanAnother}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#334155",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <RotateCcw size={14} /> Retake / Scan Another
                </button>
              </div>
            </div>
          </div>
        )}

        {/* The Comprehensive Single-Window Pop-up Modal */}
        <DiagnosisResultModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          activeDiagnosis={activeDiagnosis}
          preview={preview}
          crop={crop}
          lang={lang}
          setLang={setLang}
          toggleAudioReadout={toggleAudioReadout}
          isSpeaking={isSpeaking}
          copyDosage={copyDosage}
          copiedDosage={copiedDosage}
          saveToFieldLog={saveToFieldLog}
          savedSuccess={savedSuccess}
          handleScanAnother={handleScanAnother}
          askQuestion={askQuestion}
          setAskQuestion={setAskQuestion}
          handleAskQuestion={handleAskQuestion}
          askAnswer={askAnswer}
          askLoading={askLoading}
        />

        {/* Saved Field Scans Log */}
        {scoutRecords.length > 0 && (
          <section
            className="scout-history-section"
            style={{ marginTop: "32px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "14px",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <History size={18} className="text-emerald-600" />
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700" }}>
                  Saved Field Scans
                </h3>
              </div>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                {scoutRecords.length}{" "}
                {scoutRecords.length === 1 ? "scan" : "scans"} recorded
              </span>
            </div>
            <div>
              {scoutRecords.map(item => (
                <div
                  key={item.id}
                  className="history-card-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "14px", display: "block" }}>
                      {item.crop}: {item.disease}
                    </strong>
                    <small style={{ color: "#64748b" }}>
                      {item.scientific ? `${item.scientific} · ` : ""}
                      {item.date} {item.time ? `at ${item.time}` : ""}
                    </small>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span className="step-chip" style={{ fontSize: "11px" }}>
                      Severity {item.severity}/5
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteScoutRecord(item.id)}
                      title="Remove from history"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        padding: "4px",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
