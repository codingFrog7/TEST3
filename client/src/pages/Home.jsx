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
  Mail,
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
  Info,
  Brain,
  Eye,
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
    <footer className="bg-[#eff0eb] text-slate-900 border-t-4 border-slate-900 mt-20 pt-16 pb-8 font-sans" id="site-footer">
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Kisan Helpline Column */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <div className="mb-6">
              <AgroSathiLogo size="md" inverted={false} />
            </div>
            <p className="text-slate-700 font-bold mb-8 max-w-md leading-relaxed text-lg">
              Real-time crop disease diagnosis, precision agromet advisories,
              and live mandi market prices for Indian farmers.
            </p>
            <div className="bg-white border-4 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_#0f172a]">
              <div className="inline-flex items-center gap-2 bg-[#b6f022] text-slate-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                <Phone size={13} className="text-slate-900" />
                <span>Kisan Call Centre</span>
              </div>
              <a
                href="tel:18001801551"
                className="block text-3xl font-black text-slate-900 hover:text-[#64b60a] transition-colors mb-1"
              >
                1800-180-1551
              </a>
              <span className="text-sm font-black text-slate-500 uppercase tracking-wide">
                Govt. of India · 6:00 AM – 10:00 PM Daily
              </span>
            </div>
          </div>

          {/* Navigation Column 1: Agronomy Services */}
          <div>
            <h4 className="text-slate-900 font-black text-lg mb-6 uppercase tracking-widest border-b-4 border-slate-900 inline-block pb-1">Farming Services</h4>
            <ul className="flex flex-col gap-4 font-black text-slate-700">
              <li>
                <Link href="/detect" className="hover:text-slate-900 hover:translate-x-1 inline-block transition-transform">Crop Disease Doctor</Link>
              </li>
              <li>
                <Link href="/mandi" className="hover:text-slate-900 hover:translate-x-1 inline-block transition-transform">Mandi Bhav Today</Link>
              </li>
              <li>
                <Link href="/weather" className="hover:text-slate-900 hover:translate-x-1 inline-block transition-transform">Weather & Spray Desk</Link>
              </li>
              <li>
                <Link href="/detect" className="hover:text-slate-900 hover:translate-x-1 inline-block transition-transform">AI Instant Diagnosis</Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Portals & Help */}
          <div>
            <h4 className="text-slate-900 font-black text-lg mb-6 uppercase tracking-widest border-b-4 border-slate-900 inline-block pb-1">Farmer Portals</h4>
            <ul className="flex flex-col gap-4 font-black text-slate-700">
              <li>
                <Link href="/user" className="hover:text-slate-900 hover:translate-x-1 inline-block transition-transform">My Field Diary</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-slate-900 hover:translate-x-1 inline-block transition-transform">About AGRO SATHI</Link>
              </li>
              <li>
                <a
                  href="https://mausam.imd.gov.in/responsive/agromet_adv_ser_state_current.php"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-slate-900 hover:translate-x-1 transition-transform"
                >
                  IMD Agromet Weather <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a
                  href="https://enam.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-slate-900 hover:translate-x-1 transition-transform"
                >
                  e-NAM Mandi Portal <ExternalLink size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-6 pt-8 border-t-4 border-slate-900 mt-8 relative">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <span className="font-black text-xl text-slate-900 tracking-widest uppercase">Team Froggers</span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <Link 
              href="/team" 
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_0px_#0f172a] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#0f172a] active:translate-y-1 active:shadow-none transition-all text-slate-900 font-bold cursor-pointer"
            >
              <User size={16} className="text-slate-700" />
              <span>About Team</span>
            </Link>
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
          cropTag: "Field Advisory",
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
                    alt="Crop Leaf Scan"
                    className="detail-hero-leaf-img"
                  />
                  <div className="detail-stage-overlay-badge">
                    <Sparkles size={13} />
                    <span>AI Confidence 94.8% · Disease Assessment</span>
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
                      Leaf Pathology Diagnosis
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
            /* RENDER INFORMATIONAL SECTION (Neo-Brutalist Layout) */
            <section className="agro-neo-info">
              <h2 className="neo-main-title">How it works</h2>
              
              <div className="neo-steps-container">
                {/* Step 1 */}
                <div className="neo-step-row">
                  <div className="neo-step-text">
                    <h3>1. Snap a photo of your leaf</h3>
                    <p>The smartest AI assistant will analyze the leaf for any visual symptoms of diseases or pests. Available directly on your phone.</p>
                    <button className="neo-btn-primary" onClick={() => {
                      const trig = document.getElementById("hero-main-camera-trigger");
                      if (trig) trig.click();
                      else heroCameraRef.current?.click();
                    }}>
                      Take a Photo
                    </button>
                  </div>
                  <div className="neo-step-image-wrap">
                    <img src="/assets/step1.jpg" alt="Scan Leaf" />
                  </div>
                </div>

                {/* Step 2 (Reversed) */}
                <div className="neo-step-row reverse">
                  <div className="neo-step-image-wrap">
                    <img src="/assets/step2.jpg" alt="AI Dashboard" />
                  </div>
                  <div className="neo-step-text">
                    <h3>2. Instant AI Diagnosis</h3>
                    <p>Click "Analyze" to run the image through our advanced crop pathology engine. See confidence scores and disease names in seconds.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="neo-step-row">
                  <div className="neo-step-text">
                    <h3>3. Get Actionable Remedies</h3>
                    <p>Receive immediate chemical and organic treatment plans directly on your phone, preventing further crop loss.</p>
                    <Link href="/about" className="neo-btn-secondary">
                      Learn more
                    </Link>
                  </div>
                  <div className="neo-step-image-wrap">
                    <img src="/assets/step3.jpg" alt="Treatment list" />
                  </div>
                </div>
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
          {["All", "Kharif", "Rabi"].map((filter) => (
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

// ─── AI Weather Desk ──────────────────────────────────────────────────────────
const WMO_CODES = {
  0: { label: "Clear Sky", icon: Sun },
  1: { label: "Mainly Clear", icon: Sun },
  2: { label: "Partly Cloudy", icon: CloudSun },
  3: { label: "Overcast", icon: Cloud },
  45: { label: "Foggy", icon: Cloud },
  48: { label: "Icy Fog", icon: Cloud },
  51: { label: "Light Drizzle", icon: CloudRain },
  53: { label: "Drizzle", icon: CloudRain },
  55: { label: "Heavy Drizzle", icon: CloudRain },
  61: { label: "Light Rain", icon: CloudRain },
  63: { label: "Rain", icon: CloudRain },
  65: { label: "Heavy Rain", icon: CloudRain },
  71: { label: "Light Snow", icon: Cloud },
  73: { label: "Snow", icon: Cloud },
  75: { label: "Heavy Snow", icon: Cloud },
  80: { label: "Rain Showers", icon: CloudRain },
  81: { label: "Rain Showers", icon: CloudRain },
  82: { label: "Violent Showers", icon: CloudRain },
  95: { label: "Thunderstorm", icon: CloudRain },
  96: { label: "Thunderstorm+Hail", icon: CloudRain },
  99: { label: "Heavy Thunderstorm", icon: CloudRain },
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getWindDir(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function WeatherPage() {
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  // ── Helpers ────────────────────────────────────────────────────
  const loadCache = key => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  };
  const saveCache = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };
  const clearCache = () => {
    ["wd_coords", "wd_location", "wd_weather", "wd_advice"].forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
  };

  // ── Restore from cache on mount ────────────────────────────────
  const savedCoords = loadCache("wd_coords");
  const cachedWeatherRaw = loadCache("wd_weather");
  const isCacheValid =
    cachedWeatherRaw &&
    Date.now() - (cachedWeatherRaw.savedAt || 0) < CACHE_TTL;

  // Re-attach icon functions (can't serialize functions to JSON)
  const hydrateWeather = raw => {
    if (!raw) return null;
    return {
      ...raw,
      days: raw.days.map(d => ({ ...d, icon: WMO_CODES[d.code]?.icon || Sun })),
    };
  };

  const [geoState, setGeoState] = useState(savedCoords ? "granted" : "idle");
  const [coords, setCoords] = useState(savedCoords);
  const [locationName, setLocationName] = useState(() => {
    try {
      return localStorage.getItem("wd_location") || "";
    } catch {
      return "";
    }
  });
  const [weather, setWeather] = useState(() =>
    isCacheValid ? hydrateWeather(cachedWeatherRaw) : null
  );
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(() => {
    const fallbackAdvice = "• Keep field bunds clean to prevent pest breeding and reduce disease spread.\n• Spray pesticides in the early morning to avoid evaporation and leaf burn.\n• Monitor crop weekly for early signs of disease or nutrient deficiency.";
    if (!isCacheValid) return fallbackAdvice;
    try {
      return localStorage.getItem("wd_advice") || fallbackAdvice;
    } catch {
      return fallbackAdvice;
    }
  });
  const [loadingAi, setLoadingAi] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [cacheAge, setCacheAge] = useState(() =>
    isCacheValid
      ? Math.round((Date.now() - cachedWeatherRaw.savedAt) / 60000)
      : null
  );
  const [aiSlideIndex, setAiSlideIndex] = useState(0);

  useEffect(() => {
    if (!aiAdvice) return;
    const lines = aiAdvice.split("\n").filter(l => l.trim());
    if (lines.length <= 1) return;
    const interval = setInterval(() => {
      setAiSlideIndex(prev => (prev + 1) % lines.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [aiAdvice]);

  // ── Geolocation request ────────────────────────────────────────
  const requestLocation = (forceRefresh = false) => {
    setGeoState("loading");
    setWeather(null);
    setAiAdvice("");
    setSelectedDay(0);
    setCacheAge(null);
    if (!navigator.geolocation) {
      setGeoState("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const c = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCoords(c);
        setGeoState("granted");
        saveCache("wd_coords", c);
      },
      () => setGeoState("denied"),
      { timeout: 10000, maximumAge: forceRefresh ? 0 : 300000 }
    );
  };

  // ── Fetch weather (skips if cache is still valid) ──────────────
  useEffect(() => {
    if (!coords) return;
    // If cache is fresh and we already have weather, skip the fetch
    if (isCacheValid && weather) return;

    setLoadingWeather(true);
    const { lat, lon } = coords;

    Promise.all([
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`,
        {
          headers: { "Accept-Language": "en" },
        }
      )
        .then(r => r.json())
        .catch(() => null),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant,uv_index_max` +
          `&hourly=relativehumidity_2m` +
          `&current_weather=true&timezone=auto&forecast_days=7`
      ).then(r => r.json()),
    ])
      .then(([geo, wx]) => {
        // Location name
        if (geo?.address) {
          const a = geo.address;
          const city =
            a.city || a.town || a.village || a.county || a.state_district || "";
          const state = a.state || "";
          const name = city ? `${city}, ${state}` : state || "Your Location";
          const isLatin = /^[\u0000-\u024F\s,.'"-]+$/.test(name);
          const finalName = isLatin ? name : geo.name || "Your Location";
          setLocationName(finalName);
          try {
            localStorage.setItem("wd_location", finalName);
          } catch {}
        }

        // Parse weather
        if (wx?.daily) {
          const d = wx.daily;
          const cw = wx.current_weather;
          const days = d.time.map((time, i) => {
            const code = d.weathercode[i];
            const meta = WMO_CODES[code] || { label: "Unknown", icon: Sun };
            const dateObj = new Date(time);
            return {
              time,
              dayName:
                i === 0
                  ? "Today"
                  : i === 1
                    ? "Tomorrow"
                    : DAY_NAMES[dateObj.getDay()],
              dateStr: `${dateObj.getDate()} ${MONTH_NAMES[dateObj.getMonth()]}`,
              icon: meta.icon, // kept in memory only
              label: meta.label,
              high: Math.round(d.temperature_2m_max[i]),
              low: Math.round(d.temperature_2m_min[i]),
              rain: d.precipitation_probability_max[i] ?? 0,
              wind: Math.round(d.windspeed_10m_max[i]),
              windDir: getWindDir(d.winddirection_10m_dominant[i] ?? 0),
              uv: d.uv_index_max[i] ?? 0,
              code,
            };
          });

          const todayHumidityVals =
            wx.hourly?.relativehumidity_2m?.slice(0, 24) || [];
          const avgHumidity = todayHumidityVals.length
            ? Math.round(
                todayHumidityVals.reduce((a, b) => a + b, 0) /
                  todayHumidityVals.length
              )
            : null;

          const wxObj = {
            days,
            currentTemp: cw ? Math.round(cw.temperature) : null,
            currentCode: cw?.weathercode ?? 0,
            humidity: avgHumidity,
            timezone: wx.timezone,
          };
          setWeather(wxObj);
          setCacheAge(0);

          // Persist to localStorage (strip icon functions before serialising)
          const serialisable = {
            ...wxObj,
            days: days.map(({ icon: _icon, ...rest }) => rest),
            savedAt: Date.now(),
          };
          saveCache("wd_weather", serialisable);

          fetchAiAdvice(days[0], avgHumidity);
        }
        setLoadingWeather(false);
      })
      .catch(() => setLoadingWeather(false));
  }, [coords]);

  const fetchAiAdvice = async (today, humidity) => {
    setLoadingAi(true);
    setAiAdvice("");
    try {
      const prompt = `You are an expert Indian agricultural advisor. Based on the following real-time weather data for a farmer's location, provide 3 concise, practical field advisory points in simple English. Each point must be actionable and specific to this weather.

Weather Today:
- Condition: ${today.label}
- High: ${today.high}°C, Low: ${today.low}°C
- Rain Probability: ${today.rain}%
- Wind: ${today.wind} km/h from ${today.windDir}
- UV Index: ${today.uv}
${humidity ? `- Humidity: ${humidity}%` : ""}

Format: Give exactly 3 bullet points starting with "•". Each bullet should be 1-2 sentences. Be practical and farmer-friendly. No greetings or headings.`;

      const fd = new FormData();
      fd.append("question", prompt);
      const res = await fetch("/api/python/ask", { method: "POST", body: fd });
      const data = await res.json();
      const text = data.answer || data.response || data.text || "";
      const trimmed = text.trim();
      setAiAdvice(trimmed);
      // Cache advice alongside weather
      try {
        localStorage.setItem("wd_advice", trimmed);
      } catch {}
    } catch {
      setAiAdvice(
        "• Scout your fields in the early morning when dew has dried.\n• Check soil moisture before irrigating — avoid waterlogging.\n• Monitor weather updates and plan spray windows carefully."
      );
    }
    setLoadingAi(false);
  };

  const today = weather?.days?.[selectedDay];
  const WeatherIcon = today ? WMO_CODES[today.code]?.icon || Sun : Sun;

  // ── States ──────────────────────────────────────────────────────────────────
  if (geoState === "idle") {
    return (
      <main className="page-width page-shell">
        <div className="wd-permission-screen">
          <div className="wd-permission-card">
            <div className="wd-permission-icon-ring">
              <Navigation size={32} />
            </div>
            <h1 className="wd-permission-title">AI Weather Desk</h1>
            <p className="wd-permission-body">
              Get real-time hyperlocal weather data and AI-generated field
              advisory tailored to your exact location — updated live.
            </p>
            <button
              id="weather-location-btn"
              className="wd-allow-btn"
              onClick={requestLocation}
            >
              <Navigation size={16} />
              Allow Location Access
            </button>
            <p className="wd-permission-note">
              Location stays on your device and is never stored.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (
    geoState === "loading" ||
    (geoState === "granted" && loadingWeather && !weather)
  ) {
    return (
      <main className="page-width page-shell">
        <div className="wd-permission-screen">
          <div className="wd-loading-card">
            <div className="wd-spinner" />
            <p className="wd-loading-label">
              {geoState === "loading"
                ? "Detecting your location…"
                : "Fetching live weather data…"}
            </p>
            {locationName ? (
              <p className="wd-loading-sublabel">{locationName}</p>
            ) : null}
          </div>
        </div>
      </main>
    );
  }

  if (geoState === "denied") {
    return (
      <main className="page-width page-shell">
        <div className="wd-permission-screen">
          <div className="wd-permission-card wd-denied">
            <div className="wd-permission-icon-ring denied">
              <AlertTriangle size={28} />
            </div>
            <h2 className="wd-permission-title">Location Access Denied</h2>
            <p className="wd-permission-body">
              Please allow location access in your browser settings to get live
              weather data for your field.
            </p>
            <button className="wd-allow-btn" onClick={requestLocation}>
              <RotateCcw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Main Weather UI ─────────────────────────────────────────────────────────
  return (
    <main className="page-width page-shell wd-root">
      {/* Header */}
      <div className="wd-header">
        <div className="wd-header-left">
          <span className="wd-eyebrow">
            <span className="wd-live-dot" />
            LIVE · AI WEATHER DESK
          </span>
          <h1 className="wd-title">{locationName || "Your Location"}</h1>
          {today && (
            <p className="wd-subtitle">
              {today.dateStr} ·{" "}
              {cacheAge === null || cacheAge === 0
                ? "Updated just now"
                : cacheAge === 1
                  ? "Updated 1 min ago"
                  : `Updated ${cacheAge} min ago`}
            </p>
          )}
        </div>
        <div className="wd-header-actions">
          <button
            className="wd-refresh-btn"
            onClick={() => requestLocation(true)}
            title="Refresh live weather"
          >
            <RotateCcw size={15} />
            Refresh
          </button>
          <button
            className="wd-change-btn"
            onClick={() => {
              clearCache();
              setCoords(null);
              setWeather(null);
              setAiAdvice("");
              setLocationName("");
              setSelectedDay(0);
              setCacheAge(null);
              setGeoState("idle");
            }}
            title="Change location"
          >
            <Navigation size={13} />
            Change
          </button>
        </div>
      </div>

      {/* Hero weather card */}
      {today && (
        <div className="wd-hero-grid">
          {/* Current conditions */}
          <div className="wd-current-card">
            <div className="wd-current-top">
              <div className="wd-temp-block">
                <WeatherIcon
                  size={52}
                  strokeWidth={1.4}
                  className="wd-main-icon"
                />
                <div className="wd-temp-nums">
                  <span className="wd-temp-now">
                    {weather.currentTemp ?? today.high}°
                  </span>
                  <span className="wd-temp-range">
                    <span className="wd-temp-hi">↑{today.high}°</span>
                    <span className="wd-temp-lo">↓{today.low}°</span>
                  </span>
                </div>
              </div>
              <div className="wd-condition-label">{today.label}</div>
            </div>
            <div className="wd-stats-row">
              <div className="wd-stat">
                <Droplets size={14} className="wd-stat-icon rain" />
                <span className="wd-stat-val">{today.rain}%</span>
                <span className="wd-stat-name">Rain chance</span>
              </div>
              <div className="wd-stat">
                <Wind size={14} className="wd-stat-icon wind" />
                <span className="wd-stat-val">{today.wind} km/h</span>
                <span className="wd-stat-name">{today.windDir} wind</span>
              </div>
              {weather.humidity !== null && (
                <div className="wd-stat">
                  <ThermometerSun size={14} className="wd-stat-icon uv" />
                  <span className="wd-stat-val">{weather.humidity}%</span>
                  <span className="wd-stat-name">Humidity</span>
                </div>
              )}
              <div className="wd-stat">
                <Sun size={14} className="wd-stat-icon uv" />
                <span className="wd-stat-val">{today.uv}</span>
                <span className="wd-stat-name">UV Index</span>
              </div>
            </div>
          </div>

          {/* AI Field Advisory */}
          <div className="wd-ai-card">
            <div className="wd-ai-header">
              <Sparkles size={15} className="wd-ai-sparkle" />
              <span>AI Field Advisory</span>
            </div>
            {loadingAi ? (
              <div className="wd-ai-loading">
                <div className="wd-ai-spinner" />
                <span>Generating advice for your conditions…</span>
              </div>
            ) : aiAdvice ? (
              <div className="wd-ai-carousel" style={{ position: "relative", minHeight: "90px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  {aiAdvice
                    .split("\n")
                    .filter(l => l.trim())
                    .map((line, i) => (
                      <div 
                        key={i} 
                        className="wd-ai-item"
                        style={{
                          position: i === aiSlideIndex ? "relative" : "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          opacity: i === aiSlideIndex ? 1 : 0,
                          transform: i === aiSlideIndex ? "translateY(0) scale(1)" : "translateY(15px) scale(0.98)",
                          transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                          pointerEvents: i === aiSlideIndex ? "auto" : "none",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px"
                        }}
                      >
                        <span className="wd-ai-bullet" style={{ flexShrink: 0, marginTop: "6px" }} />
                        <span style={{ lineHeight: 1.5 }}>{line.replace(/^[•\-\*]\s*/, "")}</span>
                      </div>
                    ))}
                </div>
                <div className="wd-ai-dots" style={{ display: "flex", gap: "5px", marginTop: "14px" }}>
                  {aiAdvice.split("\n").filter(l => l.trim()).map((_, i) => (
                    <div 
                      key={i} 
                      style={{
                        width: "6px", 
                        height: "6px", 
                        borderRadius: "50%", 
                        background: i === aiSlideIndex ? "var(--lime-leaf, #64b60a)" : "rgba(100, 182, 10, 0.2)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        transform: i === aiSlideIndex ? "scale(1.2)" : "scale(1)"
                      }}
                      onClick={() => setAiSlideIndex(i)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="wd-ai-empty">Advice unavailable</p>
            )}
            <div className="wd-ai-footer">
              <Sparkles size={11} />
              <span>Powered by Gemini AI · Based on live conditions</span>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      {weather?.days && (
        <section className="wd-forecast-section">
          <div className="wd-section-head">
            <span className="wd-eyebrow">7-DAY OUTLOOK</span>
            <h2 className="wd-section-title">Plan your week</h2>
          </div>
          <div className="wd-forecast-strip">
            {weather.days.map((day, i) => {
              const DayIcon = day.icon;
              const isSelected = i === selectedDay;
              const isRainy = day.rain >= 50;
              const isHot = day.high >= 38;
              return (
                <button
                  key={day.time}
                  className={`wd-forecast-day ${isSelected ? "selected" : ""} ${isRainy ? "rainy" : ""} ${isHot ? "hot" : ""}`}
                  onClick={() => setSelectedDay(i)}
                >
                  <span className="wd-fday-name">{day.dayName}</span>
                  <span className="wd-fday-date">{day.dateStr}</span>
                  <DayIcon
                    size={26}
                    strokeWidth={1.5}
                    className="wd-fday-icon"
                  />
                  <span className="wd-fday-hi">{day.high}°</span>
                  <span className="wd-fday-lo">{day.low}°</span>
                  <div className="wd-fday-rain">
                    <Droplets size={11} />
                    <span>{day.rain}%</span>
                  </div>
                  {isRainy && <span className="wd-fday-badge rain">Rain</span>}
                  {isHot && !isRainy && (
                    <span className="wd-fday-badge heat">Hot</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Field Tasks based on selected day */}
      {today && (
        <section className="wd-tasks-section">
          <div className="wd-section-head">
            <span className="wd-eyebrow">FIELD TIMING</span>
            <h2 className="wd-section-title">
              {selectedDay === 0 ? "Today's" : `${today.dayName}'s`}{" "}
              recommendations
            </h2>
          </div>
          <div className="wd-task-grid">
            {/* Spraying window */}
            <div
              className={`wd-task-card ${today.rain < 30 && today.wind < 20 ? "good" : "caution"}`}
            >
              <div className="wd-task-icon-wrap">
                <FlaskConical size={20} />
              </div>
              <div className="wd-task-content">
                <span className="wd-task-badge">
                  {today.rain < 30 && today.wind < 20
                    ? "✓ Good window"
                    : "⚠ Caution"}
                </span>
                <h3>Spray Window</h3>
                <p>
                  {today.rain < 30 && today.wind < 20
                    ? `Low rain chance (${today.rain}%) and manageable wind. Good time for foliar sprays early morning.`
                    : today.rain >= 50
                      ? `High rain probability (${today.rain}%). Avoid sprays — product will wash off.`
                      : `Wind at ${today.wind} km/h. Wait for calmer conditions before spraying.`}
                </p>
              </div>
            </div>
            {/* Irrigation */}
            <div
              className={`wd-task-card ${today.rain >= 40 ? "caution" : "good"}`}
            >
              <div className="wd-task-icon-wrap">
                <Droplets size={20} />
              </div>
              <div className="wd-task-content">
                <span className="wd-task-badge">
                  {today.rain >= 40
                    ? "⚠ Hold irrigation"
                    : "✓ Irrigate if needed"}
                </span>
                <h3>Irrigation</h3>
                <p>
                  {today.rain >= 40
                    ? `Rain expected at ${today.rain}% probability. Check soil moisture first — skip irrigation if rain is coming.`
                    : `Dry conditions expected. Monitor crop stress and irrigate in the cool morning hours.`}
                </p>
              </div>
            </div>
            {/* Scouting */}
            <div className="wd-task-card good">
              <div className="wd-task-icon-wrap">
                <ScanLine size={20} />
              </div>
              <div className="wd-task-content">
                <span className="wd-task-badge">✓ Recommended</span>
                <h3>Field Scouting</h3>
                <p>
                  {today.high >= 35
                    ? `Hot day (${today.high}°C). Scout in early morning before 8AM. Check for heat stress symptoms on leaves.`
                    : today.rain >= 50
                      ? `Post-rain scouting is important. Look for fungal signs, waterlogging, and soil erosion.`
                      : `Ideal scouting weather. Walk field edges and check undersides of leaves for early pest signs.`}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* IMD link footer */}
      <div className="wd-footer-link">
        <Info size={13} />
        <span>Always cross-verify with the</span>
        <a
          href="https://mausam.imd.gov.in/responsive/agromet_adv_ser_state_current.php"
          target="_blank"
          rel="noreferrer"
          className="wd-imd-link"
        >
          IMD Agromet Advisory <ExternalLink size={11} />
        </a>
      </div>
    </main>
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
            {filters.map((filter) => (
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
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="eyebrow">Agro Sathi Intelligence</span>
          <h1>Empowering the Kisan with AI</h1>
          <p>
            Your digital crop doctor. We combine artificial intelligence with local agronomy to help you identify diseases instantly and take the right action.
          </p>
        </div>
      </section>

      {/* The 4-Step Process (Visual Timeline) */}
      <section className="about-timeline-section">
        <h2>How It Works in the Field</h2>
        <div className="about-timeline">
          <div className="timeline-step">
            <div className="step-icon">
              <Eye size={24} />
            </div>
            <h3>1. Observe</h3>
            <p>Notice unusual spots, pest damage, or discoloration on your crop leaves.</p>
          </div>
          <div className="timeline-step">
            <div className="step-icon">
              <Camera size={24} />
            </div>
            <h3>2. Snap & Upload</h3>
            <p>Use the Agro Sathi camera tool to take a clear, close-up photo of the affected leaf.</p>
          </div>
          <div className="timeline-step">
            <div className="step-icon">
              <Brain size={24} />
            </div>
            <h3>3. AI Analysis</h3>
            <p>Our smart engine processes the image against thousands of known pathology cases instantly.</p>
          </div>
          <div className="timeline-step">
            <div className="step-icon">
              <CheckCircle2 size={24} />
            </div>
            <h3>4. Actionable Results</h3>
            <p>Receive a clear, single-window report with exact steps to save your yield.</p>
          </div>
        </div>
      </section>

      {/* What You Get (Results Breakdown) */}
      <section className="about-features-section">
        <h2>What You Get in Your Report</h2>
        <div className="about-feature-grid">
          <div className="feature-card yellow">
            <AlertTriangle size={24} />
            <h4>Disease & Severity</h4>
            <p>Know exactly what disease you're fighting and how severe it is on a 1-5 scale.</p>
          </div>
          <div className="feature-card blue">
            <FlaskConical size={24} />
            <h4>Chemical Sprays</h4>
            <p>Targeted chemical fungicide or insecticide recommendations with proper dosage.</p>
          </div>
          <div className="feature-card green">
            <Sprout size={24} />
            <h4>Organic Remedies</h4>
            <p>Biological and safe organic alternatives like Neem Oil for sustainable farming.</p>
          </div>
          <div className="feature-card teal">
            <ShieldCheck size={24} />
            <h4>Preventative Care</h4>
            <p>Actionable advice on soil, watering, and field hygiene to prevent the spread.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="contact-strip" style={{ marginTop: "64px" }}>
        <div>
          <span className="eyebrow">Ready to try?</span>
          <h2>Scan your first crop today.</h2>
        </div>
        <Link href="/" className="button button-primary">
          Open AI Camera <ArrowRight size={16} />
        </Link>
      </section>
    </main>
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
    </div>
  );
}
