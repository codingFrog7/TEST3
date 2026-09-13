import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CloudRain,
  CloudSun,
  Droplets,
  ExternalLink,
  FlaskConical,
  ImageUp,
  Leaf,
  Lightbulb,
  Mic,
  Navigation,
  Phone,
  RotateCcw,
  ScanLine,
  Search,
  ShieldCheck,
  Sprout,
  Sun,
  ThermometerSun,
  UploadCloud,
  Wind,
  X,
  Heart,
  MoreVertical,
  Send,
  Minus,
  Plus,
  User,
  Home as HomeIcon,
  ChevronLeft,
  Sparkles,
  Volume2,
  VolumeX,
  Printer,
  BookmarkCheck,
  History,
  AlertTriangle,
  FileText,
  Video,
  VideoOff,
  Copy,
  Cloud,
  LogIn,
  LogOut,
  Trash2,
  Database,
  TrendingUp,
  Coins,
} from "lucide-react";

import { useFirebase } from "../context/FirebaseContext.jsx";
import {
  advisoryCards,
  crops,
  weatherDays,
  weatherScenarios,
} from "../data/siteContent.js";
import ThemeToggle from "../components/ThemeToggle.jsx";
import WeatherAlertBar from "../components/WeatherAlertBar.jsx";
import CropCard from "../components/CropCard.jsx";
import AgroLoader from "../components/AgroLoader.jsx";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import QuickAuthModal from "../components/QuickAuthModal.jsx";
import MandiPriceTracker from "../components/MandiPriceTracker.jsx";
import YieldTrendDashboard from "../components/YieldTrendDashboard.jsx";
import AuthPage from "./AuthPage.jsx";
import UserPage from "./UserPage.jsx";
import DetectPage from "./DetectPage.jsx";
import AgroSathiLogo from "../components/AgroSathiLogo.jsx";

function pageFromPath(path) {
  if (path.startsWith("/login")) return "login";
  if (path.startsWith("/signup")) return "signup";
  if (path.startsWith("/user") || path.startsWith("/profile")) return "user";
  if (path.startsWith("/detect")) return "detect";
  if (path.startsWith("/mandi")) return "mandi";
  if (path.startsWith("/guides")) return "guides";
  if (path.startsWith("/weather")) return "weather";
  if (path.startsWith("/advisory")) return "advisory";
  if (path.startsWith("/about")) return "about";
  return "home";
}

function Logo({ compact = false, inverted = false }) {
  return (
    <AgroSathiLogo
      compact={compact}
      size={compact ? "sm" : "md"}
      inverted={inverted}
    />
  );
}

