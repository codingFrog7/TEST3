import React, { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Droplets,
  Flame,
  Info,
  ShieldAlert,
  Snowflake,
  ThermometerSun,
  Wind,
} from "lucide-react";
import { evaluateWeatherAlerts } from "../data/siteContent.js";

export default function WeatherAlertBar({
  days,
  onScenarioChange,
  activeScenarioId = "forecast",
  compact = false,
}) {
  const [expanded, setExpanded] = useState(false);
  const [showScenarioMenu, setShowScenarioMenu] = useState(false);

  const alerts = evaluateWeatherAlerts(days);
  const hasAlerts = alerts.length > 0;
  const primaryAlert = hasAlerts ? alerts[0] : null;

  const getIcon = type => {
    switch (type) {
      case "frost":
        return <Snowflake size={18} className="alert-type-icon frost" />;
      case "heavy_rain":
        return <CloudRain size={18} className="alert-type-icon rain" />;
      case "heatwave":
        return <Flame size={18} className="alert-type-icon heat" />;
      default:
        return <AlertTriangle size={18} className="alert-type-icon default" />;
    }
  };

  return (
    <div
      id="weather-alert-bar-root"
      className={`weather-alert-bar ${
        hasAlerts ? `alert-${primaryAlert.type} is-active` : "alert-calm"
      } ${compact ? "is-compact" : ""}`}
      role="region"
      aria-label="Extreme Weather Alerts"
    >
      <div className="alert-bar-main">
        <div className="alert-bar-left">
          <span className="alert-badge-icon" aria-hidden="true">
            {hasAlerts ? (
              getIcon(primaryAlert.type)
            ) : (
              <ShieldAlert size={18} className="alert-type-icon calm" />
            )}
          </span>
          <div className="alert-bar-text">
            <div className="alert-bar-headline">
              {hasAlerts ? (
                <>
                  <span className={`alert-pill ${primaryAlert.severity}`}>
                    {primaryAlert.urgency}
                  </span>
                  <strong className="alert-title">{primaryAlert.title}</strong>
                </>
              ) : (
                <>
                  <span className="alert-pill normal">WEATHER NORMAL</span>
                  <strong className="alert-title">
                    No extreme weather hazard active
                  </strong>
                </>
              )}
            </div>
            <p className="alert-description">
              {hasAlerts
                ? primaryAlert.message
                : "Forecast shows moderate temperatures and manageable rainfall. Safe window for foliar nutrition and routine field scouting."}
            </p>
          </div>
        </div>

        <div className="alert-bar-actions">
          {onScenarioChange && (
            <div className="scenario-selector-wrap">
              <button
                type="button"
                className="scenario-btn"
                onClick={() => setShowScenarioMenu(v => !v)}
                title="Simulate forecast scenarios"
                aria-expanded={showScenarioMenu}
              >
                <span>Forecast test</span>
                <ChevronDown size={13} />
              </button>
              {showScenarioMenu && (
                <div
                  className="scenario-dropdown"
                  role="menu"
                  aria-label="Forecast scenarios"
                >
                  <span className="dropdown-label">
                    Simulate extreme weather:
                  </span>
                  <button
                    type="button"
                    className={`scenario-item ${
                      activeScenarioId === "forecast" ? "selected" : ""
                    }`}
                    onClick={() => {
                      onScenarioChange("forecast");
                      setShowScenarioMenu(false);
                    }}
                  >
                    <Droplets size={13} /> Current 5-Day Forecast (Rain 60%)
                  </button>
                  <button
                    type="button"
                    className={`scenario-item ${
                      activeScenarioId === "heavyRain" ? "selected" : ""
                    }`}
                    onClick={() => {
                      onScenarioChange("heavyRain");
                      setShowScenarioMenu(false);
                    }}
                  >
                    <CloudRain size={13} /> Extreme Heavy Rain (90% Rain)
                  </button>
                  <button
                    type="button"
                    className={`scenario-item ${
                      activeScenarioId === "frostCold" ? "selected" : ""
                    }`}
                    onClick={() => {
                      onScenarioChange("frostCold");
                      setShowScenarioMenu(false);
                    }}
                  >
                    <Snowflake size={13} /> Frost & Cold Wave (Low: 4°C)
                  </button>
                  <button
                    type="button"
                    className={`scenario-item ${
                      activeScenarioId === "heatwave" ? "selected" : ""
                    }`}
                    onClick={() => {
                      onScenarioChange("heatwave");
                      setShowScenarioMenu(false);
                    }}
                  >
                    <ThermometerSun size={13} /> Extreme Heatwave (High: 42°C)
                  </button>
                </div>
              )}
            </div>
          )}

          {hasAlerts && (
            <button
              type="button"
              className="alert-toggle-btn"
              onClick={() => setExpanded(prev => !prev)}
              aria-expanded={expanded}
              aria-controls="alert-checklist-panel"
            >
              <span>{expanded ? "Hide Action Plan" : "Field Actions"}</span>
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>

      {hasAlerts && expanded && (
        <div id="alert-checklist-panel" className="alert-expanded-panel">
          <div className="checklist-header">
            <span className="checklist-eyebrow">
              IMMEDIATE FIELD PROTOCOL FOR {primaryAlert.event.toUpperCase()}
            </span>
            <span className="metric-chip">Trigger: {primaryAlert.metric}</span>
          </div>

          <div className="alert-action-grid">
            {primaryAlert.actionPoints.map((action, idx) => (
              <div key={idx} className="alert-action-item">
                <span className="action-step-num">0{idx + 1}</span>
                <p>{action}</p>
              </div>
            ))}
          </div>

          <div className="alert-source-footer">
            <Info size={13} />
            <small>
              Advisory dynamically derived from agrometeorological thresholds.
              Cross-verify with your mandal / district Agromet Advisory Services
              (IMD).
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
