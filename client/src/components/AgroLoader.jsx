import React, { useState, useEffect } from "react";
import { Sprout, Sun, Droplets, CheckCircle, X } from "lucide-react";

export default function AgroLoader({ onComplete, forceShow = false }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(15);
  const [stageText, setStageText] = useState("Waking up soil sensors...");

  useEffect(() => {
    // If not forced and already shown in this session, skip quickly unless forced
    if (!forceShow) {
      const alreadySeen = sessionStorage.getItem("agro_loader_seen");
      if (alreadySeen) {
        setVisible(false);
        if (onComplete) onComplete();
        return;
      }
    }

    const t1 = setTimeout(() => {
      setProgress(45);
      setStageText("Connecting to Agromet weather satellite...");
    }, 450);

    const t2 = setTimeout(() => {
      setProgress(80);
      setStageText("Syncing Telangana APMC mandi market rates...");
    }, 950);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStageText("Fields are ready! Welcome to Agro Sathi.");
    }, 1400);

    const t4 = setTimeout(() => {
      sessionStorage.setItem("agro_loader_seen", "true");
      setVisible(false);
      if (onComplete) onComplete();
    }, 1850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [forceShow, onComplete]);

  if (!visible) return null;

  return (
    <div
      className="agro-splash-overlay"
      role="dialog"
      aria-label="Loading Agro Sathi"
    >
      <div className="agro-splash-card">
        {/* Animated Sprout Illustration */}
        <div className="agro-splash-illustration">
          <div className="sun-ring">
            <Sun className="splash-sun-icon" size={38} />
          </div>
          <div className="sprout-pot">
            <svg
              className="sprout-svg"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Soil mound */}
              <ellipse
                cx="60"
                cy="98"
                rx="42"
                ry="12"
                fill="#5c3a21"
                opacity="0.85"
              />
              <ellipse cx="60" cy="96" rx="36" ry="9" fill="#7a4e2d" />

              {/* Animated Stem */}
              <path
                className="stem-grow-path"
                d="M60 95 Q60 65 60 48"
                stroke="#16a34a"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Left Leaf */}
              <path
                className="leaf-left-grow"
                d="M60 68 C45 68 36 50 44 42 C54 36 58 56 60 68 Z"
                fill="#22c55e"
              />

              {/* Right Leaf */}
              <path
                className="leaf-right-grow"
                d="M60 55 C76 54 84 38 76 30 C66 26 62 44 60 55 Z"
                fill="#4ade80"
              />

              {/* Dewdrop */}
              <circle
                className="dewdrop-pulse"
                cx="72"
                cy="36"
                r="3"
                fill="#38bdf8"
              />
            </svg>
          </div>
        </div>

        {/* Brand Name & Motto */}
        <div className="agro-splash-brand">
          <div className="splash-pill-badge">
            <Sprout size={13} />
            <span>Kisan Mitra · Farmer Companion</span>
          </div>
          <h2>AGRO SATHI</h2>
          <p className="splash-tagline">हर खेत का सच्चा साथी</p>
        </div>

        {/* Animated Progress Bar */}
        <div className="agro-splash-progress-wrap">
          <div className="agro-splash-progress-track">
            <div
              className="agro-splash-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="agro-splash-status">
            <span className="status-message">{stageText}</span>
            <span className="status-percent">{progress}%</span>
          </div>
        </div>

        {/* Skip button for quick navigation */}
        <button
          type="button"
          className="agro-splash-skip"
          onClick={() => {
            sessionStorage.setItem("agro_loader_seen", "true");
            setVisible(false);
            if (onComplete) onComplete();
          }}
          aria-label="Skip loading animation"
        >
          Skip into field &rarr;
        </button>
      </div>
    </div>
  );
}
