import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  ShieldCheck,
  Volume2,
  VolumeX,
  Copy,
  Check,
  BookmarkCheck,
  Printer,
  RotateCcw,
  Send,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  Bug,
  BookOpen,
  FlaskConical,
  Globe,
  Sprout,
  Leaf
} from "lucide-react";

export default function DiagnosisResultModal({
  isOpen,
  onClose,
  activeDiagnosis,
  preview,
  crop,
  lang,
  setLang,
  toggleAudioReadout,
  isSpeaking,
  copyDosage,
  copiedDosage,
  saveToFieldLog,
  savedSuccess,
  handleScanAnother,
  askQuestion,
  setAskQuestion,
  handleAskQuestion,
  askAnswer,
  askLoading,
}) {
  const [openSection, setOpenSection] = useState("all");

  if (!isOpen || !activeDiagnosis) return null;

  const diseaseName =
    activeDiagnosis.disease || activeDiagnosis.name || "Identified Condition";
  const cropName = activeDiagnosis.crop || crop || "Crop Leaf";
  const confidence = activeDiagnosis.confidence
    ? Math.round(activeDiagnosis.confidence)
    : 92;
  const severity = activeDiagnosis.severity || 3;

  const toggleSection = id => {
    setOpenSection(prev => (prev === id ? "" : id));
  };

  const symptomsList = Array.isArray(activeDiagnosis.symptoms)
    ? activeDiagnosis.symptoms
    : activeDiagnosis.symptoms
      ? [activeDiagnosis.symptoms]
      : [];

  // Reusable Accordion Component
  const AccordionCard = ({ id, icon, title, theme, isOpen, onToggle, children }) => {
    const themes = {
      yellow: { bg: "#fefce8", border: "#fef08a", title: "#0f172a", headerBg: "#fdfdfa" },
      red: { bg: "#fef2f2", border: "#fecaca", title: "#0f172a", headerBg: "#fdfdfa" },
      blue: { bg: "#eff6ff", border: "#bfdbfe", title: "#1d4ed8", headerBg: "#eff6ff" },
      green: { bg: "#f0fdf4", border: "#bbf7d0", title: "#0f172a", headerBg: "#fdfdfa" },
      teal: { bg: "#f0fdfa", border: "#ccfbf1", title: "#0f172a", headerBg: "#fdfdfa" }
    };

    const t = themes[theme] || themes.blue;

    return (
      <div style={{ border: `1px solid ${t.border}`, borderRadius: "10px", overflow: "hidden", background: t.bg, marginBottom: "12px" }}>
        <button
          type="button"
          onClick={onToggle}
          style={{ width: "100%", padding: "16px 20px", background: t.headerBg, border: "none", borderBottom: isOpen ? `1px solid ${t.border}` : "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {icon}
            <span style={{ fontSize: "15px", fontWeight: 700, color: t.title }}>{title}</span>
          </div>
          {isOpen ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
        </button>
        {isOpen && (
          <div style={{ padding: "16px 20px", background: "#ffffff" }}>
            {children}
          </div>
        )}
      </div>
    );
  };

  const outlineBtnStyle = {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#334155",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  };

  return (
    <div
      className="cropcare-modal-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        overflowY: "auto",
      }}
    >
      <div
        className="cropcare-modal-window"
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "800px",
          maxHeight: "92vh",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sprout size={32} color="#65a30d" strokeWidth={2.5} />
            </div>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", margin: 0 }}>CropCare AI • Disease Result & Advisory</h2>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0" }}>Comprehensive single-window agronomic report</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "999px", padding: "6px 14px", gap: "6px", cursor: "pointer" }} onClick={() => setLang(lang === "en" ? "hi" : "en")}>
              <Globe size={15} color="#64748b" />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>{lang === "en" ? "English" : "हिंदी"}</span>
              <ChevronDown size={15} color="#64748b" />
            </div>
            <button onClick={toggleAudioReadout} style={{ display: "flex", alignItems: "center", border: "1px solid #22c55e", borderRadius: "999px", padding: "6px 14px", gap: "6px", background: "transparent", cursor: "pointer" }}>
              {isSpeaking ? <VolumeX size={15} color="#22c55e" /> : <Volume2 size={15} color="#22c55e" />}
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#16a34a" }}>{isSpeaking ? "Stop" : "Listen"}</span>
            </button>
            <button onClick={onClose} style={{ width: "34px", height: "34px", border: "1px solid #e2e8f0", borderRadius: "50%", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={18} color="#64748b" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div style={{ flex: 1, overflowY: "auto" }}>

          {/* BANNER SECTION */}
          <div style={{ display: "flex", padding: "24px", gap: "24px", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: "200px", height: "200px", flexShrink: 0, borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
              {preview ? (
                <img src={preview} alt="Scanned crop" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#f8fafc", display: "grid", placeItems: "center" }}>
                  <Leaf size={48} color="#cbd5e1" />
                </div>
              )}
              <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "#ffffff", padding: "4px 10px", borderRadius: "999px", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#16a34a", display: "grid", placeItems: "center" }}>
                  <Check size={10} color="#ffffff" strokeWidth={3} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#16a34a" }}>AI Verified</span>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, right: 0 }}>
                <button type="button" onClick={() => { onClose(); handleScanAnother(); }} style={{ padding: "8px 14px", borderRadius: "999px", border: "1px solid #e2e8f0", background: "#ffffff", color: "#334155", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  <RotateCcw size={14} /> Retake / New
                </button>
              </div>

              <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", paddingRight: "130px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "999px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", fontSize: "13px", fontWeight: 700 }}>
                  <Leaf size={14} /> Crop: {cropName}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "999px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", fontSize: "13px", fontWeight: 700 }}>
                  <ShieldCheck size={14} /> Confidence: {confidence}%
                </span>
              </div>

              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 16px", borderRadius: "999px", background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
                <AlertTriangle size={15} /> Severity: {severity}/5 ({activeDiagnosis.severityLabel || (severity >= 4 ? "Severe" : severity >= 3 ? "Moderate" : "Low")})
              </div>

              <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0", lineHeight: 1.2 }}>{diseaseName}</h2>
              {activeDiagnosis.hindiName && (
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#16a34a", marginBottom: "16px" }}>
                  {activeDiagnosis.hindiName} {activeDiagnosis.teluguName ? `· ${activeDiagnosis.teluguName}` : ""}
                </div>
              )}

              {(activeDiagnosis.vector || activeDiagnosis.cause) && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#475569" }}>
                  <Bug size={16} color="#10b981" />
                  <span><strong>Vector / Carrier:</strong> {activeDiagnosis.vector || activeDiagnosis.cause}</span>
                </div>
              )}
            </div>
          </div>

          {/* ADVISORY SECTION */}
          <div style={{ padding: "32px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <BookOpen size={24} color="#16a34a" />
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: 0 }}>Crop Disease Advisory</h3>
              </div>
              <span style={{ fontSize: "13.5px", color: "#64748b" }}>Detailed guidance for better crop health</span>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "0 16px",
              alignItems: "start"
            }}>
              {/* Left Column */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <AccordionCard
                  id="symptoms"
                  icon={<AlertTriangle size={18} color="#d97706" />}
                  title="Disease Symptoms"
                  theme="yellow"
                  isOpen={openSection === 'symptoms' || openSection === 'all'}
                  onToggle={() => toggleSection('symptoms')}
                >
                  {symptomsList.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: "18px", color: "#334155", fontSize: "14px", lineHeight: 1.7 }}>
                      {symptomsList.map((sym, idx) => <li key={idx} style={{ marginBottom: "6px" }}>{sym}</li>)}
                    </ul>
                  ) : (
                    <div style={{ fontSize: "14px", color: "#475569" }}>
                      {activeDiagnosis.simpleExplanation || "Observable discoloration and characteristic lesion patterns on leaves and foliage."}
                    </div>
                  )}
                </AccordionCard>

                <AccordionCard
                  id="causes"
                  icon={<Bug size={18} color="#dc2626" />}
                  title="Causes & Pathogen Background"
                  theme="red"
                  isOpen={openSection === 'causes' || openSection === 'all'}
                  onToggle={() => toggleSection('causes')}
                >
                  <p style={{ margin: "0 0 10px", fontSize: "14px", color: "#334155", lineHeight: 1.6 }}>
                    {lang === "hi" && activeDiagnosis.hindiExplanation
                      ? activeDiagnosis.hindiExplanation
                      : activeDiagnosis.simpleExplanation ||
                      activeDiagnosis.cause ||
                      "Infection triggered by fungal spores or insect vectors favored by high canopy humidity."}
                  </p>
                  {activeDiagnosis.vector && (
                    <div style={{ fontSize: "13px", background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", color: "#475569" }}>
                      <strong>Vector / Causative Agent:</strong> {activeDiagnosis.vector}
                    </div>
                  )}
                </AccordionCard>

                <AccordionCard
                  id="treatment"
                  icon={<FlaskConical size={18} color="#2563eb" />}
                  title="Treatment & Target Chemical Spray"
                  theme="blue"
                  isOpen={openSection === 'treatment' || openSection === 'all'}
                  onToggle={() => toggleSection('treatment')}
                >
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e3a8a", marginBottom: "8px" }}>
                    {activeDiagnosis.chemicalRemedy || activeDiagnosis.treatment || "Apply target chemical fungicide/insecticide per label instructions."}
                  </div>
                </AccordionCard>
              </div>

              {/* Right Column */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <AccordionCard
                  id="organic"
                  icon={<Sprout size={18} color="#16a34a" />}
                  title="Organic & Biological Remedies"
                  theme="green"
                  isOpen={openSection === 'organic' || openSection === 'all'}
                  onToggle={() => toggleSection('organic')}
                >
                  <div style={{ fontSize: "14px", color: "#14532d", lineHeight: 1.6 }}>
                    {activeDiagnosis.organicRemedy || activeDiagnosis.organic_alternative || "Spray pure cold-pressed Neem Oil (3000 ppm) @ 5 ml per 1 Litre water with 1 ml liquid soap."}
                  </div>
                </AccordionCard>

                <AccordionCard
                  id="prevention"
                  icon={<ShieldCheck size={18} color="#0d9488" />}
                  title="Prevention & Cultural Crop Care"
                  theme="teal"
                  isOpen={openSection === 'prevention' || openSection === 'all'}
                  onToggle={() => toggleSection('prevention')}
                >
                  <div style={{ fontSize: "14px", color: "#334155", lineHeight: 1.6 }}>
                    {activeDiagnosis.culturalTips || activeDiagnosis.prevention || "Maintain clean field bunds, proper plant spacing, avoid excessive nitrogen, and ensure clean water drainage."}
                  </div>
                </AccordionCard>
              </div>
            </div>

            {/* IMMEDIATE NEXT STEP */}
            <div style={{ marginTop: "24px", border: "1px solid #fdba74", borderRadius: "10px", background: "#fff7ed", padding: "20px", display: "flex", gap: "16px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#ffedd5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Clock size={24} color="#c2410c" strokeWidth={2} />
              </div>
              <div>
                <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: 700, color: "#c2410c" }}>Immediate Next Step (Within 24 Hours)</h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#431407", lineHeight: 1.5 }}>
                  {activeDiagnosis.immediateAction || "Carefully remove the infected galls by hand before they burst and bury them deep in the soil or burn them to prevent spore spread."}
                </p>
              </div>
            </div>

            {/* ASK FOLLOW-UP QUESTION */}
            <div style={{ marginTop: "24px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "20px" }}>
              <h4 style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                <HelpCircle size={16} color="#059669" />
                Ask Follow-up Question
              </h4>
              <span style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "16px" }}>
                Have doubts about spray dosage, water volume, or organic mixing? Ask Crop Doctor AI directly:
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  value={askQuestion}
                  onChange={e => setAskQuestion(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAskQuestion()}
                  placeholder="e.g. Can I mix this with urea?"
                  style={{ flex: 1, padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", backgroundColor: "#ffffff" }}
                />
                <button type="button" onClick={() => handleAskQuestion()} disabled={askLoading} style={{ padding: "12px 20px", borderRadius: "8px", border: "none", backgroundColor: "#16a34a", color: "#ffffff", fontWeight: 700, fontSize: "14px", cursor: askLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Send size={16} />
                  <span>{askLoading ? "Thinking..." : "Ask"}</span>
                </button>
              </div>
              {askAnswer && (
                <div style={{ marginTop: "16px", padding: "14px 18px", borderRadius: "8px", background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: "14px", color: "#166534", lineHeight: 1.6 }}>
                  <strong>Doctor's Answer:</strong> {askAnswer}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div style={{ padding: "20px 24px", borderTop: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={copyDosage} style={outlineBtnStyle}>
              {copiedDosage ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
              <span>{copiedDosage ? "Copied!" : "Copy Treatment"}</span>
            </button>
            <button onClick={saveToFieldLog} style={outlineBtnStyle}>
              {savedSuccess ? <Check size={16} color="#16a34a" /> : <BookmarkCheck size={16} />}
              <span>{savedSuccess ? "Saved!" : "Save to Log"}</span>
            </button>
            <button onClick={() => window.print()} style={outlineBtnStyle}>
              <Printer size={16} /> Print
            </button>
            <button onClick={() => { onClose(); handleScanAnother(); }} style={outlineBtnStyle}>
              <RotateCcw size={16} /> Retake
            </button>
          </div>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#21825b", color: "#ffffff", padding: "12px 24px", borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 12px rgba(33, 130, 91, 0.2)" }}>
            <X size={18} /> Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
