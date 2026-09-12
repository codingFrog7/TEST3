import React, { useState } from "react";
import { Link } from "wouter";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Droplets,
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function CropCard({
  crop,
  initialExpanded = false,
  showFullTips = false,
}) {
  const [tipsOpen, setTipsOpen] = useState(initialExpanded || showFullTips);
  const isWatch = crop.status === "Watch";
  const tips = crop.expertTips;

  return (
    <article
      className={`crop-card ${isWatch ? "is-watch-status" : "is-healthy-status"}`}
      id={`crop-card-${crop.name.toLowerCase()}`}
    >
      <div className="crop-card-image">
        <img
          src={crop.image}
          alt={`${crop.name} (${crop.local}) crop`}
          loading="lazy"
        />
        <span className={`status-tag ${isWatch ? "watch" : "healthy"}`}>
          <span /> {crop.status}
        </span>
        <span className="crop-season-pill">
          {crop.season.split("·")[0].trim()}
        </span>
      </div>

      <div className="crop-card-body">
        <div className="crop-header-row">
          <div>
            <span className="crop-local">{crop.local}</span>
            <h3>{crop.name}</h3>
          </div>
          <span
            className={`crop-condition-badge ${isWatch ? "badge-watch" : "badge-healthy"}`}
          >
            {isWatch ? <AlertCircle size={13} /> : <CheckCircle2 size={13} />}
            <span>{isWatch ? "Needs Vigilance" : "Prime Condition"}</span>
          </span>
        </div>

        <p className="crop-note">{crop.note}</p>

        <div className="crop-meta-strip">
          <span>
            <Droplets size={12} /> {crop.water}
          </span>
          <span className="crop-season-text">{crop.season}</span>
        </div>

        {/* Symptoms tags */}
        {crop.symptoms && (
          <div className="crop-symptom-tags">
            <span className="symptom-label">Watch for:</span>
            {crop.symptoms.map(sym => (
              <span key={sym} className="symptom-tag">
                {sym}
              </span>
            ))}
          </div>
        )}

        {/* --- NEW EXPERT TIPS SECTION --- */}
        {tips && (
          <div
            className={`expert-tips-section ${
              isWatch ? "tips-watch" : "tips-healthy"
            } ${tipsOpen ? "is-open" : "is-collapsed"}`}
            aria-labelledby={`expert-tips-title-${crop.name.toLowerCase()}`}
          >
            <div className="expert-tips-header">
              <div className="tips-title-group">
                <span className="expert-icon-wrap" aria-hidden="true">
                  {isWatch ? (
                    <ShieldAlert size={15} className="expert-icon watch-icon" />
                  ) : (
                    <Sparkles size={15} className="expert-icon healthy-icon" />
                  )}
                </span>
                <div>
                  <span
                    id={`expert-tips-title-${crop.name.toLowerCase()}`}
                    className="expert-tips-label"
                  >
                    EXPERT ADVICE · {crop.status.toUpperCase()} STATUS
                  </span>
                  <strong className="expert-priority">{tips.priority}</strong>
                </div>
              </div>

              <button
                type="button"
                className="tips-toggle-btn"
                onClick={() => setTipsOpen(v => !v)}
                aria-expanded={tipsOpen}
                aria-label={`Toggle expert tips for ${crop.name}`}
              >
                <span>{tipsOpen ? "Hide advice" : "View advice"}</span>
                {tipsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {tipsOpen && (
              <div className="expert-tips-content">
                <p className="expert-summary">{tips.summary}</p>

                <div className="expert-timing-box">
                  <Clock size={13} />
                  <span>
                    <strong>Optimal window:</strong> {tips.bestTiming}
                  </span>
                </div>

                <div className="expert-recommendations">
                  <span className="rec-heading">
                    Cultivation Protocol for {tips.stage}:
                  </span>
                  <ul className="rec-list">
                    {tips.recommendations.map((rec, i) => (
                      <li key={i}>
                        <CheckCircle2 size={13} className="rec-check" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {tips.caution && (
                  <div className="expert-caution">
                    <Lightbulb size={13} />
                    <span>
                      <b>Field Caution:</b> {tips.caution}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="crop-card-foot">
          <Link
            href={`/guides?crop=${crop.name.toLowerCase()}`}
            className="crop-guide-link"
          >
            Full Guide <ArrowRight size={13} />
          </Link>
          <Link
            href={`/detect`}
            className="crop-check-link"
            title={`Check a ${crop.name} leaf`}
          >
            Scan Leaf <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
