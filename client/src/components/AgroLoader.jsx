import React, { useState, useEffect } from "react";

export default function AgroLoader({ onComplete, forceShow = false }) {
  const [visible, setVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    // If not forced and already shown in this session, skip unless forced
    if (!forceShow) {
      const alreadySeen = sessionStorage.getItem("agro_loader_seen");
      if (alreadySeen) {
        setVisible(false);
        if (onComplete) onComplete();
        return;
      }
    }

    const t1 = setTimeout(() => {
      setProgress(55);
    }, 280);

    const t2 = setTimeout(() => {
      setProgress(88);
    }, 650);

    const t3 = setTimeout(() => {
      setProgress(100);
    }, 1000);

    const tFade = setTimeout(() => {
      setIsFadingOut(true);
    }, 1250);

    const tDone = setTimeout(() => {
      sessionStorage.setItem("agro_loader_seen", "true");
      setVisible(false);
      if (onComplete) onComplete();
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tFade);
      clearTimeout(tDone);
    };
  }, [forceShow, onComplete]);

  if (!visible) return null;

  const handleDismiss = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      sessionStorage.setItem("agro_loader_seen", "true");
      setVisible(false);
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <div
      className={`agro-splash-overlay ${isFadingOut ? "is-fading-out" : ""}`}
      role="dialog"
      aria-label="Loading Agro Sathi"
      onClick={handleDismiss}
      style={{ cursor: "pointer" }}
    >
      <div
        className="agro-splash-card"
        onClick={e => e.stopPropagation()}
        style={{ cursor: "default" }}
      >
        {/* Animated Brand Emblem Stage */}
        <div className="agro-splash-emblem-stage">
          <div className="agro-splash-glow-ring" aria-hidden="true" />
          <div className="agro-splash-orbit-ring" aria-hidden="true" />
          <div className="agro-splash-logo-box">
            <img
              src="/agro-sathi-icon.png"
              alt="AGRO SATHI"
              className="agro-splash-logo-img"
            />
          </div>
        </div>

        {/* Minimal Brand Identity */}
        <div className="agro-splash-title">
          <span className="part-agro">AGRO</span>
          <span className="part-sathi">SATHI</span>
        </div>

        {/* Minimal Animated Micro Progress Bar */}
        <div className="agro-splash-progress-track" aria-hidden="true">
          <div
            className="agro-splash-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