function Header({ page }) {
  const {
    user,
    signInWithGoogle,
    signOut,
    syncStatus,
    scoutRecords,
    fieldNotes,
    farmerProfile,
  } = useFirebase();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [quickAuthOpen, setQuickAuthOpen] = useState(false);
  const [quickAuthMode, setQuickAuthMode] = useState("login");
  const [, navigate] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`site-clean-fixed-header ${isScrolled ? "is-scrolled" : ""}`}
        role="banner"
      >
        <div className="site-navbar-container">
          {/* Left: Brand */}
          <div className="site-nav-left">
            <AgroSathiLogo size="sm" />
          </div>

          {/* Center: Desktop Navigation Links (Clean Segmented Nav) */}
          <nav
            className="site-nav-links-cluster"
            aria-label="Desktop Navigation"
          >
            <Link
              href="/"
              className={`site-nav-item-pill ${page === "home" ? "active" : ""}`}
            >
              <span>Home</span>
              {page === "home" && <span className="site-nav-active-dot" />}
            </Link>
            <Link
              href="/detect"
              className={`site-nav-item-pill ${page === "detect" ? "active" : ""}`}
            >
              <span>AI Crop Doctor</span>
              {page === "detect" && <span className="site-nav-active-dot" />}
            </Link>
            <Link
              href="/mandi"
              className={`site-nav-item-pill ${page === "mandi" ? "active" : ""}`}
            >
              <span>Mandi Bhav</span>
              {page === "mandi" && <span className="site-nav-active-dot" />}
            </Link>
            <Link
              href="/weather"
              className={`site-nav-item-pill ${page === "weather" ? "active" : ""}`}
            >
              <span>Weather Desk</span>
              {page === "weather" && <span className="site-nav-active-dot" />}
            </Link>
          </nav>

          {/* Right Action Group: Theme Toggle, Sign In & Farmer Profile Dropdown */}
          <div className="site-nav-right">
            <ThemeToggle />

            {!user ? (
              <button
                type="button"
                onClick={() => {
                  setQuickAuthMode("login");
                  setQuickAuthOpen(true);
                }}
                className="site-nav-signin-cta"
                id="nav-signin-btn"
                title="Sign In to your Farmer Account"
              >
                <LogIn size={15} strokeWidth={2.2} />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="profile-dropdown-anchor-wrapper">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(prev => !prev)}
                  className="profile-avatar-btn logged-in"
                  title={`Farmer Account (${user.displayName || user.email}) - Click for menu`}
                  aria-label="Farmer profile menu"
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                  id="nav-profile-menu-trigger"
                >
                  <div className="profile-avatar-circle">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "Farmer"}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="profile-avatar-circle fallback">
                        {(farmerProfile?.displayName ||
                          user.displayName ||
                          user.email ||
                          "K")[0].toUpperCase()}
                      </div>
                    )}
                    <span className="avatar-active-dot" />
                  </div>
                  <span className="profile-avatar-name hidden sm:inline">
                    {user.displayName?.split(" ")[0] ||
                      farmerProfile?.displayName?.split(" ")[0] ||
                      "Farmer"}
                  </span>
                  <ChevronDown
                    size={13}
                    className="text-muted-foreground ml-0.5"
                  />
                </button>

                {/* Farmer Profile Dropdown Menu */}
                <ProfileDropdown
                  isOpen={profileDropdownOpen}
                  onClose={() => setProfileDropdownOpen(false)}
                  onOpenQuickAuth={mode => {
                    setQuickAuthMode(mode || "login");
                    setQuickAuthOpen(true);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Authentication Modal (Sign In / Register / Google 1-Click) */}
      <QuickAuthModal
        isOpen={quickAuthOpen}
        onClose={() => setQuickAuthOpen(false)}
        initialMode={quickAuthMode}
      />
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-inner-container">
        <div className="footer-main-grid">
          {/* Brand & Kisan Helpline Column */}
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <AgroSathiLogo size="md" inverted={true} />
            </div>
            <p className="footer-mission-text">
              Real-time crop disease diagnosis, precision agromet advisories,
              and live mandi market prices for Indian farmers.
            </p>
            <div className="footer-helpline-card">
              <div className="footer-helpline-badge">
                <Phone size={13} className="text-emerald-400" />
                <span>Kisan Call Centre (Govt. of India)</span>
              </div>
              <a
                href="tel:18001801551"
                className="footer-helpline-phone"
                id="footer-kisan-helpline-link"
              >
                1800-180-1551
              </a>
              <span className="footer-helpline-hours">
                Toll-Free Helpline · 6:00 AM – 10:00 PM Daily
              </span>
            </div>
          </div>

          {/* Navigation Column 1: Agronomy Services */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Farming Services</h4>
            <ul className="footer-col-links">
              <li>
                <Link href="/detect">Crop Disease Doctor</Link>
              </li>
              <li>
                <Link href="/mandi">Mandi Bhav Today</Link>
              </li>
              <li>
                <Link href="/weather">Weather & Spray Desk</Link>
              </li>
              <li>
                <Link href="/detect">AI Instant Diagnosis</Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Portals & Help */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Farmer Portals</h4>
            <ul className="footer-col-links">
              <li>
                <Link href="/user">My Field Diary</Link>
              </li>
              <li>
                <Link href="/about">About AGRO SATHI</Link>
              </li>
              <li>
                <a
                  href="https://mausam.imd.gov.in/responsive/agromet_adv_ser_state_current.php"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-external-link"
                >
                  IMD Agromet Weather <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://enam.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-external-link"
                >
                  e-NAM Mandi Portal <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Clean, Simple Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright-wrap">
            <span>© 2026 AGRO SATHI · Dedicated to Indian Farmers</span>
          </div>

          <div className="footer-disclaimer-wrap">
            <span>
              Advisory is for guidance. Follow local Krishi Vigyan Kendra (KVK)
              advice for chemical spraying.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PageIntro({ eyebrow, title, body, children }) {
  return (
    <section className="page-intro">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
      {children}
    </section>
  );
}

function BentoCameraSvg() {
  return (
    <svg
      viewBox="0 0 200 160"
      className="bento-camera-svg"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DSLR Leaf Camera"
    >
      <ellipse
        cx="100"
        cy="146"
        rx="74"
        ry="10"
        fill="rgba(35, 25, 5, 0.2)"
        filter="blur(6px)"
      />
      <rect x="22" y="38" width="156" height="100" rx="20" fill="#1b1d20" />
      <rect x="26" y="42" width="148" height="92" rx="16" fill="#24282c" />
      <path
        d="M26 50 C26 44, 30 42, 38 42 L60 42 L56 134 L38 134 C30 134, 26 130, 26 124 Z"
        fill="#151719"
      />
      <rect x="56" y="42" width="3" height="92" fill="#dc2626" />
      <path d="M68 38 L84 20 L116 20 L132 38 Z" fill="#1e2226" />
      <rect x="88" y="24" width="24" height="12" rx="3" fill="#121416" />
      <rect x="36" y="30" width="20" height="8" rx="2" fill="#3a3f45" />
      <rect x="144" y="28" width="22" height="10" rx="3" fill="#3a3f45" />
      <circle cx="155" cy="33" r="3" fill="#dc2626" />
      <circle cx="48" cy="56" r="5" fill="#dc2626" />
      <circle
        cx="112"
        cy="88"
        r="46"
        fill="#151719"
        stroke="#33383f"
        strokeWidth="4"
      />
      <circle cx="112" cy="88" r="38" fill="#0f1113" />
      <circle cx="112" cy="88" r="30" fill="url(#cameraLensGrad)" />
      <circle
        cx="112"
        cy="88"
        r="22"
        stroke="#22c55e"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      <circle cx="112" cy="88" r="10" stroke="#4ade80" strokeWidth="1.5" />
      <circle cx="112" cy="88" r="3" fill="#4ade80" />
      <line
        x1="84"
        y1="88"
        x2="94"
        y2="88"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="130"
        y1="88"
        x2="140"
        y2="88"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="112"
        y1="60"
        x2="112"
        y2="70"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="112"
        y1="106"
        x2="112"
        y2="116"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse
        cx="102"
        cy="76"
        rx="9"
        ry="5"
        transform="rotate(-30 102 76)"
        fill="#ffffff"
        fillOpacity="0.28"
      />
      <ellipse
        cx="124"
        cy="98"
        rx="5"
        ry="3"
        transform="rotate(-30 124 98)"
        fill="#ffffff"
        fillOpacity="0.18"
      />
      <defs>
        <radialGradient id="cameraLensGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1e3a2f" />
          <stop offset="60%" stopColor="#0d2417" />
          <stop offset="100%" stopColor="#05120a" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function BentoMandiSvg() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="bento-mandi-visual"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="APMC Mandi Bhav Grains"
    >
      <ellipse
        cx="60"
        cy="110"
        rx="44"
        ry="7"
        fill="rgba(30, 41, 59, 0.2)"
        filter="blur(4px)"
      />
      <path
        d="M32 46 C30 76, 26 96, 36 104 C46 112, 74 112, 84 104 C94 96, 90 76, 88 46 C88 40, 84 36, 76 34 L78 26 C78 22, 68 20, 60 20 C52 20, 42 22, 42 26 L44 34 C36 36, 32 40, 32 46 Z"
        fill="#94a3b8"
      />
      <path
        d="M36 50 C34 76, 30 94, 38 102 C46 110, 74 110, 82 102 C90 94, 86 76, 84 50 Z"
        fill="#64748b"
      />
      <ellipse cx="60" cy="34" rx="18" ry="4" fill="#475569" />
      <path
        d="M58 35 L54 44 M62 35 L66 44"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="60"
        cy="74"
        r="16"
        fill="#f8fafc"
        stroke="#3b82f6"
        strokeWidth="2"
      />
      <text
        x="60"
        y="79"
        fill="#1e3a8a"
        fontSize="13"
        fontWeight="900"
        textAnchor="middle"
      >
        ₹
      </text>
    </svg>
  );
}

function BentoWeatherSvg() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="bento-weather-visual"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Weather Agromet Instrument"
    >
      <ellipse
        cx="60"
        cy="110"
        rx="42"
        ry="7"
        fill="rgba(28, 86, 61, 0.18)"
        filter="blur(4px)"
      />
      <circle cx="70" cy="46" r="22" fill="#fbbf24" />
      <path
        d="M70 18 L70 12 M92 24 L96 20 M100 46 L106 46 M92 68 L96 72"
        stroke="#f59e0b"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M34 84 L76 84 C84 84, 90 78, 90 70 C90 63, 85 57, 78 56 C76 46, 68 40, 58 40 C50 40, 42 45, 40 52 C32 53, 26 59, 26 68 C26 77, 32 84, 34 84 Z"
        fill="#ffffff"
      />
      <rect x="36" y="92" width="48" height="14" rx="7" fill="#15803d" />
      <circle cx="44" cy="99" r="3" fill="#86efac" />
      <text
        x="64"
        y="102"
        fill="#ffffff"
        fontSize="8"
        fontWeight="800"
        textAnchor="middle"
      >
        SPRAY OK
      </text>
    </svg>
  );
}

