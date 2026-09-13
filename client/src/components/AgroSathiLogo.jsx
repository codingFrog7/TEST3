import React from "react";
import { Link } from "wouter";
import { useTheme } from "../context/ThemeContext.jsx";

/**
 * AgroSathiLogo - Official Brand Logo for Agro Sathi
 * Features the official emblem badge with clean monochrome brand typography:
 * strictly Black, White, or Grey according to the theme.
 */
export default function AgroSathiLogo({
  size = "md",
  asLink = true,
  href = "/",
  className = "",
  onClick,
  inverted = false,
  showTagline = false,
  compact = false,
}) {
  const effectiveSize = compact ? "sm" : size;

  let isDark = false;
  try {
    const themeContext = useTheme();
    isDark = themeContext?.isDark ?? false;
  } catch {
    // fallback if rendered outside provider
  }

  // Strict monochrome palette: strictly Black, White, or Grey according to theme
  const agroColor = inverted ? "#ffffff" : isDark ? "#ffffff" : "#0f172a";
  const sathiColor = inverted ? "#cbd5e1" : isDark ? "#cbd5e1" : "#475569";
  const taglineColor = inverted ? "#94a3b8" : isDark ? "#94a3b8" : "#64748b";

  // Dimensions mapping
  const sizeConfig = {
    xs: {
      iconSize: 26,
      titleSize: "14px",
      gap: "7px",
      badgeRadius: "8px",
      taglineSize: "9px",
    },
    sm: {
      iconSize: 34,
      titleSize: "16px",
      gap: "8px",
      badgeRadius: "9px",
      taglineSize: "10px",
    },
    md: {
      iconSize: 40,
      titleSize: "18px",
      gap: "10px",
      badgeRadius: "10px",
      taglineSize: "11px",
    },
    lg: {
      iconSize: 48,
      titleSize: "22px",
      gap: "12px",
      badgeRadius: "12px",
      taglineSize: "12px",
    },
    xl: {
      iconSize: 60,
      titleSize: "26px",
      gap: "14px",
      badgeRadius: "14px",
      taglineSize: "13px",
    },
  };

  const current = sizeConfig[effectiveSize] || sizeConfig.md;

  const LogoIcon = (
    <div
      className="agro-sathi-brand-emblem"
      style={{
        width: `${current.iconSize}px`,
        height: `${current.iconSize}px`,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        borderRadius: current.badgeRadius,
        background: "#caeb80",
        border: "1px solid rgba(35, 83, 48, 0.18)",
        boxShadow: inverted
          ? "0 2px 10px rgba(0, 0, 0, 0.45)"
          : "0 2px 8px rgba(35, 83, 48, 0.18)",
        overflow: "hidden",
        transition:
          "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease",
      }}
      aria-hidden="true"
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
  );

  const LogoText = (
    <div
      className={`agro-sathi-brand-typography ${inverted ? "agro-sathi-inverted" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        lineHeight: 1.15,
      }}
    >
      <div
        className="agro-sathi-brand-title"
        style={{
          display: "flex",
          alignItems: "baseline",
          fontFamily:
            '"Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: 800,
          fontSize: current.titleSize,
          letterSpacing: "-0.01em",
        }}
      >
        <span
          className="agro-part"
          style={{
            color: agroColor,
            transition: "color 0.15s ease",
            fontWeight: 800,
          }}
        >
          AGRO
        </span>
        <span
          className="sathi-part"
          style={{
            color: sathiColor,
            marginLeft: "5px",
            transition: "color 0.15s ease",
            fontWeight: 800,
          }}
        >
          SATHI
        </span>
      </div>

      {showTagline && (
        <span
          className="agro-sathi-brand-tagline"
          style={{
            fontSize: current.taglineSize,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: taglineColor,
            marginTop: "1px",
            textTransform: "uppercase",
            transition: "color 0.15s ease",
          }}
        >
          Kisan Companion
        </span>
      )}
    </div>
  );

  const containerStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: current.gap,
    textDecoration: "none",
    cursor: asLink ? "pointer" : "default",
    userSelect: "none",
  };

  const combinedClass = `${inverted ? "agro-sathi-inverted" : ""} ${className}`.trim();

  if (asLink) {
    return (
      <Link
        href={href}
        className={`agro-sathi-logo-link ${combinedClass}`}
        style={containerStyle}
        aria-label="Agro Sathi - Home"
        onClick={onClick}
      >
        {LogoIcon}
        {LogoText}
      </Link>
    );
  }

  return (
    <div
      className={`agro-sathi-logo-static ${combinedClass}`}
      style={containerStyle}
      onClick={onClick}
    >
      {LogoIcon}
      {LogoText}
    </div>
  );
}
