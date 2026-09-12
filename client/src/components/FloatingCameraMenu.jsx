import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Camera, ImageUp, X, Sparkles, AlertCircle } from "lucide-react";

export default function FloatingCameraMenu() {
  const [, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-agro-camera", handleOpen);
    return () => window.removeEventListener("open-agro-camera", handleOpen);
  }, []);

  const handleFileSelection = file => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        sessionStorage.setItem("agro_pending_scan", String(reader.result));
        sessionStorage.setItem(
          "agro_pending_scan_name",
          file.name || "field-leaf.jpg"
        );
      } catch (e) {
        console.warn("Storage quota exceeded, passing via state", e);
      }
      setIsOpen(false);
      navigate("/detect");
    };
    reader.readAsDataURL(file);
  };

  const handleSampleSelect = (sampleName, sampleUrl) => {
    sessionStorage.setItem("agro_pending_scan", sampleUrl);
    sessionStorage.setItem(
      "agro_pending_scan_name",
      `${sampleName} leaf sample`
    );
    setIsOpen(false);
    navigate("/detect");
  };

  return (
    <div className="floating-camera-container" id="floating-camera-menu">
      {/* Hidden file inputs for Camera and Gallery */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        style={{ display: "none" }}
        onChange={e => {
          handleFileSelection(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        style={{ display: "none" }}
        onChange={e => {
          handleFileSelection(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {/* Backdrop when menu is open */}
      {isOpen && (
        <div
          className="floating-menu-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Pop-up menu */}
      {isOpen && (
        <div
          className="floating-camera-popup"
          role="dialog"
          aria-label="Scan or upload crop photo"
        >
          <div className="floating-popup-header">
            <div className="floating-header-title">
              <span className="floating-popup-badge">Instant Check</span>
              <h3>Check Crop Health</h3>
              <p>Take or pick a leaf photo to find diseases</p>
            </div>
            <button
              type="button"
              className="floating-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="floating-action-buttons">
            <button
              type="button"
              className="floating-action-btn primary-camera-btn"
              onClick={() => cameraInputRef.current?.click()}
              id="fab-camera-action"
            >
              <div className="action-icon-wrap camera-bg">
                <Camera size={26} strokeWidth={2.2} />
              </div>
              <div className="action-label-wrap">
                <strong>Take Photo (Camera)</strong>
                <span>Open phone camera & snap leaf</span>
              </div>
            </button>

            <button
              type="button"
              className="floating-action-btn secondary-gallery-btn"
              onClick={() => galleryInputRef.current?.click()}
              id="fab-gallery-action"
            >
              <div className="action-icon-wrap gallery-bg">
                <ImageUp size={26} strokeWidth={2.2} />
              </div>
              <div className="action-label-wrap">
                <strong>Choose from Gallery</strong>
                <span>Upload saved photo from phone</span>
              </div>
            </button>
          </div>

          {/* Quick test sample photos for convenience */}
          <div className="floating-samples-strip">
            <span className="samples-hint">
              <Sparkles size={13} /> Or test with sample leaf:
            </span>
            <div className="samples-chips">
              <button
                type="button"
                className="sample-chip"
                onClick={() =>
                  handleSampleSelect(
                    "Chilli Leaf Curl",
                    "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=600&q=80"
                  )
                }
              >
                Chilli Leaf
              </button>
              <button
                type="button"
                className="sample-chip"
                onClick={() =>
                  handleSampleSelect(
                    "Rice Blast",
                    "https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=600&q=80"
                  )
                }
              >
                Rice Crop
              </button>
              <button
                type="button"
                className="sample-chip"
                onClick={() =>
                  handleSampleSelect(
                    "Cotton Boll",
                    "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80"
                  )
                }
              >
                Cotton Leaf
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        type="button"
        className={`floating-camera-trigger ${isOpen ? "is-active" : ""}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={
          isOpen ? "Close camera menu" : "Scan crop leaf with camera or gallery"
        }
        id="fab-camera-trigger"
      >
        <span className="fab-icon-bubble">
          {isOpen ? (
            <X size={26} strokeWidth={2.5} />
          ) : (
            <Camera size={26} strokeWidth={2.4} />
          )}
        </span>
        <span className="fab-text-label">{isOpen ? "Close" : "Scan Leaf"}</span>
      </button>
    </div>
  );
}
