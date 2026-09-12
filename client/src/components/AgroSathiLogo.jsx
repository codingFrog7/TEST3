import React from "react";
import { Link } from "wouter";

/**
 * AgroSathiLogo - Official Brand Logo for Agro Sathi
 * Features an elegant botanical sprout emblem with vibrant emerald & spring green dual leaves,
 * morning vitality sun accent, and crisp, modern typography.
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
        background: inverted
          ? "linear-gradient(135deg, #13391f 0%, #0c2414 100%)"
          : "#bce681",
        border: inverted
          ? "1px solid rgba(188, 230, 129, 0.35)"
          : "1px solid rgba(35, 83, 48, 0.18)",
        boxShadow: inverted
          ? "0 2px 10px rgba(0, 0, 0, 0.45)"
          : "0 2px 8px rgba(35, 83, 48, 0.18)",
        padding: "3px",
        transition:
          "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 800 800"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <g fill={inverted ? "#bce681" : "#235330"}>
          {/* Wheat Stalk Curved Stem */}
          <path d="M 538,388 C 514,324 476,242 422,148 C 418,142 424,138 428,143 C 486,238 526,322 554,394 Z" />

          {/* Leaping Hare Silhouette with Circular Tool Jaw & Rear Spur */}
          <path d="M 542,390 C 552,394 572,432 598,478 C 606,492 597,504 582,498 C 560,488 546,462 542,442 C 540,460 556,514 562,566 C 567,608 558,638 542,638 C 526,638 506,618 494,582 C 470,518 436,460 416,448 C 398,436 348,468 268,518 C 196,558 132,550 120,518 C 110,492 124,458 152,450 C 188,438 248,468 296,462 C 336,458 368,418 368,374 C 368,330 336,290 292,290 C 260,290 236,306 216,330 C 196,354 172,346 176,322 C 184,282 232,246 296,242 C 372,238 462,266 542,390 Z" />

          {/* 10 Wheat Grains */}
          {/* Terminal Top Grain */}
          <path d="M 436.1,154.1 C 412.0,158.6 394.0,142.3 395.9,117.9 C 420.0,113.4 438.0,129.7 436.1,154.1 Z" />
          {/* Left Grain 1 */}
          <path d="M 425.1,205.2 C 399.6,207.0 382.4,188.0 386.9,162.8 C 412.4,161.0 429.6,180.0 425.1,205.2 Z" />
          {/* Left Grain 2 */}
          <path d="M 445.1,259.3 C 417.8,257.5 402.4,234.7 410.9,208.7 C 438.2,210.5 453.6,233.3 445.1,259.3 Z" />
          {/* Left Grain 3 */}
          <path d="M 470.8,314.0 C 442.1,308.5 428.8,282.4 441.2,256.0 C 469.9,261.5 483.2,287.6 470.8,314.0 Z" />
          {/* Left Grain 4 */}
          <path d="M 501.6,369.9 C 472.9,360.5 462.4,331.7 478.4,306.1 C 507.1,315.5 517.6,344.3 501.6,369.9 Z" />
          {/* Left Grain 5 */}
          <path d="M 534.5,426.0 C 506.1,413.2 498.4,382.6 517.5,358.0 C 545.9,370.8 553.6,401.4 534.5,426.0 Z" />
          {/* Right Grain 1 */}
          <path d="M 482.9,160.3 C 488.9,184.2 473.7,203.7 449.1,203.7 C 443.1,179.8 458.3,160.3 482.9,160.3 Z" />
          {/* Right Grain 2 */}
          <path d="M 513.6,207.0 C 522.7,231.8 508.7,254.3 482.4,257.0 C 473.3,232.2 487.3,209.7 513.6,207.0 Z" />
          {/* Right Grain 3 */}
          <path d="M 545.8,256.7 C 558.3,282.0 545.8,307.5 518.2,313.3 C 505.7,288.0 518.2,262.5 545.8,256.7 Z" />
          {/* Right Grain 4 */}
          <path d="M 577.3,309.0 C 592.7,333.9 582.6,361.8 554.7,371.0 C 539.3,346.1 549.4,318.2 577.3,309.0 Z" />
        </g>
      </svg>
    </div>
  );

  const LogoText = (
    <div
      className="agro-sathi-brand-typography"
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
          letterSpacing: "-0.025em",
        }}
      >
        <span
          style={{
            color: inverted ? "#ffffff" : "var(--foreground, #0f172a)",
            transition: "color 0.15s ease",
          }}
        >
          Agro
        </span>
        <span
          style={{
            color: inverted ? "#34d399" : "#10b981",
            marginLeft: "2px",
            transition: "color 0.15s ease",
          }}
        >
          Sathi
        </span>
      </div>

      {showTagline && (
        <span
          className="agro-sathi-brand-tagline"
          style={{
            fontSize: current.taglineSize,
            fontWeight: 600,
            letterSpacing: "0.03em",
            color: inverted ? "#94a3b8" : "var(--muted-foreground, #64748b)",
            marginTop: "1px",
            textTransform: "uppercase",
          }}
        >
          Kisan AI Companion
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

  if (asLink) {
    return (
      <Link
        href={href}
        className={`agro-sathi-logo-link ${className}`}
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
      className={`agro-sathi-logo-static ${className}`}
      style={containerStyle}
      onClick={onClick}
    >
      {LogoIcon}
      {LogoText}
    </div>
  );
}
