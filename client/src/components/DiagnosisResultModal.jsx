import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  Copy,
  Check,
  BookmarkCheck,
  Printer,
  Sparkles,
  AlertTriangle,
  Leaf,
  FlaskConical,
  Clock,
  Droplets,
  Languages,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

export default function DiagnosisResultModal({
  isOpen,
  onClose,
  diagnosis,
  crop = "Chilli",
  imagePreview = "",
  user = null,
  onSaveToLog,
  onScanAnother,
}) {
  const [lang, setLang] = useState("en"); // "en" | "hi"
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Stop speaking if modal closes
  useEffect(() => {
    if (!isOpen && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !diagnosis) return null;

  const isHindi = lang === "hi";

  // Speech read-out
  const toggleSpeech = () => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let speechText = "";
    if (isHindi) {
      speechText = `फसल ${crop} की जांच रिपोर्ट: रोग का नाम ${diagnosis.hindiName || diagnosis.name} है। गंभीरता स्तर ${diagnosis.severity} है। लक्षण: ${diagnosis.hindiExplanation || diagnosis.simpleExplanation}। प्राकृतिक उपाय: ${diagnosis.organicRemedy}। रासायनिक दवा: ${diagnosis.chemicalRemedy}। पानी की मात्रा: ${diagnosis.waterVolume}।`;
    } else {
      speechText = `Crop Doctor diagnosis for ${crop}: ${diagnosis.name}. Severity level ${diagnosis.severity} of 5. Summary: ${diagnosis.simpleExplanation || diagnosis.name}. Recommended organic remedy: ${diagnosis.organicRemedy}. Target chemical spray: ${diagnosis.chemicalRemedy}. Spray timing: ${diagnosis.bestSprayTime}. Water volume: ${diagnosis.waterVolume}.`;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.92;
    utterance.lang = isHindi ? "hi-IN" : "en-IN";
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleCopy = () => {
    const text = `[Agro Sathi Crop Doctor Prescription]
Crop: ${crop}
Disease: ${diagnosis.name} (${diagnosis.hindiName || ""})
Severity: Level ${diagnosis.severity}/5 (${diagnosis.severityLabel || ""})
What to do right now: ${diagnosis.immediateAction || "Inspect field and apply spray"}
Organic Solution: ${diagnosis.organicRemedy || "Neem Oil 3000 ppm @ 5 ml/L"}
Chemical Spray: ${diagnosis.chemicalRemedy || "Consult local KVK"}
Water per acre: ${diagnosis.waterVolume || "200 L/acre"} | Spray Time: ${diagnosis.bestSprayTime || "Morning"}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handleSave = async () => {
    if (onSaveToLog) {
      await onSaveToLog(diagnosis);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const severityColor =
    diagnosis.severity >= 4
      ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
      : diagnosis.severity >= 3
        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"
        : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      id="crop-doctor-result-modal"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/30 border border-emerald-300/40 text-emerald-100">
              <Sparkles size={13} className="text-emerald-300" />
              Google AI Agronomy Research
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold text-emerald-200">
              · {diagnosis.confidence || 95}% Match
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLang(isHindi ? "en" : "hi")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 hover:bg-white/30 text-white transition-colors border border-white/30"
              title="Switch between English and Simple Hindi"
              id="modal-lang-toggle-btn"
            >
              <Languages size={13} />
              <span>{isHindi ? "English" : "सरल हिंदी"}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors"
              aria-label="Close diagnosis modal"
              id="modal-close-x-btn"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 sm:p-7 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Main Title & Image Header */}
          <div className="flex flex-col sm:flex-row items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            {imagePreview && (
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                <img
                  src={imagePreview}
                  alt={`${crop} leaf`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-medium">
                  {crop}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${severityColor}`}
                >
                  <AlertTriangle size={12} className="mr-1" />
                  {isHindi ? "गंभीरता: " : "Severity: "}
                  {diagnosis.severityLabel || `Level ${diagnosis.severity}/5`}
                </span>
                {diagnosis.vector && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full font-medium">
                    {diagnosis.vector}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {isHindi && diagnosis.hindiName
                  ? diagnosis.hindiName
                  : diagnosis.name}
              </h2>
              {diagnosis.hindiName && !isHindi && (
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {diagnosis.hindiName}
                </p>
              )}
            </div>
          </div>

          {/* Simple Explanation (Farmer Language) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              {isHindi
                ? "यह क्या रोग है और पौधे पर क्या असर हुआ?"
                : "What is happening to your plant?"}
            </h4>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {isHindi && diagnosis.hindiExplanation
                ? diagnosis.hindiExplanation
                : diagnosis.simpleExplanation || diagnosis.culturalTips}
            </p>
          </div>

          {/* Immediate 24-Hour Action Callout */}
          {diagnosis.immediateAction && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
              <span className="p-1.5 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5">
                ⚡
              </span>
              <div>
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                  {isHindi
                    ? "अगले 24 घंटे में तुरंत यह कदम उठाएं:"
                    : "Immediate First Step (Next 24 Hours):"}
                </h4>
                <p className="text-sm text-amber-950 dark:text-amber-100 font-semibold mt-1">
                  {diagnosis.immediateAction}
                </p>
              </div>
            </div>
          )}

          {/* Dual Prescription Cards: Organic vs Chemical Spray */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Natural / Organic Desi Solution */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-2">
                  <Leaf size={16} className="text-emerald-600" />
                  <span>
                    {isHindi
                      ? "प्राकृतिक / जैविक उपाय (देसी नुस्खा)"
                      : "Natural & Organic Solution"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {diagnosis.organicRemedy ||
                    "Spray Neem Oil (3000 ppm) @ 5 ml per 1 Litre of water with 1 ml liquid soap."}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                🌱 Safe for soil microbes & beneficial pollinators
              </div>
            </div>

            {/* 2. Target Chemical Spray (IPM) with Exact Dosage */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-sm mb-2">
                  <FlaskConical size={16} className="text-blue-600" />
                  <span>
                    {isHindi
                      ? "दवा और सही मात्रा (Chemical Spray)"
                      : "Target Chemical Spray (IPM)"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {diagnosis.chemicalRemedy ||
                    "Consult your local Krishi Vigyan Kendra (KVK) for certified fungicide sprays."}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-blue-200/60 dark:border-blue-800/40 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                ⚖️ Follow Central Insecticides Board (CIB) safety norms
              </div>
            </div>
          </div>

          {/* Spray Instructions & Water Volume Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <Droplets size={15} className="text-blue-500 shrink-0" />
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                  {isHindi ? "पानी प्रति एकड़" : "Water / Acre"}
                </span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {diagnosis.waterVolume || "150 - 200 L"}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={15} className="text-emerald-500 shrink-0" />
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                  {isHindi ? "छिड़काव का समय" : "Best Spray Time"}
                </span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {diagnosis.bestSprayTime || "Early Morning"}
                </strong>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
              <ShieldCheck size={15} className="text-amber-500 shrink-0" />
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                  {isHindi ? "सुरक्षा" : "Safety"}
                </span>
                <strong className="text-slate-800 dark:text-slate-200">
                  Wear Mask &amp; Gloves
                </strong>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {/* Audio Listen */}
              <button
                type="button"
                onClick={toggleSpeech}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSpeaking
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400"
                    : "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                }`}
                title="Listen aloud to the prescription"
                id="modal-listen-btn"
              >
                {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                <span>
                  {isSpeaking
                    ? isHindi
                      ? "आवाज रोकें"
                      : "Stop Voice"
                    : isHindi
                      ? "बोलकर सुनें"
                      : "Listen Aloud"}
                </span>
              </button>

              {/* Copy */}
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Copy details to clipboard"
                id="modal-copy-btn"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-500" />
                ) : (
                  <Copy size={14} />
                )}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>

              {/* Save */}
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Save this diagnosis to your field diary"
                id="modal-save-log-btn"
              >
                <BookmarkCheck
                  size={14}
                  className={saved ? "text-emerald-500" : ""}
                />
                <span>{saved ? "Saved!" : "Save"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Scan Another Leaf */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onScanAnother) onScanAnother();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
                id="modal-scan-another-btn"
              >
                <RotateCcw size={14} />
                <span>
                  {isHindi ? "नया पत्ता जांचें" : "Check Another Leaf"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
