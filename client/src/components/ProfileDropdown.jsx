import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  User,
  LogOut,
  LogIn,
  Settings,
  ShieldCheck,
  Sprout,
  Camera,
  BookOpen,
  Cloud,
  CloudSun,
  Copy,
  Check,
  ChevronRight,
  TrendingUp,
  MapPin,
  FileText,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Phone,
  Edit3,
  ExternalLink,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useFirebase } from "../context/FirebaseContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ProfileDropdown({ isOpen, onClose, onOpenQuickAuth }) {
  const dropdownRef = useRef(null);
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const {
    user,
    signOut,
    farmerProfile,
    updateFarmerProfile,
    scoutRecords,
    fieldNotes,
    syncStatus,
    signInWithGoogle,
  } = useFirebase();

  const [copiedUid, setCopiedUid] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editCrop, setEditCrop] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [mandiAlertsEnabled, setMandiAlertsEnabled] = useState(true);

  // Sync edit form state when profile changes
  useEffect(() => {
    if (farmerProfile || user) {
      setEditName(
        farmerProfile?.displayName || user?.displayName || "Kisan Farmer"
      );
      setEditLocation(farmerProfile?.location || "Karimnagar, Telangana");
      setEditCrop(farmerProfile?.primaryCrop || "Cotton");
    }
  }, [farmerProfile, user]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    const handleKeyDown = event => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyUid = () => {
    if (!user?.uid) return;
    navigator.clipboard.writeText(user.uid).then(() => {
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    });
  };

  const handleSaveQuickProfile = async e => {
    e.preventDefault();
    if (!editName.trim()) return;
    setIsSaving(true);
    try {
      await updateFarmerProfile({
        displayName: editName.trim(),
        location: editLocation.trim(),
        primaryCrop: editCrop.trim(),
      });
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoogleSignInClick = async () => {
    setGoogleError("");
    setGoogleLoading(true);
    try {
      const loggedUser = await signInWithGoogle();
      if (loggedUser) {
        onClose();
      }
    } catch (err) {
      setGoogleError(err?.message || "Google sign in could not be completed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignOutClick = async () => {
    try {
      await signOut();
      onClose();
      navigate("/");
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "te", label: "తెలుగు" },
    { code: "pa", label: "ਪੰਜਾਬੀ" },
  ];

  return (
    <div
      ref={dropdownRef}
      className="profile-dropdown-container animate-in fade-in zoom-in-95 duration-150"
      id="farmer-profile-dropdown"
      role="menu"
      aria-label="Farmer profile menu"
    >
      {user ? (
        /* ================= AUTHENTICATED FARMER VIEW ================= */
        <div className="profile-dropdown-content">
          {/* 1. Identity Header Card */}
          <div className="profile-dropdown-header">
            <div className="profile-header-user-row">
              <div className="profile-dropdown-avatar-wrap">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Farmer"}
                    className="profile-dropdown-avatar-img"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="profile-dropdown-avatar-fallback">
                    {(user.displayName || user.email || "K")[0].toUpperCase()}
                  </div>
                )}
                <span className="profile-online-dot" title="Account active" />
              </div>

              <div className="profile-header-names">
                <div className="profile-badge-row">
                  <span className="profile-kisan-tag">
                    <Sprout size={11} />
                    <span>Verified Kisan</span>
                  </span>
                  <span className="profile-cloud-sync-tag">
                    <Cloud size={11} className="text-emerald-500" />
                    <span>
                      {syncStatus === "syncing" ? "Syncing..." : "Synced"}
                    </span>
                  </span>
                </div>
                <h3 className="profile-dropdown-name">
                  {farmerProfile?.displayName ||
                    user.displayName ||
                    "Kisan Farmer"}
                </h3>
                <p className="profile-dropdown-email">{user.email}</p>
              </div>
            </div>

            {/* Kisan ID Pill with Copy */}
            <div className="profile-kisan-id-strip">
              <span className="profile-kisan-id-label">Kisan UID:</span>
              <code className="profile-kisan-id-val">
                KISAN-{user.uid.slice(0, 8).toUpperCase()}
              </code>
              <button
                type="button"
                onClick={handleCopyUid}
                className="profile-copy-uid-btn"
                title="Copy farmer UID"
                aria-label="Copy farmer UID"
              >
                {copiedUid ? (
                  <Check size={12} className="text-emerald-600" />
                ) : (
                  <Copy size={12} />
                )}
                <span>{copiedUid ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* 2. Farm Telemetry & Quick Profile Management */}
          <div className="profile-dropdown-section">
            <div className="profile-section-title-row">
              <span className="profile-section-title">Farm Details</span>
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="profile-edit-toggle-btn"
                title="Quick edit farm details"
              >
                <Edit3 size={12} />
                <span>{isEditingProfile ? "Cancel" : "Quick Edit"}</span>
              </button>
            </div>

            {isEditingProfile ? (
              <form
                onSubmit={handleSaveQuickProfile}
                className="profile-quick-edit-form"
              >
                <div className="quick-edit-field">
                  <label htmlFor="quick-farmer-name">Farmer Name</label>
                  <input
                    id="quick-farmer-name"
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Farmer Name"
                    className="quick-edit-input"
                    required
                  />
                </div>
                <div className="quick-edit-grid">
                  <div className="quick-edit-field">
                    <label htmlFor="quick-farmer-location">Location</label>
                    <input
                      id="quick-farmer-location"
                      type="text"
                      value={editLocation}
                      onChange={e => setEditLocation(e.target.value)}
                      placeholder="District, State"
                      className="quick-edit-input"
                    />
                  </div>
                  <div className="quick-edit-field">
                    <label htmlFor="quick-farmer-crop">Primary Crop</label>
                    <input
                      id="quick-farmer-crop"
                      type="text"
                      value={editCrop}
                      onChange={e => setEditCrop(e.target.value)}
                      placeholder="e.g. Cotton, Chilli"
                      className="quick-edit-input"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="quick-edit-save-btn"
                >
                  {isSaving ? "Saving to Cloud..." : "Save Farm Changes"}
                </button>
              </form>
            ) : (
              <div className="profile-farm-info-card">
                <div className="farm-info-item">
                  <MapPin size={13} className="text-emerald-600 shrink-0" />
                  <span className="farm-info-val">
                    {farmerProfile?.location || "Karimnagar, Telangana"}
                  </span>
                </div>
                <div className="farm-info-divider" />
                <div className="farm-info-item">
                  <Sprout size={13} className="text-amber-600 shrink-0" />
                  <span className="farm-info-val">
                    Crop:{" "}
                    <strong>
                      {farmerProfile?.primaryCrop || "Cotton & Chilli"}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Activity Records & Intelligence Counters */}
          <div className="profile-dropdown-section">
            <span className="profile-section-title">
              Field Records & History
            </span>
            <div className="profile-stats-grid">
              <Link
                href="/user"
                onClick={onClose}
                className="profile-stat-box"
                title="View Diagnostic Scan History"
              >
                <div className="stat-icon-circle green">
                  <Camera size={14} />
                </div>
                <div className="stat-content">
                  <span className="stat-num">{scoutRecords.length}</span>
                  <span className="stat-label">Saved Scans</span>
                </div>
                <ChevronRight size={13} className="stat-arrow" />
              </Link>

              <Link
                href="/user"
                onClick={onClose}
                className="profile-stat-box"
                title="View Field Advisory Notes"
              >
                <div className="stat-icon-circle blue">
                  <FileText size={14} />
                </div>
                <div className="stat-content">
                  <span className="stat-num">{fieldNotes.length}</span>
                  <span className="stat-label">Field Notes</span>
                </div>
                <ChevronRight size={13} className="stat-arrow" />
              </Link>
            </div>
          </div>

          {/* 4. Quick Nav & Management Actions */}
          <div className="profile-dropdown-section">
            <span className="profile-section-title">Account & Tools</span>
            <div className="profile-nav-action-list">
              <Link
                href="/user"
                onClick={onClose}
                className="profile-nav-link-item"
              >
                <div className="nav-item-left">
                  <User size={15} />
                  <span>Farmer Profile &amp; Sync Hub</span>
                </div>
                <span className="nav-item-badge">Full Hub</span>
              </Link>

              <Link
                href="/detect"
                onClick={onClose}
                className="profile-nav-link-item"
              >
                <div className="nav-item-left">
                  <Camera size={15} />
                  <span>AI Crop Doctor Scanner</span>
                </div>
              </Link>

              <Link
                href="/mandi"
                onClick={onClose}
                className="profile-nav-link-item"
              >
                <div className="nav-item-left">
                  <TrendingUp size={15} />
                  <span>Mandi Bhav Live Rates</span>
                </div>
              </Link>

              <Link
                href="/weather"
                onClick={onClose}
                className="profile-nav-link-item"
              >
                <div className="nav-item-left">
                  <CloudSun size={15} />
                  <span>5-Day Weather Desk</span>
                </div>
              </Link>
            </div>
          </div>

          {/* 5. Features & Basic Info Preferences */}
          <div className="profile-dropdown-section">
            <span className="profile-section-title">
              Preferences &amp; Portal Features
            </span>

            {/* Theme Toggle in Dropdown */}
            <div className="profile-pref-row">
              <div className="pref-label-wrap">
                {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
                <span>Display Theme</span>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="profile-theme-switch-btn"
                title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
              >
                <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
              </button>
            </div>

            {/* Language Selector */}
            <div className="profile-pref-row">
              <div className="pref-label-wrap">
                <Sparkles size={15} />
                <span>Portal Language</span>
              </div>
              <div className="profile-lang-pill-cluster">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`profile-lang-chip ${selectedLanguage === lang.code ? "active" : ""}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mandi Alerts Switch */}
            <div className="profile-pref-row">
              <div className="pref-label-wrap">
                <TrendingUp size={15} />
                <span>Mandi Price Alerts</span>
              </div>
              <button
                type="button"
                onClick={() => setMandiAlertsEnabled(!mandiAlertsEnabled)}
                className={`profile-toggle-switch ${mandiAlertsEnabled ? "is-on" : ""}`}
                aria-label="Toggle mandi price alerts"
              >
                <span className="switch-knob" />
              </button>
            </div>

            {/* Kisan Call Center Helpline */}
            <div className="profile-helpline-box">
              <Phone size={14} className="text-emerald-600 shrink-0" />
              <div className="helpline-text">
                <span className="helpline-title">Kisan Toll-Free Helpline</span>
                <a href="tel:18001801551" className="helpline-phone">
                  1800-180-1551
                </a>
              </div>
            </div>
          </div>

          {/* 6. Sign Out Action Button */}
          <div className="profile-dropdown-footer">
            <button
              type="button"
              onClick={handleSignOutClick}
              className="profile-signout-btn"
              id="profile-signout-action"
            >
              <LogOut size={15} />
              <span>Sign Out of Agro Sathi</span>
            </button>
            <div className="profile-footer-version">
              <span>Agro Sathi v2.4 · Cloud Connected</span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= GUEST FARMER VIEW ================= */
        <div className="profile-dropdown-content guest-view">
          {/* Guest Header */}
          <div className="profile-dropdown-header guest">
            <div className="profile-header-user-row">
              <div className="profile-dropdown-avatar-wrap guest">
                <User
                  size={22}
                  className="text-emerald-700 dark:text-emerald-400"
                />
              </div>
              <div className="profile-header-names">
                <div className="profile-badge-row">
                  <span className="profile-guest-tag">Guest Mode</span>
                  <span className="profile-offline-tag">Local Storage</span>
                </div>
                <h3 className="profile-dropdown-name">Welcome, Kisan Farmer</h3>
                <p className="profile-dropdown-email">
                  Sign in to unlock Firebase Cloud sync
                </p>
              </div>
            </div>
          </div>

          {/* Fast 1-Click Google Sign In */}
          <div className="profile-dropdown-section">
            <button
              type="button"
              onClick={handleGoogleSignInClick}
              disabled={googleLoading}
              className="profile-google-login-btn"
              id="dropdown-google-signin-btn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {googleLoading ? "Signing In..." : "1-Click Google Sign In"}
              </span>
            </button>

            {googleError && (
              <div
                className="auth-feedback-banner error"
                style={{
                  margin: "10px 0 0",
                  fontSize: "12px",
                  textAlign: "left",
                }}
              >
                <span>{googleError}</span>
              </div>
            )}

            <div className="guest-action-buttons-row">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenQuickAuth) {
                    onOpenQuickAuth("login");
                  } else {
                    navigate("/login");
                  }
                }}
                className="guest-email-login-btn"
                id="dropdown-email-signin-btn"
              >
                <LogIn size={13} />
                <span>Email Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenQuickAuth) {
                    onOpenQuickAuth("signup");
                  } else {
                    navigate("/signup");
                  }
                }}
                className="guest-register-btn"
                id="dropdown-register-btn"
              >
                <span>Create Account</span>
              </button>
            </div>
          </div>

          {/* Benefits of Signing In */}
          <div className="profile-dropdown-section">
            <span className="profile-section-title">Features with Account</span>
            <div className="guest-perks-list">
              <div className="perk-item">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>Permanent cloud backup for crop diagnostic scans</span>
              </div>
              <div className="perk-item">
                <FileText size={14} className="text-emerald-600 shrink-0" />
                <span>Multi-device access to farm advisory field notes</span>
              </div>
              <div className="perk-item">
                <TrendingUp size={14} className="text-emerald-600 shrink-0" />
                <span>Personalized APMC Mandi rates &amp; price alerts</span>
              </div>
            </div>
          </div>

          {/* Preferences for Guests */}
          <div className="profile-dropdown-section">
            <span className="profile-section-title">Preferences</span>
            <div className="profile-pref-row">
              <div className="pref-label-wrap">
                {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
                <span>Display Theme</span>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="profile-theme-switch-btn"
              >
                <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
              </button>
            </div>

            <div className="profile-helpline-box">
              <Phone size={14} className="text-emerald-600 shrink-0" />
              <div className="helpline-text">
                <span className="helpline-title">
                  Kisan Helpline (Toll-Free)
                </span>
                <a href="tel:18001801551" className="helpline-phone">
                  1800-180-1551
                </a>
              </div>
            </div>
          </div>

          <div className="profile-dropdown-footer">
            <Link
              href="/login"
              onClick={onClose}
              className="profile-full-login-link"
            >
              <span>Go to Full Sign In Page</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
