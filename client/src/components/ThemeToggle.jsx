import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeToggle({ showLabel = false, className = "" }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      id="theme-toggle-button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${isDark ? "is-dark" : "is-light"} ${className}`}
      aria-label={
        isDark
          ? "Switch to Daylight light mode"
          : "Switch to Early morning high-contrast dark mode"
      }
      title={
        isDark
          ? "Switch to daylight mode"
          : "Early morning field mode (high-contrast dark)"
      }
    >
      <span className="theme-toggle-icon-wrap" aria-hidden="true">
        {isDark ? (
          <Moon size={15} className="theme-icon moon-icon" strokeWidth={2.2} />
        ) : (
          <Sun size={15} className="theme-icon sun-icon" strokeWidth={2.2} />
        )}
      </span>
      {showLabel && (
        <span className="theme-toggle-label">
          {isDark ? "Field Dark" : "Daylight"}
        </span>
      )}
      <span className="theme-mode-indicator" aria-hidden="true">
        <span
          className={`indicator-dot ${isDark ? "active-dark" : "active-light"}`}
        />
      </span>
    </button>
  );
}
