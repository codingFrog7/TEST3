import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { useFirebase } from "../context/FirebaseContext.jsx";

export default function QuickAuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}) {
  const [, navigate] = useLocation();
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
  } = useFirebase();

  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot'
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const loggedUser = await signInWithGoogle();
      if (loggedUser) {
        setSuccessMsg("Signed in successfully with Google!");
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err) {
      setErrorMsg(err?.message || "Google sign-in could not be completed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (mode === "forgot") {
      if (!email.trim()) {
        setErrorMsg("Please enter your registered email address.");
        return;
      }
      setLoading(true);
      const res = await sendPasswordReset(email.trim());
      setLoading(false);
      if (res.success) {
        setSuccessMsg("Password reset link sent to your email!");
      } else {
        setErrorMsg(res.error || "Failed to send password reset email.");
      }
      return;
    }

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    if (mode === "signup") {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      if (!fullName) {
        setErrorMsg("Please enter your name.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }

      setLoading(true);
      const res = await signUpWithEmail(email, password, fullName);
      setLoading(false);

      if (res.success) {
        setSuccessMsg("Account created! Welcome to Agro Sathi.");
        setTimeout(() => {
          onClose();
        }, 700);
      } else {
        setErrorMsg(res.error || "Failed to create account.");
      }
    } else {
      setLoading(true);
      const res = await signInWithEmail(email, password);
      setLoading(false);

      if (res.success) {
        setSuccessMsg("Welcome back to your Kisan Portal!");
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setErrorMsg(
          res.error || "Invalid credentials. Please verify and try again."
        );
      }
    }
  };

  return (
    <div
      className="quick-auth-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-auth-title"
    >
      <div className="quick-auth-card" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="quick-auth-header">
          <div className="quick-auth-brand-badge">
            <span className="quick-auth-icon-circle">
              <Sprout size={18} />
            </span>
            <div>
              <h2 id="quick-auth-title" className="quick-auth-title">
                {mode === "login"
                  ? "Sign In to Agro Sathi"
                  : mode === "signup"
                    ? "Create Farmer Account"
                    : "Reset Password"}
              </h2>
              <p className="quick-auth-sub">
                {mode === "login"
                  ? "Access your crop scans, notes & advisory"
                  : mode === "signup"
                    ? "Join thousands of smart farmers"
                    : "We'll send you a password recovery link"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="quick-auth-close-btn"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Feedback Banners */}
        {errorMsg && (
          <div className="quick-auth-alert error" role="alert">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="quick-auth-alert success" role="status">
            <CheckCircle2 size={15} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1-Click Google Sign In */}
        {mode !== "forgot" && (
          <>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="quick-auth-google-btn"
              id="quick-auth-google-action"
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
              <span>Continue with Google</span>
            </button>

            <div className="quick-auth-divider">
              <span>or continue with email</span>
            </div>
          </>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="quick-auth-form">
          {mode === "signup" && (
            <div className="quick-auth-name-row">
              <div className="quick-auth-input-group">
                <label htmlFor="quick-first-name">First Name</label>
                <input
                  id="quick-first-name"
                  type="text"
                  required
                  placeholder="Ramesh"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="quick-auth-input"
                  autoComplete="given-name"
                />
              </div>
              <div className="quick-auth-input-group">
                <label htmlFor="quick-last-name">Last Name</label>
                <input
                  id="quick-last-name"
                  type="text"
                  placeholder="Patel"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="quick-auth-input"
                  autoComplete="family-name"
                />
              </div>
            </div>
          )}

          <div className="quick-auth-input-group">
            <label htmlFor="quick-email">Email Address</label>
            <div className="quick-auth-input-wrap">
              <Mail size={16} className="quick-auth-input-icon" />
              <input
                id="quick-email"
                type="email"
                required
                placeholder="farmer@agrosathi.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="quick-auth-input has-icon"
                autoComplete="email"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div className="quick-auth-input-group">
              <div className="quick-auth-label-between">
                <label htmlFor="quick-password">Password</label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="quick-auth-text-link"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="quick-auth-input-wrap">
                <Lock size={16} className="quick-auth-input-icon" />
                <input
                  id="quick-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="quick-auth-input has-icon has-icon-right"
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="quick-auth-eye-btn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="quick-auth-submit-btn"
            id="quick-auth-submit-action"
          >
            {loading ? (
              <span className="quick-auth-loading-wrap">
                <span className="quick-auth-spinner" />
                <span>Processing...</span>
              </span>
            ) : mode === "login" ? (
              "Sign In"
            ) : mode === "signup" ? (
              "Create Account"
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Modal Footer Toggle */}
        <div className="quick-auth-footer">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="quick-auth-switch-mode"
              >
                Sign up free
              </button>
            </p>
          ) : mode === "signup" ? (
            <p>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="quick-auth-switch-mode"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="quick-auth-switch-mode"
              >
                Back to Sign In
              </button>
            </p>
          )}

          <div className="quick-auth-full-link-wrap">
            <Link
              href={mode === "signup" ? "/signup" : "/login"}
              onClick={onClose}
              className="quick-auth-full-page-link"
            >
              <span>Open Full Authentication Page</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
