/**
 * DiagnosisResultCard — React version of result-card.html
 *
 * Receives the JSON shape from POST /api/python/diagnose:
 * {
 *   class, crop, disease, confidence_label,
 *   report: { cause, symptoms, treatment, organic_alternative,
 *             prevention, recovery_time, severity }
 * }
 *
 * Also supports the "Ask follow-up" box which calls POST /api/python/ask.
 */

import React, { useState } from "react";
import { PYTHON_API_BASE } from "../lib/config.js";

// Confidence label → percentage for the progress bar
const CONFIDENCE_TO_PCT = { low: 40, medium: 70, high: 92 };

function SeverityPill({ severity }) {
  const sev = (severity || "medium").toLowerCase();
  const cls =
    sev === "none" || sev === "low"
      ? "drc-sev-low"
      : sev === "high"
        ? "drc-sev-high"
        : "drc-sev-medium";
  return (
    <span className={`drc-severity-pill ${cls}`}>
      {sev.charAt(0).toUpperCase() + sev.slice(1)} severity
    </span>
  );
}

function SectionRow({ iconClass, svgPath, title, text }) {
  if (!text) return null;
  return (
    <div className="drc-section">
      <div className={`drc-section-icon ${iconClass}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {svgPath}
        </svg>
      </div>
      <div>
        <p className="drc-section-title">{title}</p>
        <p className="drc-section-text">{text}</p>
      </div>
    </div>
  );
}

export default function DiagnosisResultCard({ data, imageUrl }) {
  const [altOpen, setAltOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askLoading, setAskLoading] = useState(false);

  if (!data) return null;

  const r = data.report || {};

  // Confidence bar
  let pct;
  if (typeof data.confidence === "number") {
    pct = Math.round(data.confidence * 100);
  } else {
    const label = (data.confidence_label || "medium").toLowerCase();
    pct = CONFIDENCE_TO_PCT[label] ?? 70;
  }

  // Alternative diagnoses (only available from trained-model variant)
  const hasAlts = data.top3 && data.top3.length > 1;

  const handleAsk = async () => {
    if (!question.trim()) return;
    setAskLoading(true);
    setAnswer("Thinking…");
    try {
      const form = new FormData();
      form.append("question", question);
      const res = await fetch(`${PYTHON_API_BASE}/ask`, {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      setAnswer(json.answer || "No answer received.");
    } catch {
      setAnswer("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setAskLoading(false);
    }
  };

  return (
    <div className="drc-card">
      {/* ── Header ── */}
      <div className="drc-card-header">
        {imageUrl && (
          <img className="drc-thumb" src={imageUrl} alt="Uploaded crop photo" />
        )}
        <div className="drc-header-text">
          <p className="drc-crop-name">{data.crop || ""}</p>
          <h2 className="drc-disease-name">
            {data.disease || data.class || "Awaiting diagnosis…"}
          </h2>
          <div className="drc-severity-row">
            <SeverityPill severity={r.severity} />
          </div>
        </div>
      </div>

      {/* ── Confidence ── */}
      <div className="drc-confidence-block">
        <div className="drc-confidence-label">
          <span>Model confidence</span>
          <span>{pct}%</span>
        </div>
        <div className="drc-confidence-track">
          <div className="drc-confidence-fill" style={{ width: `${pct}%` }} />
        </div>

        {hasAlts && (
          <>
            <button
              className="drc-alt-toggle"
              onClick={() => setAltOpen(o => !o)}
            >
              {altOpen ? "Hide" : "Show"} other possibilities
            </button>
            {altOpen && (
              <ul className="drc-alt-list">
                {data.top3.slice(1).map((alt, i) => (
                  <li key={i}>
                    <span>{alt.class.replace("___", ", ").replace(/_/g, " ")}</span>
                    <span>{Math.round(alt.confidence * 100)}%</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* ── Sections ── */}
      <SectionRow
        iconClass="drc-icon-cause"
        svgPath={<><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></>}
        title="Cause"
        text={r.cause}
      />
      <SectionRow
        iconClass="drc-icon-symptoms"
        svgPath={<path d="M12 2 4 7v10l8 5 8-5V7z" />}
        title="Symptoms"
        text={r.symptoms}
      />
      <SectionRow
        iconClass="drc-icon-treatment"
        svgPath={<><path d="M9 2v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V2" /><path d="M8 2h8" /></>}
        title="Treatment"
        text={r.treatment}
      />
      <SectionRow
        iconClass="drc-icon-organic"
        svgPath={<path d="M12 22c5-2 8-6 8-12V5l-8-3-8 3v5c0 6 3 10 8 12Z" />}
        title="Organic alternative"
        text={r.organic_alternative}
      />
      <SectionRow
        iconClass="drc-icon-prevention"
        svgPath={<path d="M12 2v20M2 12h20" />}
        title="Prevention"
        text={r.prevention}
      />
      <SectionRow
        iconClass="drc-icon-recovery"
        svgPath={<><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="9" /></>}
        title="Expected recovery"
        text={r.recovery_time}
      />

      {/* ── Ask follow-up ── */}
      <div className="drc-ask-block">
        <div className="drc-ask-row">
          <input
            className="drc-ask-input"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAsk()}
            placeholder="Ask a follow-up, e.g. is this safe near flowering plants?"
          />
          <button
            className="drc-ask-button"
            onClick={handleAsk}
            disabled={askLoading}
          >
            Ask
          </button>
        </div>
        {answer && (
          <div className="drc-ask-answer">{answer}</div>
        )}
      </div>
    </div>
  );
}
