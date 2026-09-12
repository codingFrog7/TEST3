import React, { useState } from "react";
import { Link } from "wouter";
import {
  User,
  Mail,
  ShieldCheck,
  Cloud,
  LogOut,
  LogIn,
  UserPlus,
  Camera,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  Sprout,
  TrendingUp,
  MapPin,
  FileText,
  Copy,
  ExternalLink,
  ChevronRight,
  Edit3,
} from "lucide-react";
import { useFirebase } from "../context/FirebaseContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import AgroSathiLogo from "../components/AgroSathiLogo.jsx";

export default function UserPage() {
  const {
    user,
    signOut,
    scoutRecords,
    deleteScoutRecord,
    fieldNotes,
    addFieldNote,
    farmerProfile,
    updateFarmerProfile,
    syncStatus,
  } = useFirebase();

  const [activeTab, setActiveTab] = useState("scans"); // 'scans' | 'notes' | 'settings'
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteCrop, setNewNoteCrop] = useState("Chilli");
  const [savingNote, setSavingNote] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  // Edit profile state
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(
    farmerProfile?.displayName || user?.displayName || ""
  );
  const [editLocation, setEditLocation] = useState(
    farmerProfile?.location || "Karimnagar, Telangana"
  );
  const [editCrop, setEditCrop] = useState(
    farmerProfile?.primaryCrop || "Cotton"
  );
  const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);

  const handleCopyUid = () => {
    if (!user?.uid) return;
    navigator.clipboard.writeText(user.uid).then(() => {
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    });
  };

  const handleAddNote = async e => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setSavingNote(true);
    try {
      await addFieldNote({
        note: newNoteText.trim(),
        cropTag: newNoteCrop,
        authorName: user?.displayName || "Kisan Farmer",
      });
      setNewNoteText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleSaveProfile = async e => {
    e.preventDefault();
    try {
      await updateFarmerProfile({
        displayName: editName.trim() || user?.displayName || "Kisan Farmer",
        location: editLocation.trim(),
        primaryCrop: editCrop,
      });
      setEditMode(false);
      setSaveProfileSuccess(true);
      setTimeout(() => setSaveProfileSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="page-width page-shell" style={{ paddingBottom: "100px" }}>
      {/* Top Banner / Breadcrumb */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
              flexWrap: "wrap",
            }}
          >
            <AgroSathiLogo size="xs" showTagline={false} />
            <span
              style={{
                fontSize: "12px",
                color: "var(--muted-foreground)",
              }}
            >
              /
            </span>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 9px",
                borderRadius: "14px",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                background: "var(--muted)",
                color: "var(--muted-foreground)",
              }}
            >
              <Sprout size={12} />
              <span>Farmer Hub</span>
            </div>
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(24px, 3.5vw, 32px)",
              fontWeight: "800",
              letterSpacing: "-0.02em",
              color: "var(--foreground)",
            }}
          >
            {user ? "Kisan Account & Cloud Sync" : "Farmer Portal & Guest Hub"}
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "14px",
              color: "var(--muted-foreground)",
              maxWidth: "600px",
              lineHeight: 1.5,
            }}
          >
            {user
              ? "Your personal diagnostics archive, field spray records, and cloud backup linked with Firebase Free Tier."
              : "Explore in guest mode with instant leaf diagnosis, or sign in to sync your field history across devices."}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ThemeToggle />
          {user && (
            <button
              type="button"
              onClick={signOut}
              className="button button-outline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                fontSize: "13px",
                color: "var(--destructive, #b64b32)",
                borderColor: "var(--border)",
              }}
              title="Sign out of Agro Sathi"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STATE A: GUEST MODE (BEFORE LOGIN)                                        */}
      {/* ========================================================================= */}
      {!user ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Hero Guest Card */}
          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              padding: "clamp(20px, 4vw, 32px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "var(--muted)",
                  color: "var(--muted-foreground)",
                  display: "grid",
                  placeItems: "center",
                  border: "2px solid var(--border)",
                }}
              >
                <User size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "var(--foreground)",
                    }}
                  >
                    Guest Farmer Session
                  </h2>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "3px 8px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "600",
                      background: "rgba(245, 158, 11, 0.12)",
                      color: "#b45309",
                      border: "1px solid rgba(245, 158, 11, 0.25)",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#f59e0b",
                      }}
                    />
                    Not Signed In · Local Storage
                  </span>
                </div>
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: "13.5px",
                    color: "var(--muted-foreground)",
                    lineHeight: 1.5,
                  }}
                >
                  You have full public access to Agro Sathi&apos;s AI Crop
                  Doctor, Mandi Bhav rates, and agricultural tools. Sign in to
                  enable cloud persistence and sync your scout records across
                  phones and computers.
                </p>
              </div>
            </div>

            {/* Quick Login / Sign Up Actions */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                paddingTop: "16px",
                borderTop: "1px solid var(--border)",
              }}
            >
              <Link
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "700",
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <LogIn size={16} strokeWidth={2.4} />
                <span>Sign In to Your Account</span>
              </Link>

              <Link
                href="/signup"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  background: "var(--card)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                }}
              >
                <UserPlus size={16} />
                <span>Create Free Farmer Account</span>
              </Link>
            </div>
          </div>

          {/* Feature Unlock Highlights */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "16px",
            }}
          >
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "#059669",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: "12px",
                }}
              >
                <Cloud size={18} />
              </div>
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                Firebase Cloud Sync
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "var(--muted-foreground)",
                  lineHeight: 1.5,
                }}
              >
                Every leaf diagnosis, severity score, and spray schedule is
                securely saved in the cloud. Check results on any device.
              </p>
            </div>

            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(37, 99, 235, 0.12)",
                  color: "#2563eb",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: "12px",
                }}
              >
                <FileText size={18} />
              </div>
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                Personal Field Log
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "var(--muted-foreground)",
                  lineHeight: 1.5,
                }}
              >
                Record your field spray dates, fertilizer dosages, and agronomic
                reminders with one-tap cloud sync.
              </p>
            </div>

            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(234, 88, 12, 0.12)",
                  color: "#ea580c",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: "12px",
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                100% Free Forever
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "var(--muted-foreground)",
                  lineHeight: 1.5,
                }}
              >
                Operates on Google Cloud Firebase Free Tier. No subscription, no
                hidden fees, and your farm records remain private.
              </p>
            </div>
          </div>

          {/* Quick Jump to App Features */}
          <div
            style={{
              background: "var(--muted)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h4
                style={{
                  margin: "0 0 4px",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                Want to run a diagnostic right now?
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "var(--muted-foreground)",
                }}
              >
                Guest mode allows live camera scanning and instant IPM leaf
                pathology remedies.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Link
                href="/detect"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  textDecoration: "none",
                }}
              >
                <Camera size={14} /> Scan Crop Now
              </Link>
              <Link
                href="/mandi"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  background: "var(--card)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                }}
              >
                <TrendingUp size={14} /> Mandi Rates
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* STATE B: LOGGED IN FARMER (AFTER LOGIN)                                  */
        /* ========================================================================= */
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Profile Header Card */}
          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              padding: "clamp(20px, 4vw, 32px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  flexWrap: "wrap",
                }}
              >
                {/* Avatar with status indicator */}
                <div style={{ position: "relative" }}>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "Farmer"}
                      style={{
                        width: "68px",
                        height: "68px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid var(--primary)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "68px",
                        height: "68px",
                        borderRadius: "50%",
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "24px",
                        fontWeight: "800",
                        border: "3px solid var(--border)",
                      }}
                    >
                      {(user.displayName || user.email || "K")[0].toUpperCase()}
                    </div>
                  )}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      right: "2px",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: "#10b981",
                      border: "2px solid var(--card)",
                    }}
                    title="Active Cloud Session"
                  />
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "22px",
                        fontWeight: "800",
                        color: "var(--foreground)",
                      }}
                    >
                      {farmerProfile?.displayName ||
                        user.displayName ||
                        user.email?.split("@")[0] ||
                        "Kisan Farmer"}
                    </h2>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "700",
                        background: "rgba(16, 185, 129, 0.12)",
                        color: "#047857",
                        border: "1px solid rgba(16, 185, 129, 0.25)",
                      }}
                    >
                      <Cloud size={11} />
                      Firebase Cloud Connected
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      marginTop: "6px",
                      flexWrap: "wrap",
                      fontSize: "13px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Mail size={13} /> {user.email}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <MapPin size={13} />{" "}
                      {farmerProfile?.location || "Karimnagar, Telangana"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href="/detect"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "700",
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    textDecoration: "none",
                  }}
                >
                  <Camera size={14} /> Scan Crop
                </Link>

                <button
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    background: "var(--card)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                  }}
                >
                  <Edit3 size={14} />{" "}
                  {editMode ? "Close Settings" : "Edit Profile"}
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
                gap: "12px",
                paddingTop: "16px",
                borderTop: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "var(--muted)",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                  }}
                >
                  Scout Diagnoses
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "800",
                    color: "var(--primary)",
                    marginTop: "2px",
                  }}
                >
                  {scoutRecords.length}
                </div>
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "var(--muted)",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                  }}
                >
                  Field Notes
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "800",
                    color: "var(--foreground)",
                    marginTop: "2px",
                  }}
                >
                  {fieldNotes.length}
                </div>
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "var(--muted)",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                  }}
                >
                  Primary Crop
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "var(--foreground)",
                    marginTop: "4px",
                  }}
                >
                  {farmerProfile?.primaryCrop || "Cotton"}
                </div>
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "var(--muted)",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                  }}
                >
                  Sync Health
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#059669",
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <CheckCircle2 size={14} /> Ready (Free Tier)
                </div>
              </div>
            </div>

            {/* Inline Profile Editor */}
            {editMode && (
              <form
                onSubmit={handleSaveProfile}
                style={{
                  padding: "18px",
                  background: "var(--muted)",
                  borderRadius: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "var(--foreground)",
                  }}
                >
                  Update Farmer Preferences
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px",
                  }}
                >
                  <div>
                    <label
                      htmlFor="user-profile-name-input"
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: "600",
                        marginBottom: "4px",
                      }}
                    >
                      Farmer Display Name
                    </label>
                    <input
                      id="user-profile-name-input"
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                        color: "var(--foreground)",
                        boxSizing: "border-box",
                      }}
                      placeholder="e.g. Ramesh Reddy"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="user-profile-location-input"
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: "600",
                        marginBottom: "4px",
                      }}
                    >
                      Farm Location / District
                    </label>
                    <input
                      id="user-profile-location-input"
                      type="text"
                      value={editLocation}
                      onChange={e => setEditLocation(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                        color: "var(--foreground)",
                        boxSizing: "border-box",
                      }}
                      placeholder="e.g. Karimnagar, Telangana"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="user-profile-crop-select"
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: "600",
                        marginBottom: "4px",
                      }}
                    >
                      Primary Crop
                    </label>
                    <select
                      id="user-profile-crop-select"
                      value={editCrop}
                      onChange={e => setEditCrop(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                        color: "var(--foreground)",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="Cotton">Cotton (పత్తి)</option>
                      <option value="Chilli">Chilli / Pepper (మిర్చి)</option>
                      <option value="Tomato">Tomato (టమోటా)</option>
                      <option value="Paddy">Paddy / Rice (వరి)</option>
                      <option value="Wheat">Wheat (గోధుమలు)</option>
                      <option value="Soybean">Soybean (సోయాబీన్)</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <button
                    type="submit"
                    style={{
                      padding: "7px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "700",
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      background: "transparent",
                      color: "var(--muted-foreground)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  {saveProfileSuccess && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#059669",
                        fontWeight: "600",
                      }}
                    >
                      Profile updated!
                    </span>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Navigation Tabs for User Data */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "8px",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("scans")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "700",
                background:
                  activeTab === "scans" ? "var(--primary)" : "transparent",
                color:
                  activeTab === "scans"
                    ? "var(--primary-foreground)"
                    : "var(--muted-foreground)",
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Camera size={14} />
              <span>Saved Leaf Scans ({scoutRecords.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("notes")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "700",
                background:
                  activeTab === "notes" ? "var(--primary)" : "transparent",
                color:
                  activeTab === "notes"
                    ? "var(--primary-foreground)"
                    : "var(--muted-foreground)",
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FileText size={14} />
              <span>Field Notes ({fieldNotes.length})</span>
            </button>
          </div>

          {/* Tab 1: Scout Records Archive */}
          {activeTab === "scans" && (
            <div>
              {scoutRecords.length === 0 ? (
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px dashed var(--border)",
                    borderRadius: "16px",
                    padding: "48px 24px",
                    textAlign: "center",
                  }}
                >
                  <Camera
                    size={36}
                    style={{
                      color: "var(--muted-foreground)",
                      margin: "0 auto 12px",
                      display: "block",
                    }}
                  />
                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontSize: "17px",
                      fontWeight: "700",
                    }}
                  >
                    No Saved Leaf Diagnoses Yet
                  </h3>
                  <p
                    style={{
                      margin: "0 0 18px",
                      fontSize: "13.5px",
                      color: "var(--muted-foreground)",
                      maxWidth: "400px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    Whenever you scan an affected leaf in Crop Doctor and tap
                    &quot;Save to Field Log&quot;, it will automatically sync
                    here in your cloud archive.
                  </p>
                  <Link
                    href="/detect"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "700",
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                      textDecoration: "none",
                    }}
                  >
                    <Camera size={16} /> Open Crop Doctor Scanner
                  </Link>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
                    gap: "16px",
                  }}
                >
                  {scoutRecords.map(rec => (
                    <div
                      key={rec.id}
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "14px",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "700",
                              background: "var(--muted)",
                              color: "var(--foreground)",
                              marginBottom: "4px",
                            }}
                          >
                            {rec.crop}
                          </span>
                          <h4
                            style={{
                              margin: 0,
                              fontSize: "16px",
                              fontWeight: "700",
                              color: "var(--foreground)",
                            }}
                          >
                            {rec.disease}
                          </h4>
                          {rec.scientific && (
                            <small
                              style={{
                                fontStyle: "italic",
                                color: "var(--muted-foreground)",
                                fontSize: "12px",
                              }}
                            >
                              {rec.scientific}
                            </small>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteScoutRecord(rec.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--muted-foreground)",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "6px",
                          }}
                          title="Delete this record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Severity meter */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: "12px",
                        }}
                      >
                        <span style={{ color: "var(--muted-foreground)" }}>
                          Severity Level:
                        </span>
                        <span
                          style={{
                            fontWeight: "700",
                            color:
                              rec.severity >= 4
                                ? "#dc2626"
                                : rec.severity >= 3
                                  ? "#ea580c"
                                  : "#10b981",
                          }}
                        >
                          Level {rec.severity} of 5
                        </span>
                      </div>

                      {rec.remedy && (
                        <div
                          style={{
                            fontSize: "12.5px",
                            color: "var(--foreground)",
                            background: "var(--muted)",
                            padding: "10px",
                            borderRadius: "8px",
                            lineHeight: 1.45,
                          }}
                        >
                          <b>Remedy:</b> {rec.remedy}
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "11px",
                          color: "var(--muted-foreground)",
                          paddingTop: "8px",
                          borderTop: "1px solid var(--border)",
                        }}
                      >
                        <span>
                          {rec.date} {rec.time ? `· ${rec.time}` : ""}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            color: "#059669",
                          }}
                        >
                          <Cloud size={11} /> Cloud Backed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Field Notes */}
          {activeTab === "notes" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              {/* New note input form */}
              <form
                onSubmit={handleAddNote}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "var(--foreground)",
                  }}
                >
                  Write a Quick Field Observation or Spray Note
                </h4>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <select
                    id="new-note-crop-select"
                    value={newNoteCrop}
                    onChange={e => setNewNoteCrop(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                      color: "var(--foreground)",
                      fontSize: "13px",
                    }}
                  >
                    <option value="Chilli">Chilli</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Paddy">Paddy</option>
                    <option value="General">General Field</option>
                  </select>
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    placeholder="e.g. Applied Neem oil 1500ppm on Plot B at 5:30 PM..."
                    style={{
                      flex: 1,
                      minWidth: "220px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                      color: "var(--foreground)",
                      fontSize: "13px",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={savingNote || !newNoteText.trim()}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "700",
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                      border: "none",
                      cursor: "pointer",
                      opacity: savingNote || !newNoteText.trim() ? 0.6 : 1,
                    }}
                  >
                    {savingNote ? "Saving..." : "Save Note"}
                  </button>
                </div>
              </form>

              {/* Notes list */}
              {fieldNotes.length === 0 ? (
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px dashed var(--border)",
                    borderRadius: "14px",
                    padding: "32px 20px",
                    textAlign: "center",
                    color: "var(--muted-foreground)",
                    fontSize: "13.5px",
                  }}
                >
                  No field notes saved yet. Add your first note above!
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {fieldNotes.map(n => (
                    <div
                      key={n.id}
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        padding: "14px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "10.5px",
                            fontWeight: "700",
                            background: "var(--muted)",
                            color: "var(--foreground)",
                            marginBottom: "4px",
                          }}
                        >
                          {n.cropTag || "General"}
                        </span>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "var(--foreground)",
                            lineHeight: 1.4,
                          }}
                        >
                          {n.note}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--muted-foreground)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {n.authorName || "Kisan"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Account & Session Details Footer Card */}
          <div
            style={{
              background: "var(--muted)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "12px",
              color: "var(--muted-foreground)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <span>User ID:</span>
              <code
                style={{
                  background: "var(--card)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  border: "1px solid var(--border)",
                  fontSize: "11px",
                }}
              >
                {user.uid.slice(0, 16)}...
              </code>
              <button
                type="button"
                onClick={handleCopyUid}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--foreground)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Copy size={12} />
                <span>{copiedUid ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <ShieldCheck size={14} className="text-emerald-500" />
                Firebase Auth &amp; Firestore
              </span>
              <button
                type="button"
                onClick={signOut}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--destructive, #b64b32)",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <LogOut size={12} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