function HomePage() {
  const [, navigate] = useLocation();
  const heroCameraRef = useRef(null);
  const heroGalleryRef = useRef(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [severityLevel, setSeverityLevel] = useState(1);
  const [isHeartActive, setIsHeartActive] = useState(false);
  const [fieldNote, setFieldNote] = useState("");
  const [noteSent, setNoteSent] = useState(false);
  const { user, addFieldNote } = useFirebase();

  const handleHeroFile = file => {
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
        console.warn(e);
      }
      navigate("/detect");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const handleCloseSheet = () => setShowDetailSheet(false);
    window.addEventListener("agro-close-sheet", handleCloseSheet);
    return () =>
      window.removeEventListener("agro-close-sheet", handleCloseSheet);
  }, []);

  const openCameraMenu = () => {
    heroCameraRef.current?.click();
  };

  const scrollToModules = () => {
    const elem = document.getElementById("agro-modules");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendNote = async e => {
    e.preventDefault();
    if (!fieldNote.trim()) return;
    try {
      if (user) {
        await addFieldNote({
          note: fieldNote.trim(),
          cropTag: "Chilli Teja",
          authorName: user.displayName || "Kisan Farmer",
        });
      }
      setNoteSent(true);
      setTimeout(() => {
        setFieldNote("");
        setNoteSent(false);
      }, 2200);
    } catch (err) {
      console.error("Error saving note to Firebase", err);
    }
  };

  return (
    <main className="haven-home-main-flow">
      {/* Hidden native file inputs for hero one-tap triggers */}
      <input
        ref={heroCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        style={{ display: "none" }}
        onChange={e => {
          handleHeroFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={heroGalleryRef}
        type="file"
        accept="image/*"
        className="sr-only"
        style={{ display: "none" }}
        onChange={e => {
          handleHeroFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {/* ===================================================================
          STREAMLINED HERO SECTION (CLEAN BACKGROUND & MINIMAL COPY)
          =================================================================== */}
      <section className="haven-hero-stage" aria-label="Hero Introduction">
        {/* Background panoramic landscape layer */}
        <div className="haven-hero-bg-layer" aria-hidden="true">
          <img
            src="/images/solarpunk_farm_hero.jpg"
            alt="Futuristic solarpunk agricultural farm landscape in morning light"
            className="haven-hero-bg-image"
            loading="eager"
            onError={e => {
              e.currentTarget.src = "/images/agro_haven_hero.jpg";
            }}
          />
          <div className="haven-hero-gradient-overlay" />
        </div>

        {/* Hero Central Glassmorphic Card & CTAs */}
        <div className="haven-hero-glass-card">
          {/* Subtle Announcement Pill */}
          <div
            className="haven-announcement-badge"
            role="status"
            onClick={scrollToModules}
          >
            <span>🌿 Precision Agronomy</span>
          </div>

          {/* Majestic Hero Display Headline */}
          <h1 className="haven-hero-main-title">
            Farming in <em className="editorial-serif-italic">harmony</em> with
            nature.
          </h1>

          {/* Concise, Single-Line Subtitle */}
          <p className="haven-hero-sub-copy">
            Instant AI crop disease diagnosis and live APMC mandi rates.
          </p>

          {/* Clean Dual Action Buttons */}
          <div className="haven-hero-actions-row">
            <Link
              href="/detect"
              className="haven-cta-button-primary"
              id="hero-scan-leaf-cta"
              title="Launch AI Crop Doctor"
            >
              <Camera size={16} strokeWidth={2.4} />
              <span>Scan Crop</span>
            </Link>

            <Link
              href="/mandi"
              className="haven-cta-button-glass"
              id="hero-mandi-rates-cta"
              title="View live mandi rates"
            >
              <TrendingUp size={16} strokeWidth={2.2} />
              <span>Mandi Rates</span>
            </Link>
          </div>
        </div>

        {/* Minimal Bottom Scroll Indicator */}
        <button
          type="button"
          className="haven-bottom-scroll-pill"
          onClick={scrollToModules}
          aria-label="Scroll to explore features"
          title="Explore features"
        >
          <span>EXPLORE</span>
          <span aria-hidden="true">↓</span>
        </button>
      </section>

      {/* ===================================================================
          BELOW-THE-FOLD INTERACTIVE FIELD ADVISORY MODULES (#agro-modules)
          =================================================================== */}
      <div id="agro-modules" className="haven-modules-section">
        <div className="bento-screen-wrap page-width">
          {/* RENDER DETAIL SHEET (MATCHING SCREEN 2 IN REFERENCE PHOTO) */}
          {showDetailSheet ? (
            <section className="bento-detail-screen">
              {/* Top navigation row */}
              <div className="detail-top-nav-bar">
                <button
                  type="button"
                  className="detail-nav-icon-btn"
                  onClick={() => setShowDetailSheet(false)}
                  aria-label="Back to Bento Grid"
                >
                  <ChevronLeft size={24} />
                </button>
                <span className="detail-header-badge">
                  Leaf Pathology Assessment
                </span>
                <button
                  type="button"
                  className="detail-nav-icon-btn"
                  onClick={() => setShowDetailSheet(false)}
                  aria-label="Close sheet"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="detail-responsive-container">
                {/* Hero Scanned Leaf Product Stage */}
                <div className="detail-hero-stage">
                  <img
                    src="https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=600&q=80"
                    alt="Chilli Leaf Curl Sample"
                    className="detail-hero-leaf-img"
                  />
                  <div className="detail-stage-overlay-badge">
                    <Sparkles size={13} />
                    <span>AI Confidence 94.8% · Chilli Teja</span>
                  </div>
                </div>

                {/* Curved sheet with floating circular heart button */}
                <div className="detail-sheet-card">
                  <button
                    type="button"
                    className={`detail-heart-float-btn ${isHeartActive ? "is-active" : ""}`}
                    onClick={() => setIsHeartActive(!isHeartActive)}
                    aria-label="Save advisory to favourites"
                    title="Save advisory"
                  >
                    <Heart
                      size={22}
                      fill={isHeartActive ? "currentColor" : "none"}
                    />
                  </button>

                  <div className="detail-title-row">
                    <h2 className="detail-crop-title">
                      Chilli Leaf Curl (Gemini)
                    </h2>
                  </div>

                  {/* Stepper and price row */}
                  <div className="detail-stepper-price-row">
                    <div className="detail-stepper">
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() =>
                          setSeverityLevel(Math.max(1, severityLevel - 1))
                        }
                        aria-label="Decrease severity stage"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="stepper-val">{severityLevel}</span>
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() =>
                          setSeverityLevel(Math.min(5, severityLevel + 1))
                        }
                        aria-label="Increase severity stage"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="detail-price-text">
                      {severityLevel === 1
                        ? "₹12.50"
                        : severityLevel === 2
                          ? "₹24.00"
                          : severityLevel === 3
                            ? "₹36.50"
                            : "₹48.00"}
                    </div>
                  </div>

                  {/* Description copy */}
                  <p className="detail-desc-copy">
                    Severe upward leaf curling and stunted canopy growth
                    transmitted by whiteflies (Bemisia tabaci). Recommended
                    spray: Neem oil 3000 ppm @ 5ml/L water or acetamiprid 20SP.
                  </p>

                  {/* Reviews / Verified Agronomists Pile */}
                  <div className="detail-reviews-row">
                    <div className="avatar-pile">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                        alt="Agronomist 1"
                        className="pile-img"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                        alt="Agronomist 2"
                        className="pile-img"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                        alt="Agronomist 3"
                        className="pile-img"
                      />
                    </div>
                    <span className="reviews-label">Agronomists (55)</span>
                  </div>

                  {/* Field Note / Message input */}
                  <form
                    onSubmit={handleSendNote}
                    className="detail-message-box"
                  >
                    <input
                      type="text"
                      placeholder={
                        noteSent
                          ? "✓ Field note recorded!"
                          : "Add field observation notes..."
                      }
                      value={fieldNote}
                      onChange={e => setFieldNote(e.target.value)}
                      className="detail-input-field"
                    />
                    <button
                      type="submit"
                      className="detail-send-icon-btn"
                      aria-label="Send field note"
                    >
                      <Send size={16} />
                    </button>
                  </form>

                  {/* Docked dark pill button */}
                  <div className="detail-docked-action-wrap">
                    <button
                      type="button"
                      className="detail-docked-action-btn"
                      onClick={() => {
                        sessionStorage.setItem(
                          "agro_pending_scan",
                          "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=600&q=80"
                        );
                        sessionStorage.setItem(
                          "agro_pending_scan_name",
                          "Chilli Leaf Sample"
                        );
                        navigate("/detect");
                      }}
                    >
                      <Camera size={18} />
                      <span>Start Leaf Diagnosis</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            /* RENDER BENTO GRID MODULES */
            <section className="bento-overview-section">
              {/* Header Typography */}
              <div className="bento-hero-header">
                <h2 className="bento-main-title">Smart Kisan Services</h2>
                <p className="bento-sub-title">
                  Instant crop diagnosis, live APMC mandi rates &amp; 5-day
                  weather desk
                </p>
              </div>

              {/* Bento Grid 2x2 Layout */}
              <div className="bento-cards-grid">
                {/* CARD 1: Large Vertical Card (AI Leaf Camera) */}
                <div
                  className="bento-card-camera"
                  onClick={() => heroCameraRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === "Enter") heroCameraRef.current?.click();
                  }}
                  title="Open camera to scan plant leaf"
                >
                  <span className="bento-tag-badge">AI Leaf Camera</span>

                  <div className="bento-camera-visual">
                    <BentoCameraSvg />
                  </div>

                  <div className="bento-camera-footer">
                    <h3 className="bento-camera-title">Scan Plant Leaf</h3>
                    <p className="bento-camera-sub">
                      Instant diagnosis for fungal spots, pests &amp; curl
                    </p>
                    <button
                      type="button"
                      className="bento-pill-action"
                      onClick={e => {
                        e.stopPropagation();
                        openCameraMenu();
                      }}
                      id="bento-tap-to-scan-btn"
                    >
                      <Camera size={16} strokeWidth={2.4} />
                      <span>Tap to Scan</span>
                    </button>
                  </div>
                </div>

                {/* CARD 2: Mandi Bhav Card */}
                <Link
                  href="/mandi"
                  className="bento-card-mandi"
                  title="Live Mandi Bhav APMC Rates"
                >
                  <div className="bento-mandi-visual-wrap">
                    <BentoMandiSvg />
                  </div>
                  <div>
                    <h3 className="bento-mandi-label">Mandi Bhav</h3>
                    <div className="bento-mandi-rate">Cotton ₹7,320 / qtl</div>
                    <span className="mandi-badge-up">+₹220 vs MSP</span>
                  </div>
                </Link>

                {/* CARD 3: Weather Desk Card */}
                <Link
                  href="/weather"
                  className="bento-card-weather"
                  title="5-Day Weather & Spray Window"
                >
                  <div className="bento-weather-visual-wrap">
                    <BentoWeatherSvg />
                  </div>
                  <div>
                    <h3 className="bento-weather-label">Weather Desk</h3>
                    <div className="bento-weather-stat">31°C · Clear Sky</div>
                    <span className="weather-badge-safe">
                      Spray Window Open
                    </span>
                  </div>
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function MandiPage() {
  return (
    <main className="page-width page-shell">
      <PageIntro
        eyebrow="APMC Market Intelligence"
        title="Live Mandi Rates & Lot Profit Calculator"
        body="Daily APMC market yard commodity prices, minimum support price (MSP) benchmarks, arrival volumes, and interactive lot profit estimates for Telangana and regional farmers."
      >
        <div className="guide-count">
          <span className="guide-count-number">4</span>
          <span>
            Market Yards
            <br />
            <small>Updated 09:30 AM</small>
          </span>
        </div>
      </PageIntro>

      {/* Dedicated Mandi Price Tracker Component */}
      <MandiPriceTracker />

      <section className="help-banner" style={{ marginTop: "32px" }}>
        <div className="help-banner-icon">
          <Coins size={20} />
        </div>
        <div>
          <span className="eyebrow">Fair Trade Tip</span>
          <h2>Always verify official APMC weighment slips.</h2>
          <p>
            Ensure your lot is graded and weighed at certified APMC electronic
            weighing bridges before finalizing trader transactions.
          </p>
        </div>
        <a
          href="https://enam.gov.in"
          target="_blank"
          rel="noreferrer"
          className="button button-outline"
        >
          National e-NAM Portal <ExternalLink size={14} />
        </a>
      </section>
    </main>
  );
}

function GuidesPage() {
  const [query, setQuery] = useState("");
  const [season, setSeason] = useState("All");
  const filtered = useMemo(
    () =>
      crops.filter(crop => {
        const matchesSearch = `${crop.name} ${crop.local}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesSeason =
          season === "All" || crop.season.startsWith(season);
        return matchesSearch && matchesSeason;
      }),
    [query, season]
  );
  return (
    <main className="page-width page-shell">
      <PageIntro
        eyebrow="Crop guides"
        title="A field guide that speaks plainly."
        body="Start with the crop, then match what you see. These short guides focus on observation, field hygiene and knowing when to ask for local help."
      >
        <div className="guide-count">
          <span className="guide-count-number">{crops.length}</span>
          <span>
            starter guides
            <br />
            <small>More being added</small>
          </span>
        </div>
      </PageIntro>
      <div className="guide-toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search a crop…"
            aria-label="Search crops"
          />
        </div>
        <div className="guide-filters">
          {["All", "Kharif", "Rabi"].map(filter => (
            <button
              key={filter}
              className={`filter-button ${season === filter ? "active" : ""}`}
              onClick={() => setSeason(filter)}
              aria-pressed={season === filter}
            >
              {filter === "All" ? "All crops" : filter}
            </button>
          ))}
        </div>
      </div>
      <div className="guides-grid">
        {filtered.map(crop => (
          <CropCard crop={crop} key={crop.name} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <Search size={22} />
          <h3>No guide yet</h3>
          <p>Try another crop name or send us a suggestion.</p>
        </div>
      )}
      <div className="guide-notice">
        <div>
          <ShieldCheck size={20} />
          <div>
            <b>Use the guide as a conversation starter.</b>
            <p>
              Symptoms can overlap. Take the photo, note where it appears in the
              field, and share those details with a local extension officer.
            </p>
          </div>
        </div>
        <Link href="/about" className="text-link">
          Why this matters <ChevronRight size={16} />
        </Link>
      </div>
    </main>
  );
}

function WeatherPage() {
  const [state, setState] = useState("Telangana");
  const [scenarioId, setScenarioId] = useState("forecast");
  const currentDays = weatherScenarios[scenarioId]?.days || weatherDays;
  const todayWeather = currentDays[0] || weatherDays[0];

  return (
    <main className="page-width page-shell">
      <PageIntro
        eyebrow="Weather desk"
        title="The next five days, in field language."
        body="Use the forecast to decide when to irrigate, scout, weed or wait. The numbers below are a clear demo view; always check your local IMD bulletin before a high-stakes decision."
      >
        <div className="location-picker">
          <MapPinIcon />
          <span>
            <small>YOUR REGION</small>
            <b>Karimnagar, {state}</b>
          </span>
          <ChevronDown size={15} />
        </div>
      </PageIntro>

      {/* Dynamic Extreme Weather Alert Bar */}
      <WeatherAlertBar
        days={currentDays}
        onScenarioChange={setScenarioId}
        activeScenarioId={scenarioId}
      />

      <div className="weather-controls">
        <label>
          State{" "}
          <select value={state} onChange={e => setState(e.target.value)}>
            <option>Telangana</option>
            <option>Maharashtra</option>
            <option>Karnataka</option>
            <option>Andhra Pradesh</option>
          </select>
        </label>
        <a
          className="source-link dark"
          href="https://mausam.imd.gov.in/responsive/agromet_adv_ser_state_current.php"
          target="_blank"
          rel="noreferrer"
        >
          Open IMD agromet bulletins <ExternalLink size={12} />
        </a>
      </div>
      <section className="weather-hero-card">
        <div className="current-weather">
          <span className="muted-label">TUESDAY, 08 SEPTEMBER</span>
          <div className="temperature-row">
            {todayWeather.icon ? (
              <todayWeather.icon size={45} strokeWidth={1.5} />
            ) : (
              <Sun size={45} strokeWidth={1.5} />
            )}
            <strong>{todayWeather.high}</strong>
            <span>
              Low: {todayWeather.low}
              <br />
              <small>{todayWeather.label}</small>
            </span>
          </div>
          <div className="current-weather-stats">
            <span>
              <Droplets size={15} /> {todayWeather.humidity || "58%"} humidity
            </span>
            <span>
              <Wind size={15} /> {todayWeather.wind || "12 km/h"} wind
            </span>
            <span>
              <ThermometerSun size={15} /> Rain prob: {todayWeather.rain}
            </span>
          </div>
        </div>
        <div className="field-callout">
          <span className="callout-tag">
            <Lightbulb size={13} /> TODAY'S FIELD NOTE
          </span>
          <h3>
            {parseInt(todayWeather.rain, 10) >= 50
              ? "Rain incoming — pause foliar feeding."
              : parseInt(todayWeather.low, 10) <= 8
                ? "Frost risk tonight — irrigate lightly."
                : "Good window for scouting and weeding."}
          </h3>
          <p>
            {parseInt(todayWeather.rain, 10) >= 50
              ? "Ensure drainage lines are open. Postpone pesticide sprays until leaves can dry thoroughly."
              : parseInt(todayWeather.low, 10) <= 8
                ? "Low night temperatures slow crop metabolism. Evening furrow watering radiates protective ground warmth."
                : "Keep foliar sprays for a dry, calm period. If rain arrives early, protect freshly worked soil from runoff."}
          </p>
          <Link href="/advisory" className="text-link">
            See weather-linked advice <ChevronRight size={16} />
          </Link>
        </div>
      </section>
      <section className="forecast-section">
        <div className="section-heading compact">
          <div>
            <span className="eyebrow">Forecast</span>
            <h2>Plan the week</h2>
          </div>
          <span className="updated-label">
            <span /> Updated a few minutes ago
          </span>
        </div>
        <div className="forecast-large">
          {currentDays.map(
            ({ day, icon: Icon, high, low, rain, label }, index) => {
              const rainVal = parseInt(rain, 10) || 0;
              const lowVal = parseInt(low, 10) || 20;
              return (
                <div
                  className={`forecast-large-day ${index === 0 ? "today" : ""} ${rainVal >= 50 ? "has-rain-alert" : ""
                    } ${lowVal <= 8 ? "has-frost-alert" : ""}`}
                  key={day}
                >
                  <span className="forecast-large-day-name">{day}</span>
                  <Icon size={30} strokeWidth={1.6} />
                  <strong>
                    {high}
                    <small>{low}</small>
                  </strong>
                  <span className="rain-prob">
                    <Droplets size={12} /> {rain}
                  </span>
                  <small>{label}</small>
                  {rainVal >= 50 && (
                    <span className="rain-note">Heavy rain</span>
                  )}
                  {lowVal <= 8 && (
                    <span className="frost-note">Frost hazard</span>
                  )}
                </div>
              );
            }
          )}
        </div>
      </section>
      <section className="weather-tasks">
        <div className="section-heading compact">
          <div>
            <span className="eyebrow">Match the work</span>
            <h2>Simple timing helps</h2>
          </div>
        </div>
        <div className="task-grid">
          <TaskCard
            icon={Sprout}
            title="Scout"
            when="Today · morning"
            text="Walk the edges and lower leaves first. Note whether symptoms are in patches or spread evenly."
            good
          />
          <TaskCard
            icon={CloudRain}
            title="Hold off spraying"
            when="Wednesday"
            text="Rain is more likely. Wait for a dry window and read the label before any treatment."
          />
          <TaskCard
            icon={Droplets}
            title="Irrigate thoughtfully"
            when="Friday"
            text="Check soil moisture with your hand before adding water. Avoid standing water around roots."
          />
        </div>
      </section>
    </main>
  );
}

function MapPinIcon() {
  return (
    <span className="location-icon">
      <Navigation size={16} />
    </span>
  );
}
function TaskCard({ icon: Icon, title, when, text, good = false }) {
  return (
    <div className="task-card">
      <span className={`task-icon ${good ? "good" : ""}`}>
        <Icon size={18} />
      </span>
      <span className="task-when">{when}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function AdvisoryPage() {
  const [active, setActive] = useState("All");
  const filters = ["All", "Crop care", "Weather", "Safer use"];
  const cards =
    active === "All"
      ? advisoryCards
      : advisoryCards.filter(card =>
        active === "Weather"
          ? card.tag === "WEATHER"
          : active === "Crop care"
            ? card.tag === "CHILLI"
            : card.tag === "ALL CROPS"
      );
  return (
    <main className="page-width page-shell">
      <PageIntro
        eyebrow="Advisory desk"
        title="Small notes for big decisions."
        body="Practical reminders for crop care, weather windows and safer pest management. Save what is useful and share it with the person who works your field."
      >
        <Link href="/detect" className="intro-button">
          <Mic size={17} />
          <span>
            <b>Ask with a photo</b>
            <small>Start from what you see</small>
          </span>
          <ArrowRight size={16} />
        </Link>
      </PageIntro>

      <div className="advisory-layout">
        <section>
          <div className="filter-tabs" role="tablist">
            {filters.map(filter => (
              <button
                key={filter}
                className={active === filter ? "active" : ""}
                onClick={() => setActive(filter)}
                role="tab"
                aria-selected={active === filter}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="advisory-list">
            {cards.map(card => (
              <article className="advisory-card" key={card.title}>
                <div className={`advisory-card-visual ${card.color}`}>
                  <span>{card.tag}</span>
                  <div className="visual-scribble">
                    {card.color === "green" ? (
                      <Leaf size={52} />
                    ) : card.color === "blue" ? (
                      <CloudRain size={54} />
                    ) : (
                      <ShieldCheck size={52} />
                    )}
                  </div>
                </div>
                <div className="advisory-card-copy">
                  <span className="read-time">{card.time}</span>
                  <h2>{card.title}</h2>
                  <p>{card.body}</p>
                  <span className="text-link">
                    Read note <ArrowRight size={15} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
        <aside className="ipm-card">
          <span className="aside-icon">
            <FlaskConical size={18} />
          </span>
          <span className="eyebrow">A better order of operations</span>
          <h2>Scout → identify → act</h2>
          <p>
            Integrated Pest Management means combining crop, physical,
            biological and chemical options — with the least disruption needed.
          </p>
          <div className="ipm-steps">
            <div>
              <span>01</span>
              <b>Scout</b>
              <small>Look for patterns and the pest itself.</small>
            </div>
            <div>
              <span>02</span>
              <b>Identify</b>
              <small>Compare symptoms before choosing a response.</small>
            </div>
            <div>
              <span>03</span>
              <b>Act</b>
              <small>Start with the safest effective step.</small>
            </div>
          </div>
          <a
            href="https://www.fao.org/pest-and-pesticide-management/ipm/integrated-pest-management/en/"
            target="_blank"
            rel="noreferrer"
            className="source-link dark"
          >
            Read FAO’s IPM principles <ExternalLink size={12} />
          </a>
        </aside>
      </div>

      {/* District Harvest Yield Trends & Benchmarks */}
      <section style={{ marginTop: "44px", marginBottom: "40px" }}>
        <YieldTrendDashboard />
      </section>

      <section className="help-banner">
        <div className="help-banner-icon">
          <Phone size={20} />
        </div>
        <div>
          <span className="eyebrow">Need a second opinion?</span>
          <h2>Take your notes to a local agriculture office.</h2>
          <p>
            A photo plus the crop stage, recent weather and where the problem
            appears is more useful than a product name alone.
          </p>
        </div>
        <Link href="/about" className="button button-outline">
          What to share <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="page-width page-shell">
      <PageIntro
        eyebrow="About AGRO SATHI"
        title="Technology should make field decisions feel lighter."
        body="AGRO SATHI is a small, practical web companion for farmers and field teams. It brings a crop photo, local weather context and simple guidance into one calm place."
      >
        <div className="about-mark" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <img
            src="/agro-sathi-icon.png"
            alt="AGRO SATHI"
            style={{ width: "48px", height: "48px", borderRadius: "12px", display: "block" }}
          />
          <span
            className="about-mark-title"
            style={{
              fontSize: "11px",
              fontWeight: "800",
              textAlign: "center",
              letterSpacing: "0.05em",
              color: "var(--foreground, #0f172a)",
            }}
          >
            AGRO SATHI
          </span>
        </div>
      </PageIntro>
      <div className="about-story">
        <div className="story-lead">
          <span className="eyebrow">Our approach</span>
          <h2>Useful beats impressive.</h2>
          <p>
            We designed AGRO SATHI around three moments: noticing something
            different in a crop, deciding what to do today, and knowing when a
            local expert should join the decision.
          </p>
          <p>
            The result is intentionally quiet. No jargon wall. No pressure to
            buy a product. Just a starting point that helps a farmer ask a
            better question.
          </p>
        </div>
        <div className="principle-list">
          <div>
            <span className="principle-number">01</span>
            <div>
              <h3>Start from observation</h3>
              <p>
                A photo is a starting point, not a verdict. Crop guides help
                compare what you see.
              </p>
            </div>
          </div>
          <div>
            <span className="principle-number">02</span>
            <div>
              <h3>Respect local context</h3>
              <p>
                Weather, soil, variety and crop stage change the answer. We keep
                those questions visible.
              </p>
            </div>
          </div>
          <div>
            <span className="principle-number">03</span>
            <div>
              <h3>Choose the least risky next step</h3>
              <p>
                Field hygiene and monitoring often belong before a chemical
                response.
              </p>
            </div>
          </div>
        </div>
      </div>
      <section className="source-section">
        <div>
          <span className="eyebrow">Sources we point toward</span>
          <h2>Good advice deserves a trail.</h2>
        </div>
        <div className="source-cards">
          <a
            href="https://mausam.imd.gov.in/responsive/agromet_adv_ser_state_current.php"
            target="_blank"
            rel="noreferrer"
          >
            <CloudSun size={20} />
            <span>
              <b>India Meteorological Department</b>
              <small>Agromet bulletins and forecast context</small>
            </span>
            <ExternalLink size={14} />
          </a>
          <a
            href="https://www.fao.org/pest-and-pesticide-management/ipm/integrated-pest-management/en/"
            target="_blank"
            rel="noreferrer"
          >
            <ShieldCheck size={20} />
            <span>
              <b>FAO Integrated Pest Management</b>
              <small>Principles for sustainable pest control</small>
            </span>
            <ExternalLink size={14} />
          </a>
        </div>
      </section>
      <section className="contact-strip">
        <div>
          <span className="eyebrow">Have a suggestion?</span>
          <h2>Tell us which crop should come next.</h2>
        </div>
        <a
          href="mailto:hello@agrosathi.example"
          className="button button-primary"
        >
          Send a note <ArrowRight size={16} />
        </a>
      </section>
    </main>
  );
}

function FloatingBottomNavDock({ page, onTriggerCamera }) {
  return (
    <nav
      className="floating-bottom-nav-dock"
      aria-label="Bottom Navigation Dock"
    >
      <Link
        href="/"
        className={`dock-nav-item ${page === "home" ? "is-active" : ""}`}
        title="Home Bento"
        aria-label="Home"
        onClick={() => {
          window.dispatchEvent(new CustomEvent("agro-close-sheet"));
        }}
      >
        <HomeIcon size={22} strokeWidth={2.2} />
      </Link>
      <Link
        href="/mandi"
        className={`dock-nav-item ${page === "mandi" ? "is-active" : ""}`}
        title="Mandi Bhav"
        aria-label="Mandi Bhav"
      >
        <TrendingUp size={22} strokeWidth={2.2} />
      </Link>

      {/* Center Prominent Camera Feature Button (Bigger and Distinct Vibrant Color) */}
      <button
        type="button"
        className={`dock-nav-item dock-nav-camera-btn ${page === "detect" ? "is-active" : ""}`}
        title="AI Leaf Camera & Crop Doctor"
        aria-label="AI Leaf Camera"
        onClick={onTriggerCamera}
      >
        <Camera size={26} strokeWidth={2.4} />
      </button>

      <Link
        href="/weather"
        className={`dock-nav-item ${page === "weather" ? "is-active" : ""}`}
        title="5-Day Weather Desk"
        aria-label="Weather Desk"
      >
        <CloudSun size={22} strokeWidth={2.2} />
      </Link>
      <Link
        href="/user"
        className={`dock-nav-item ${page === "user" ? "is-active" : ""}`}
        title="Farmer Profile & Account"
        aria-label="Profile and Account"
      >
        <User size={22} strokeWidth={2.2} />
      </Link>
    </nav>
  );
}

export default function Home() {
  const [location, navigate] = useLocation();
  const page = pageFromPath(location);
  const { user } = useFirebase();
  const [showAgroIntro, setShowAgroIntro] = useState(false);
  const globalCameraInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  const handleGlobalCameraFile = file => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        sessionStorage.setItem("agro_pending_scan", String(reader.result));
        sessionStorage.setItem(
          "agro_pending_scan_name",
          file.name || "scanned-leaf.jpg"
        );
      } catch (e) {
        console.warn(e);
      }
      navigate("/detect");
    };
    reader.readAsDataURL(file);
  };

  let content;
  if (page === "login") content = <AuthPage mode="login" />;
  else if (page === "signup") content = <AuthPage mode="signup" />;
  else if (page === "user") content = <UserPage />;
  else if (page === "detect") content = <DetectPage />;
  else if (page === "mandi") content = <MandiPage />;
  else if (page === "guides") content = <GuidesPage />;
  else if (page === "weather") content = <WeatherPage />;
  else if (page === "advisory") content = <AdvisoryPage />;
  else if (page === "about") content = <AboutPage />;
  else content = <HomePage />;

  return (
    <div className="app-shell">
      {/* Hidden global camera input for bottom dock */}
      <input
        ref={globalCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        style={{ display: "none" }}
        onChange={e => {
          handleGlobalCameraFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {/* Animated Agro Sprout & Sun Loading Screen */}
      <AgroLoader
        forceShow={showAgroIntro}
        onComplete={() => setShowAgroIntro(false)}
      />
      <Header page={page} />
      {content}
      <Footer />
      {/* Bottom navigation bar visible strictly after login */}
      {user && (
        <FloatingBottomNavDock
          page={page}
          onTriggerCamera={() => {
            if (page === "detect") {
              const trigger = document.getElementById("detect-camera-trigger");
              if (trigger) trigger.click();
              else globalCameraInputRef.current?.click();
            } else {
              globalCameraInputRef.current?.click();
            }
          }}
        />
      )}
    </div>
  );
}
