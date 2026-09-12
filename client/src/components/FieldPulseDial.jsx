import React, { useState } from "react";
import { Sun, Droplets, ShieldCheck, Wind, Sparkles } from "lucide-react";

export default function FieldPulseDial() {
  const [activeMetric, setActiveMetric] = useState(0);

  const metrics = [
    {
      id: "solar",
      label: "Solar Radiation",
      icon: Sun,
      value: "840 W/m²",
      status: "Optimal Photosynthesis",
      sub: "7.4 hrs direct daylight · UV Index 5.8 (Moderate)",
      color: "#d97706",
      accentBg: "rgba(217, 119, 6, 0.08)",
      percentage: 84,
      advice: "Full leaf chlorophyll uptake active. No sunscald risk today.",
    },
    {
      id: "moisture",
      label: "Root Zone Soil",
      icon: Droplets,
      value: "64% VWC",
      status: "Well Hydrated",
      sub: "Depth 15–30 cm · Field Capacity at optimal 82%",
      color: "#0284c7",
      accentBg: "rgba(2, 132, 199, 0.08)",
      percentage: 64,
      advice: "Next drip irrigation cycle recommended tomorrow at 06:00 AM.",
    },
    {
      id: "spore",
      label: "Foliar Pathogen Risk",
      icon: ShieldCheck,
      value: "14% Low Risk",
      status: "Foliage Clean",
      sub: "Canopy humidity 58% · Dew duration 2.1 hrs",
      color: "#059669",
      accentBg: "rgba(5, 150, 105, 0.08)",
      percentage: 14,
      advice: "Conditions dry enough to prevent spore germination.",
    },
    {
      id: "spray",
      label: "Spraying Quality Window",
      icon: Wind,
      value: "92% Excellent",
      status: "Calm Breeze",
      sub: "Wind 4.2 km/h SSE · Delta-T 4.6°C · No droplet drift",
      color: "#16a34a",
      accentBg: "rgba(22, 163, 74, 0.08)",
      percentage: 92,
      advice: "Golden window for bio-fertilizer or foliar micronutrient spray.",
    },
  ];

  const current = metrics[activeMetric];
  const Icon = current.icon;

  return (
    <div className="field-pulse-container">
      <div className="field-pulse-header">
        <div className="pulse-title-wrap">
          <span className="pulse-dot-live" />
          <span className="pulse-label">Real-time Agronomic Pulse</span>
        </div>
        <span className="pulse-coords">16.3067° N, 80.4365° E · Guntur</span>
      </div>

      {/* 4 Minimal Metric Nodes */}
      <div className="pulse-nodes-grid">
        {metrics.map((m, index) => {
          const NodeIcon = m.icon;
          const isSelected = activeMetric === index;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveMetric(index)}
              className={`pulse-node-btn ${isSelected ? "selected" : ""}`}
              aria-selected={isSelected}
            >
              <div className="node-icon-row">
                <NodeIcon
                  size={15}
                  style={{ color: isSelected ? m.color : "currentColor" }}
                />
                <span className="node-percentage">{m.value}</span>
              </div>
              <span className="node-name">{m.label}</span>
              {isSelected && (
                <span
                  className="node-active-bar"
                  style={{ backgroundColor: m.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Metric Detail Pill */}
      <div
        className="pulse-detail-banner"
        style={{ background: current.accentBg }}
      >
        <div className="pulse-detail-left">
          <div
            className="pulse-detail-badge"
            style={{ color: current.color, borderColor: current.color }}
          >
            <Icon size={16} />
            <span>{current.status}</span>
          </div>
          <div className="pulse-detail-copy">
            <strong>{current.sub}</strong>
            <p>{current.advice}</p>
          </div>
        </div>

        {/* Minimal Arc Indicator */}
        <div className="pulse-detail-gauge">
          <svg className="pulse-gauge-svg" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              className="gauge-track"
            />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke={current.color}
              strokeWidth="3.5"
              strokeDasharray="113.1"
              strokeDashoffset={113.1 - (113.1 * current.percentage) / 100}
              strokeLinecap="round"
              transform="rotate(-90 22 22)"
              className="gauge-value"
            />
          </svg>
          <span className="pulse-gauge-text">{current.percentage}%</span>
        </div>
      </div>
    </div>
  );
}
