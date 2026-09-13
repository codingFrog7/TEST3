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
        {/* Official Brand Logo Emblem */}
        <div
          className="agro-splash-illustration"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "22px",
              background: "#caeb80",
              boxShadow: "0 10px 30px rgba(35, 83, 48, 0.22)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/agro-sathi-icon.png"
              alt="AGRO SATHI"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
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
