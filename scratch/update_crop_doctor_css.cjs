const fs = require('fs');
const path = require('path');

// 1. Update client/src/index.css
const cssPath = path.resolve('c:/Users/rajup/OneDrive/Documents/TEST3/client/src/index.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const marker = '/* Bento Grid Modal Overlay - Premium UI */';
const markerIdx = cssContent.indexOf(marker);

if (markerIdx === -1) {
  console.error('Marker not found in index.css!');
  process.exit(1);
}

const newCss = `/* Bento Grid Modal Overlay - Premium UI Overhaul */
.bento-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: bentoFadeIn 0.28s ease-out;
}

@keyframes bentoFadeIn {
  from { opacity: 0; backdrop-filter: blur(0px); }
  to { opacity: 1; backdrop-filter: blur(16px); }
}

@keyframes bentoSlideUp {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.bento-modal-content {
  width: 86%;
  max-width: 1220px;
  height: 90vh;
  max-height: 880px;
  background: #ffffff;
  border-radius: 28px;
  padding: 26px 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 32px 70px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(226, 232, 240, 0.8);
  animation: bentoSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  font-family: var(--font-sans, "Plus Jakarta Sans", system-ui, sans-serif);
}

.dark .bento-modal-content {
  background: #181b18;
  border-color: #2c322b;
  box-shadow: 0 32px 80px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.bento-close-btn {
  position: absolute;
  top: 22px;
  right: 24px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  z-index: 20;
  transition: all 0.2s ease;
}

.bento-close-btn:hover {
  background: #ef4444;
  color: #ffffff;
  border-color: #ef4444;
  transform: rotate(90deg) scale(1.06);
}

.dark .bento-close-btn {
  background: #242923;
  border-color: #353c33;
  color: #94a3b8;
}

.dark .bento-close-btn:hover {
  background: #ef4444;
  color: #ffffff;
}

/* Bento Grid Container */
.bento-grid-container {
  display: grid;
  grid-template-columns: 1.8fr 1.15fr 1.35fr;
  grid-template-rows: auto 1.35fr 1.45fr;
  gap: 16px;
  flex: 1;
  overflow: hidden;
  margin-top: 10px;
}

.bento-box {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.dark .bento-box {
  background: #20241f;
  border-color: #2e352d;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.bento-box:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.bento-scrollable {
  overflow-y: auto;
  padding-right: 4px;
}

.bento-scrollable::-webkit-scrollbar {
  width: 5px;
}

.bento-scrollable::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}

.dark .bento-scrollable::-webkit-scrollbar-thumb {
  background-color: #3f473d;
}

/* Bento Header Area */
.bento-header {
  grid-column: 1 / 3;
  grid-row: 1;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
}

.dark .bento-header {
  background: linear-gradient(135deg, #20241f 0%, #1a1e1a 100%);
  border-color: #2e352d;
}

.bento-header-img-box {
  position: relative;
  flex-shrink: 0;
}

.bento-header-img {
  width: 88px;
  height: 88px;
  border-radius: 18px;
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border: 2px solid #ffffff;
  display: block;
}

.dark .bento-header-img {
  border-color: #2e352d;
}

.bento-header-img-placeholder {
  width: 88px;
  height: 88px;
  border-radius: 18px;
  background: #e2e8f0;
  display: grid;
  place-items: center;
  color: #94a3b8;
}

.dark .bento-header-img-placeholder {
  background: #2a3128;
  color: #64748b;
}

.bento-header-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.bento-header-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.bento-subtitle {
  font-size: 11px;
  font-weight: 800;
  color: #01520f;
  background: rgba(182, 240, 34, 0.25);
  padding: 2px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.dark .bento-subtitle {
  color: #b6f022;
  background: rgba(182, 240, 34, 0.15);
}

.bento-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 2px 0 6px;
  line-height: 1.15;
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .bento-title {
  color: #f1f5f9;
}

.bento-local-name {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 8px;
}

.dark .bento-local-name {
  color: #94a3b8;
}

.bento-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.bento-tag {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.bento-tag.severity-high { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
.bento-tag.severity-med { background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }
.bento-tag.severity-low { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
.bento-tag.crop-name { background: #f0fdf4; color: #01520f; border: 1px solid #bbf7d0; }
.bento-tag.pathogen-type { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

.dark .bento-tag.crop-name { background: rgba(182, 240, 34, 0.15); color: #b6f022; border-color: rgba(182, 240, 34, 0.3); }
.dark .bento-tag.pathogen-type { background: #2a3128; color: #cbd5e1; border-color: #3f473d; }

/* Header Toolbar */
.bento-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
  padding-right: 36px;
}

.bento-action-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #334155;
  transition: all 0.2s ease;
}

.bento-action-pill-btn:hover {
  border-color: #01520f;
  color: #01520f;
  background: #f8fafc;
}

.bento-action-pill-btn.active-speaking {
  background: #b6f022;
  color: #01520f;
  border-color: #01520f;
  animation: pulseSpeaking 1.5s infinite;
}

@keyframes pulseSpeaking {
  0%, 100% { box-shadow: 0 0 0 0 rgba(182, 240, 34, 0.6); }
  50% { box-shadow: 0 0 0 8px rgba(182, 240, 34, 0); }
}

.dark .bento-action-pill-btn {
  background: #262c24;
  border-color: #394237;
  color: #e2e8f0;
}

.dark .bento-action-pill-btn:hover {
  border-color: #b6f022;
  color: #b6f022;
}

/* Confidence Area */
.bento-confidence {
  grid-column: 3;
  grid-row: 1;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.dark .bento-confidence {
  background: linear-gradient(135deg, #20241f 0%, #1a1e1a 100%);
}

.confidence-ring {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.06);
}

.confidence-inner {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}

.dark .confidence-inner {
  background: #181b18;
}

.confidence-val {
  font-size: 22px;
  font-weight: 900;
  color: #01520f;
  line-height: 1;
}

.dark .confidence-val {
  color: #b6f022;
}

.confidence-val small { font-size: 11px; font-weight: 700; color: #64748b; margin-left: 2px;}
.confidence-label {
  font-size: 9px;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 3px;
}

.icar-verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 3px 8px;
  background: rgba(1, 82, 15, 0.08);
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  color: #01520f;
  letter-spacing: 0.02em;
}

.dark .icar-verified-badge {
  background: rgba(182, 240, 34, 0.12);
  color: #b6f022;
}

/* Box Section Headers */
.bento-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.bento-section-title {
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
  margin: 0;
}

.dark .bento-section-title {
  color: #f1f5f9;
}

.bento-count-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #64748b;
}

.dark .bento-count-badge {
  background: #2a3128;
  color: #94a3b8;
}

/* Structured Symptoms Area */
.bento-symptoms {
  grid-column: 1;
  grid-row: 2;
}

.bento-items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bento-structured-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.dark .bento-structured-card {
  background: #1c201b;
  border-color: #293026;
}

.bento-structured-card:hover {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.dark .bento-structured-card:hover {
  background: #222720;
  border-color: #353d32;
}

.bento-card-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6366f1;
  margin-top: 5px;
  flex-shrink: 0;
}

.bento-card-text {
  flex: 1;
  min-width: 0;
}

.bento-card-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
  margin-bottom: 2px;
}

.dark .bento-card-title {
  color: #f1f5f9;
}

.bento-card-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.45;
}

.dark .bento-card-desc {
  color: #94a3b8;
}

/* Treatment Specs / Metrics Area */
.bento-metrics {
  grid-column: 2;
  grid-row: 2;
  justify-content: space-between;
}

.bento-stat-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.bento-stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
}

.dark .bento-stat-item {
  background: #1c201b;
  border-color: #293026;
}

.bento-stat-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.bento-stat-icon-wrap.blue { background: #dbeafe; color: #2563eb; }
.bento-stat-icon-wrap.amber { background: #fef3c7; color: #d97706; }
.bento-stat-icon-wrap.emerald { background: #dcfce7; color: #16a34a; }
.bento-stat-icon-wrap.purple { background: #f3e8ff; color: #9333ea; }

.dark .bento-stat-icon-wrap.blue { background: rgba(37, 99, 235, 0.2); color: #60a5fa; }
.dark .bento-stat-icon-wrap.amber { background: rgba(217, 119, 6, 0.2); color: #fbbf24; }
.dark .bento-stat-icon-wrap.emerald { background: rgba(22, 163, 74, 0.2); color: #4ade80; }
.dark .bento-stat-icon-wrap.purple { background: rgba(147, 51, 234, 0.2); color: #c084fc; }

.bento-stat-content {
  flex: 1;
  min-width: 0;
}

.bento-stat-label {
  font-size: 10.5px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 2px;
}

.dark .bento-stat-label {
  color: #94a3b8;
}

.bento-stat-val {
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.dark .bento-stat-val {
  color: #f1f5f9;
}

.bento-stat-sub {
  font-size: 11px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Structured Immediate Actions Area */
.bento-actions {
  grid-column: 3;
  grid-row: 2;
}

.bento-step-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  margin-bottom: 9px;
  transition: all 0.2s ease;
}

.bento-step-card:last-child {
  margin-bottom: 0;
}

.dark .bento-step-card {
  background: #1c201b;
  border-color: #293026;
}

.bento-step-card:hover {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.dark .bento-step-card:hover {
  background: #222720;
  border-color: #353d32;
}

.bento-step-pill {
  padding: 3px 7px;
  border-radius: 6px;
  background: #10b981;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  flex-shrink: 0;
  margin-top: 2px;
}

.bento-step-content {
  flex: 1;
  min-width: 0;
}

.bento-step-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
  margin-bottom: 2px;
}

.dark .bento-step-title {
  color: #f1f5f9;
}

.bento-step-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.45;
}

.dark .bento-step-desc {
  color: #94a3b8;
}

/* Remedies Area */
.bento-remedies {
  grid-column: 1 / 3;
  grid-row: 3;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.bento-remedy-card {
  border-radius: 20px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid transparent;
}

.bento-remedy-card:hover {
  transform: translateY(-2px);
}

.bento-remedy-card.organic {
  background: linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #bbf7d0;
  box-shadow: 0 4px 16px rgba(22, 163, 74, 0.08);
}

.dark .bento-remedy-card.organic {
  background: linear-gradient(145deg, #15271a 0%, #102014 100%);
  border-color: #1f4228;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.bento-remedy-card.chemical {
  background: linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #bfdbfe;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
}

.dark .bento-remedy-card.chemical {
  background: linear-gradient(145deg, #152238 0%, #0f1a2e 100%);
  border-color: #1e3a63;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.remedy-badge-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
  width: fit-content;
}

.bento-remedy-card.organic .remedy-badge-tag {
  background: rgba(22, 163, 74, 0.15);
  color: #15803d;
}

.dark .bento-remedy-card.organic .remedy-badge-tag {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
}

.bento-remedy-card.chemical .remedy-badge-tag {
  background: rgba(37, 99, 235, 0.15);
  color: #1d4ed8;
}

.dark .bento-remedy-card.chemical .remedy-badge-tag {
  background: rgba(96, 165, 250, 0.15);
  color: #93c5fd;
}

.remedy-main-title {
  font-size: 14.5px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
  line-height: 1.3;
}

.dark .remedy-main-title {
  color: #f1f5f9;
}

.remedy-dosage-desc {
  font-size: 12.5px;
  color: #334155;
  line-height: 1.5;
  margin-bottom: 8px;
  font-weight: 500;
}

.dark .remedy-dosage-desc {
  color: #cbd5e1;
}

.remedy-safety-note {
  margin-top: auto;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.bento-remedy-card.organic .remedy-safety-note {
  color: #16a34a;
}

.dark .bento-remedy-card.organic .remedy-safety-note {
  color: #4ade80;
}

.bento-remedy-card.chemical .remedy-safety-note {
  color: #2563eb;
}

.dark .bento-remedy-card.chemical .remedy-safety-note {
  color: #60a5fa;
}

/* QA Area */
.bento-qa {
  grid-column: 3;
  grid-row: 3;
  display: flex;
  flex-direction: column;
}

.bento-qa-chips-row {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.bento-qa-chip {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.bento-qa-chip:hover {
  background: #8b5cf6;
  color: #ffffff;
  border-color: #8b5cf6;
}

.dark .bento-qa-chip {
  background: #282f26;
  border-color: #384235;
  color: #94a3b8;
}

.dark .bento-qa-chip:hover {
  background: #8b5cf6;
  color: #ffffff;
}

.bento-qa-wrapper {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.bento-qa-input {
  flex: 1;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 9px 12px;
  border-radius: 12px;
  font-size: 12px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  color: #0f172a;
}

.dark .bento-qa-input {
  background: #1c201b;
  border-color: #2e352d;
  color: #f1f5f9;
}

.bento-qa-input:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.bento-qa-btn {
  padding: 0 14px;
  border-radius: 12px;
  background: #8b5cf6;
  color: #ffffff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.1s;
}

.bento-qa-btn:hover { background: #7c3aed; }
.bento-qa-btn:active { transform: scale(0.95); }

.bento-qa-answer {
  flex: 1;
  background: #f8fafc;
  border-left: 3px solid #8b5cf6;
  padding: 9px 12px;
  border-radius: 0 10px 10px 0;
  font-size: 12px;
  color: #334155;
  line-height: 1.5;
  overflow-y: auto;
}

.dark .bento-qa-answer {
  background: #1c201b;
  color: #cbd5e1;
}

/* =========================================================
   CROP DOCTOR PAGE STYLES (DetectPage.jsx shell)
   ========================================================= */
.crop-doctor-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 10px 0 40px;
}

.crop-doctor-hero-banner {
  text-align: center;
  margin-bottom: 24px;
  position: relative;
}

.crop-doctor-brand-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px 5px 6px;
  border-radius: 999px;
  margin-bottom: 12px;
  background: #ffffff;
  border: 1px solid rgba(1, 82, 15, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.dark .crop-doctor-brand-pill {
  background: #20241f;
  border-color: rgba(182, 240, 34, 0.25);
}

.crop-doctor-title {
  font-size: 36px;
  font-weight: 900;
  color: #01520f;
  margin: 0 0 10px;
  letter-spacing: -0.025em;
}

.dark .crop-doctor-title {
  color: #b6f022;
}

.crop-doctor-sub {
  font-size: 15px;
  color: #586256;
  max-width: 660px;
  margin: 0 auto 20px;
  line-height: 1.55;
}

.dark .crop-doctor-sub {
  color: #9ca895;
}

.crop-doctor-flow-chips {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.crop-doctor-step-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: 999px;
  background: #f1f5f9;
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.dark .crop-doctor-step-chip {
  background: #222620;
  border-color: #323a30;
  color: #cbd5e1;
}

.crop-doctor-step-num {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #01520f;
  color: #ffffff;
  font-size: 10px;
  display: grid;
  place-items: center;
}

.dark .crop-doctor-step-num {
  background: #b6f022;
  color: #1d1d1d;
}

/* Crop Selection Bar */
.crop-select-container {
  margin-bottom: 22px;
}

.crop-select-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.crop-select-title {
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dark .crop-select-title {
  color: #f1f5f9;
}

.crop-pill-track {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.crop-pill-track::-webkit-scrollbar {
  height: 4px;
}

.crop-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: 999px;
  background: #ffffff;
  border: 1.5px solid #d4d9cc;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.crop-pill-btn:hover {
  border-color: #01520f;
  color: #01520f;
  transform: translateY(-1px);
}

.crop-pill-btn.active {
  background: #01520f;
  color: #ffffff;
  border-color: #01520f;
  box-shadow: 0 4px 14px rgba(1, 82, 15, 0.25);
}

.dark .crop-pill-btn {
  background: #20241f;
  border-color: #353b31;
  color: #cbd5e1;
}

.dark .crop-pill-btn:hover {
  border-color: #b6f022;
  color: #b6f022;
}

.dark .crop-pill-btn.active {
  background: #b6f022;
  color: #1d1d1d;
  border-color: #b6f022;
  box-shadow: 0 4px 14px rgba(182, 240, 34, 0.35);
}

/* Sample Quick Test Leaves Row */
.sample-leaves-section {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #e2e8f0;
}

.dark .sample-leaves-section {
  border-top-color: #2e352d;
}

.sample-leaves-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.sample-leaves-title {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dark .sample-leaves-title {
  color: #94a3b8;
}

.sample-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.sample-leaf-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.dark .sample-leaf-card {
  background: #1c201b;
  border-color: #293026;
}

.sample-leaf-card:hover {
  background: #ffffff;
  border-color: #01520f;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.dark .sample-leaf-card:hover {
  background: #222720;
  border-color: #b6f022;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.sample-leaf-thumb {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}

.sample-leaf-info {
  flex: 1;
  min-width: 0;
}

.sample-leaf-name {
  font-size: 12.5px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.25;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .sample-leaf-name {
  color: #f1f5f9;
}

.sample-leaf-crop {
  font-size: 11px;
  color: #64748b;
}

.dark .sample-leaf-crop {
  color: #94a3b8;
}
`;

const updatedCss = cssContent.substring(0, markerIdx) + newCss;
fs.writeFileSync(cssPath, updatedCss, 'utf8');
console.log('Successfully replaced index.css with complete UI overhaul!');
