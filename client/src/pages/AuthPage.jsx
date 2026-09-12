import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sprout,
  Cloud,
  ChevronLeft,
  Sparkles,
  LogOut,
  X,
} from "lucide-react";
import { useFirebase } from "../context/FirebaseContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import AgroSathiLogo from "../components/AgroSathiLogo.jsx";

export default function AuthPage({ mode = "login" }) {
  const [, navigate] = useLocation();
  const {
    user,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    signOut,
  } = useFirebase();

  const [isSignUp, setIsSignUp] = useState(mode === "signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // States for feedback & password reset
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    setIsSignUp(mode === "signup");
    setErrorMessage("");
    setSuccessMessage("");
  }, [mode]);

  const handleGoogleAuth = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);
    try {
      const loggedUser = await signInWithGoogle();
      if (loggedUser) {
        navigate("/user");
      }
    } catch (err) {
      setErrorMessage(err?.message || "Google sign in could not be completed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please fill in your email and password.");
      return;
    }

    if (isSignUp) {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      if (!fullName) {
        setErrorMessage("Please enter your first name.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        return;
      }

      setLoading(true);
      const res = await signUpWithEmail(email, password, fullName);
      setLoading(false);

      if (res.success) {
        setSuccessMessage(
          "Account created successfully! Welcome to Agro Sathi."
        );
        setTimeout(() => navigate("/user"), 900);
      } else {
        setErrorMessage(res.error || "Failed to create account.");
      }
    } else {
      setLoading(true);
      const res = await signInWithEmail(email, password);
      setLoading(false);

      if (res.success) {
        navigate("/user");
      } else {
        setErrorMessage(
          res.error || "Invalid email or password. Please try again."
        );
      }
    }
  };

  const handlePasswordResetSubmit = async e => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetLoading(true);
    const res = await sendPasswordReset(resetEmail.trim());
    setResetLoading(false);
    if (res.success) {
      setResetSent(true);
    } else {
      setErrorMessage(res.error || "Could not send password reset email.");
    }
  };

  return (
    <div className="auth-reference-viewport">
      {/* Outer Studio Frame matching the reference design */}
      <div className="auth-reference-card">
        {/* Top Floating App Bar */}
        <header className="auth-card-topbar">
          <Link
            href="/"
            className="auth-back-btn"
            title="Back to Agro Sathi home"
          >
            <ChevronLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <div className="auth-topbar-brand">
            <AgroSathiLogo size="sm" showTagline={false} />
          </div>

          <div className="auth-topbar-actions">
            <ThemeToggle showLabel={false} />
          </div>
        </header>

        {/* 2-Column Responsive Body */}
        <div className="auth-reference-split">
          {/* Left Column: Interactive Form or Active Account View */}
          <section className="auth-form-column">
            {user ? (
              /* Already Signed In Profile State */
              <div className="auth-logged-in-box">
                <div className="auth-user-avatar-wrap">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "Farmer"}
                      className="auth-user-avatar-img"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="auth-user-avatar-fallback">
                      {(user.displayName || user.email || "K")[0].toUpperCase()}
                    </span>
                  )}
                  <span className="auth-user-active-badge" />
                </div>

                <div className="auth-user-info-text">
                  <span className="auth-user-chip">
                    <CheckCircle2 size={13} /> Active Farmer Session
                  </span>
                  <h2 className="auth-user-name">
                    {user.displayName || "Kisan Farmer"}
                  </h2>
                  <p className="auth-user-email">{user.email}</p>
                </div>

                <div className="auth-user-action-btns">
                  <Link href="/user" className="auth-primary-action-btn">
                    <User size={16} />
                    <span>Go to Farmer Profile &amp; Sync Hub</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link href="/" className="auth-secondary-action-btn">
                    <Sprout size={16} />
                    <span>Return to Crop Doctor &amp; Home</span>
                  </Link>

                  <button
                    type="button"
                    onClick={signOut}
                    className="auth-signout-btn"
                  >
                    <LogOut size={14} />
                    <span>Sign Out &amp; Switch Account</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Standard Auth Form (Matches Uploaded Reference Layout) */
              <div className="auth-form-content">
                {/* Header Group (Sign Up / Create account - exactly as in reference) */}
                <div className="auth-heading-group">
                  <h1 className="auth-main-title">
                    {isSignUp ? "Sign Up" : "Sign In"}
                  </h1>
                  <p className="auth-sub-title">
                    {isSignUp ? (
                      <>
                        Create <span className="auth-accent-text">account</span>
                      </>
                    ) : (
                      <>
                        Welcome <span className="auth-accent-text">back</span>
                      </>
                    )}
                  </p>
                </div>

                {/* Error & Success Feedback Banners */}
                {errorMessage && (
                  <div className="auth-feedback-banner error" role="alert">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="auth-feedback-banner success" role="status">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="auth-fields-form">
                  {/* First Name & Last Name (Side by Side in Sign Up, matching reference) */}
                  {isSignUp && (
                    <div className="auth-input-grid-2">
                      <div className="auth-field-group">
                        <label
                          htmlFor="auth-first-name"
                          className="auth-input-label"
                        >
                          First name
                        </label>
                        <input
                          id="auth-first-name"
                          type="text"
                          required
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          placeholder="Ramesh"
                          className="auth-pill-input"
                          autoComplete="given-name"
                        />
                      </div>

                      <div className="auth-field-group">
                        <label
                          htmlFor="auth-last-name"
                          className="auth-input-label"
                        >
                          Last name
                        </label>
                        <input
                          id="auth-last-name"
                          type="text"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          placeholder="Patel"
                          className="auth-pill-input"
                          autoComplete="family-name"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="auth-field-group">
                    <label htmlFor="auth-email" className="auth-input-label">
                      Email
                    </label>
                    <input
                      id="auth-email"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="kisan@agrosathi.in"
                      className="auth-pill-input"
                      autoComplete="email"
                    />
                  </div>

                  {/* Password Input with Visibility Toggle */}
                  <div className="auth-field-group">
                    <div className="auth-label-row">
                      <label
                        htmlFor="auth-password"
                        className="auth-input-label"
                      >
                        Password
                      </label>
                      {!isSignUp && (
                        <button
                          type="button"
                          className="auth-forgot-link"
                          onClick={() => {
                            setResetEmail(email);
                            setShowResetModal(true);
                            setResetSent(false);
                          }}
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="auth-password-wrapper">
                      <input
                        id="auth-password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="auth-pill-input has-icon-right"
                        autoComplete={
                          isSignUp ? "new-password" : "current-password"
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="auth-eye-toggle-btn"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox (in Sign In mode) */}
                  {!isSignUp && (
                    <div className="auth-remember-row">
                      <label className="auth-checkbox-label">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={e => setRememberMe(e.target.checked)}
                          className="auth-custom-checkbox"
                        />
                        <span>Remember my device</span>
                      </label>
                    </div>
                  )}

                  {/* Primary Submit Button (Clean rounded pill, matching reference) */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit-pill-btn"
                    id="auth-primary-submit-btn"
                  >
                    {loading ? (
                      <span className="auth-btn-spinner-wrap">
                        <span className="auth-spinner" />
                        <span>Processing...</span>
                      </span>
                    ) : isSignUp ? (
                      "Create account"
                    ) : (
                      "Sign in"
                    )}
                  </button>

                  {/* Social Login Options (Side-by-side matching reference image) */}
                  <div className="auth-social-row">
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={loading}
                      className="auth-social-pill-btn google-btn"
                      title="Sign in with Google Account"
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
                        {isSignUp
                          ? "Sign Up with Google"
                          : "Sign In with Google"}
                      </span>
                    </button>
                  </div>

                  {/* Switch Mode Link (Already have an account? Login / Don't have an account? Sign up) */}
                  <div className="auth-switch-footer">
                    {isSignUp ? (
                      <p>
                        Already have an account?{" "}
                        <button
                          type="button"
                          className="auth-mode-switch-btn"
                          onClick={() => {
                            setIsSignUp(false);
                            setErrorMessage("");
                            setSuccessMessage("");
                          }}
                        >
                          Login
                        </button>
                      </p>
                    ) : (
                      <p>
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          className="auth-mode-switch-btn"
                          onClick={() => {
                            setIsSignUp(true);
                            setErrorMessage("");
                            setSuccessMessage("");
                          }}
                        >
                          Sign up
                        </button>
                      </p>
                    )}
                  </div>
                </form>

                {/* Cloud & Privacy Transparency Note */}
                <div className="auth-security-strip">
                  <ShieldCheck
                    size={14}
                    className="text-emerald-500 shrink-0"
                  />
                  <span>
                    Encrypted Firebase Cloud Storage · 100% Free Tier for
                    Farmers
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Right Column: High Aesthetic Agricultural Hero Landscape (Matching Reference) */}
          <section className="auth-visual-column" aria-hidden="true">
            <div className="auth-landscape-card">
              <img
                src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85"
                alt="Lush rolling green farm hills under bright sky"
                className="auth-landscape-image"
                referrerPolicy="no-referrer"
              />

              {/* Atmospheric Gradient Scrim */}
              <div className="auth-landscape-scrim" />

              {/* Floating Header Badge */}
              <div className="auth-landscape-top-badge">
                <span className="auth-glow-leaf">🌾</span>
                <span>Agro Sathi Kisan Platform</span>
              </div>

              {/* Bottom Editorial Card with Live Agri Cues */}
              <div className="auth-landscape-bottom-card">
                <div className="auth-quote-tag">
                  <Sparkles size={13} className="text-lime-300" />
                  <span>Precision AI for Bharat&apos;s Fields</span>
                </div>
                <h3 className="auth-landscape-heading">
                  Healthier Crops, Higher Yields &amp; Direct Mandi Insights.
                </h3>
                <p className="auth-landscape-sub">
                  Instant smartphone leaf diagnostics, integrated pest
                  management remedies, and real-time APMC market prices.
                </p>

                {/* 3 Metric Pills */}
                <div className="auth-metrics-row">
                  <div className="auth-metric-pill">
                    <strong>98.4%</strong>
                    <small>Model Accuracy</small>
                  </div>
                  <div className="auth-metric-divider" />
                  <div className="auth-metric-pill">
                    <strong>15+ States</strong>
                    <small>APMC Mandis</small>
                  </div>
                  <div className="auth-metric-divider" />
                  <div className="auth-metric-pill">
                    <strong>24/7</strong>
                    <small>Offline Scout Mode</small>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showResetModal && (
        <div
          className="auth-modal-overlay"
          onClick={() => setShowResetModal(false)}
        >
          <div
            className="auth-modal-window"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-password-title"
          >
            <div className="auth-modal-header">
              <div className="auth-modal-icon">
                <Mail size={20} className="text-emerald-600" />
              </div>
              <button
                type="button"
                className="auth-modal-close"
                onClick={() => setShowResetModal(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <h3 id="reset-password-title" className="auth-modal-title">
              Reset Your Password
            </h3>
            <p className="auth-modal-desc">
              Enter your registered Agro Sathi email address, and we will send
              you a secure Firebase link to restore your password.
            </p>

            {resetSent ? (
              <div className="auth-reset-sent-box">
                <div className="auth-feedback-banner success">
                  <CheckCircle2 size={16} />
                  <span>
                    Reset email sent! Please check your inbox or spam folder.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetSent(false);
                  }}
                  className="auth-submit-pill-btn mt-4"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={handlePasswordResetSubmit}
                className="auth-modal-form"
              >
                <div className="auth-field-group">
                  <label
                    htmlFor="reset-email-input"
                    className="auth-input-label"
                  >
                    Email address
                  </label>
                  <input
                    id="reset-email-input"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="farmer@agrosathi.in"
                    className="auth-pill-input"
                    autoFocus
                  />
                </div>

                <div className="auth-modal-actions">
                  <button
                    type="button"
                    className="auth-modal-cancel-btn"
                    onClick={() => setShowResetModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="auth-submit-pill-btn modal-submit"
                  >
                    {resetLoading ? "Sending Link..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
