import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import {
  auth,
  db,
  handleFirestoreError,
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  resetPassword,
  logoutUser,
  getFriendlyAuthErrorMessage,
  OperationType,
} from "../lib/firebase.js";

const FirebaseContext = createContext(null);

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [firestoreConnected, setFirestoreConnected] = useState(true);
  const [scoutRecords, setScoutRecords] = useState([]);
  const [fieldNotes, setFieldNotes] = useState([]);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [syncStatus, setSyncStatus] = useState("ready"); // 'ready' | 'syncing' | 'error'
  const [syncError, setSyncError] = useState(null);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      currentUser => {
        setUser(currentUser);
        setAuthLoading(false);
      },
      err => {
        console.error("Auth observer error:", err);
        setAuthLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Listen to Firestore scout_records & field_notes when user is signed in
  useEffect(() => {
    if (!user) {
      // If unauthenticated, populate from local storage for offline continuity
      try {
        const localScout = JSON.parse(
          localStorage.getItem("agro_scout_history") || "[]"
        );
        setScoutRecords(localScout);
      } catch (e) {
        console.warn("Error reading local scout history", e);
      }
      setFieldNotes([]);
      setFarmerProfile(null);
      return;
    }

    setSyncStatus("syncing");

    // 1. Scout Records Query
    const scoutPath = "scout_records";
    let unsubScout = () => { };
    try {
      const q = query(
        collection(db, scoutPath),
        where("userId", "==", user.uid)
      );

      unsubScout = onSnapshot(
        q,
        snapshot => {
          const records = snapshot.docs.map(d => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              // Convert server timestamp or fallback
              date:
                data.date ||
                (data.createdAt?.toDate
                  ? data.createdAt.toDate().toLocaleDateString("en-IN")
                  : "Today"),
              time:
                data.time ||
                (data.createdAt?.toDate
                  ? data.createdAt.toDate().toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : ""),
            };
          });
          // Sort newest first
          records.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
          });
          setScoutRecords(records);
          setSyncStatus("ready");
        },
        error => {
          setSyncStatus("error");
          setSyncError(error.message);
          handleFirestoreError(error, OperationType.LIST, scoutPath);
        }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, scoutPath);
    }

    // 2. Field Notes Query
    const notesPath = "field_notes";
    let unsubNotes = () => { };
    try {
      const qNotes = query(
        collection(db, notesPath),
        where("userId", "==", user.uid)
      );

      unsubNotes = onSnapshot(
        qNotes,
        snapshot => {
          const notes = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data(),
          }));
          notes.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
          });
          setFieldNotes(notes);
        },
        error => {
          handleFirestoreError(error, OperationType.LIST, notesPath);
        }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, notesPath);
    }

    // 3. Farmer Profile Doc
    const profilePath = `farmer_profiles/${user.uid}`;
    let unsubProfile = () => { };
    try {
      const profileRef = doc(db, "farmer_profiles", user.uid);
      unsubProfile = onSnapshot(
        profileRef,
        docSnap => {
          if (docSnap.exists()) {
            setFarmerProfile(docSnap.data());
          } else {
            // Create default profile if not exists
            const initialProfile = {
              userId: user.uid,
              displayName: user.displayName || "Kisan Farmer",
              location: "Karimnagar, Telangana",
              primaryCrop: "Cotton",
              updatedAt: serverTimestamp(),
            };
            setDoc(profileRef, initialProfile).catch(e =>
              handleFirestoreError(e, OperationType.CREATE, profilePath)
            );
          }
        },
        error => {
          handleFirestoreError(error, OperationType.GET, profilePath);
        }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, profilePath);
    }

    return () => {
      unsubScout();
      unsubNotes();
      unsubProfile();
    };
  }, [user]);

  // Save a crop diagnostic scan
  const saveScoutRecord = async record => {
    setSyncStatus("syncing");
    if (!user) {
      // Unauthenticated fallback: save to localStorage
      const localEntry = {
        id: "local_" + Date.now(),
        crop: record.crop,
        disease: record.disease,
        scientific: record.scientific || "",
        severity: record.severity,
        remedy: record.remedy || "",
        date:
          record.date ||
          new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        time:
          record.time ||
          new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
      };
      const updated = [localEntry, ...scoutRecords.slice(0, 9)];
      setScoutRecords(updated);
      try {
        localStorage.setItem("agro_scout_history", JSON.stringify(updated));
      } catch (e) {
        console.warn("Storage write failed", e);
      }
      setSyncStatus("ready");
      return localEntry;
    }

    // Authenticated: Write to Firestore
    const recordId =
      "scout_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    const docPath = `scout_records/${recordId}`;
    try {
      const docRef = doc(db, "scout_records", recordId);
      const payload = {
        userId: user.uid,
        crop: String(record.crop || "Unknown").slice(0, 50),
        disease: String(record.disease || "Health check").slice(0, 100),
        scientific: String(record.scientific || "").slice(0, 100),
        severity: Number(record.severity) || 1,
        remedy: String(record.remedy || "").slice(0, 500),
        date: String(record.date || "").slice(0, 50),
        time: String(record.time || "").slice(0, 50),
        createdAt: serverTimestamp(),
      };
      await setDoc(docRef, payload);
      setSyncStatus("ready");
      return { id: recordId, ...payload };
    } catch (error) {
      setSyncStatus("error");
      setSyncError(error.message);
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }
  };

  // Delete a scout record
  const deleteScoutRecord = async recordId => {
    if (!user) {
      const updated = scoutRecords.filter(r => r.id !== recordId);
      setScoutRecords(updated);
      localStorage.setItem("agro_scout_history", JSON.stringify(updated));
      return;
    }

    const docPath = `scout_records/${recordId}`;
    try {
      await deleteDoc(doc(db, "scout_records", recordId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  };

  // Add field advisory note
  const addFieldNote = async ({ note, authorName, cropTag }) => {
    if (!user) {
      alert("Please sign in with Google to save notes to Firebase Cloud.");
      return null;
    }
    const noteId =
      "note_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    const docPath = `field_notes/${noteId}`;
    try {
      const docRef = doc(db, "field_notes", noteId);
      const payload = {
        userId: user.uid,
        note: String(note).slice(0, 1000),
        authorName: String(
          authorName || user.displayName || "Kisan Farmer"
        ).slice(0, 100),
        cropTag: String(cropTag || "General").slice(0, 50),
        createdAt: serverTimestamp(),
      };
      await setDoc(docRef, payload);
      return { id: noteId, ...payload };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }
  };

  // Update farmer profile
  const updateFarmerProfile = async updates => {
    if (!user) return;
    const docPath = `farmer_profiles/${user.uid}`;
    try {
      const docRef = doc(db, "farmer_profiles", user.uid);
      const payload = {
        userId: user.uid,
        displayName: String(
          updates.displayName || user.displayName || "Kisan Farmer"
        ).slice(0, 100),
        location: String(updates.location || "Karimnagar, Telangana").slice(
          0,
          100
        ),
        primaryCrop: String(updates.primaryCrop || "Cotton").slice(0, 50),
        updatedAt: serverTimestamp(),
      };
      await setDoc(docRef, payload, { merge: true });
      setFarmerProfile(payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
  };

  const handleSignIn = async () => {
    try {
      setSyncStatus("syncing");
      setSyncError(null);
      const loggedUser = await loginWithGoogle();
      if (!loggedUser) {
        // User closed or cancelled the popup
        setSyncStatus("ready");
        return null;
      }
      setSyncStatus("ready");
      return loggedUser;
    } catch (err) {
      const code = err?.code || "";
      if (
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request" ||
        code === "auth/popup-blocked"
      ) {
        setSyncStatus("ready");
        setSyncError(null);
        return null;
      }
      setSyncStatus("error");
      setSyncError(err?.message || "Failed to sign in");
      console.error("Sign in failed", err);
      return null;
    }
  };

  const handleEmailSignIn = async (email, password) => {
    setSyncStatus("syncing");
    setSyncError(null);
    try {
      const loggedUser = await loginWithEmail(email, password);
      setSyncStatus("ready");
      return { success: true, user: loggedUser };
    } catch (err) {
      setSyncStatus("error");
      const friendlyMessage = getFriendlyAuthErrorMessage(err);
      setSyncError(friendlyMessage);
      return { success: false, error: friendlyMessage };
    }
  };

  const handleEmailSignUp = async (email, password, displayName) => {
    setSyncStatus("syncing");
    setSyncError(null);
    try {
      const newUser = await registerWithEmail(email, password, displayName);
      setSyncStatus("ready");
      return { success: true, user: newUser };
    } catch (err) {
      setSyncStatus("error");
      const friendlyMessage = getFriendlyAuthErrorMessage(err);
      setSyncError(friendlyMessage);
      return { success: false, error: friendlyMessage };
    }
  };

  const handlePasswordReset = async email => {
    try {
      await resetPassword(email);
      return { success: true };
    } catch (err) {
      const friendlyMessage = getFriendlyAuthErrorMessage(err);
      return { success: false, error: friendlyMessage };
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setUser(null);
      setScoutRecords([]);
      setFieldNotes([]);
      setFarmerProfile(null);
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        authLoading,
        firestoreConnected,
        scoutRecords,
        fieldNotes,
        farmerProfile,
        syncStatus,
        syncError,
        saveScoutRecord,
        deleteScoutRecord,
        addFieldNote,
        updateFarmerProfile,
        signInWithGoogle: handleSignIn,
        signInWithEmail: handleEmailSignIn,
        signUpWithEmail: handleEmailSignUp,
        sendPasswordReset: handlePasswordReset,
        getFriendlyError: getFriendlyAuthErrorMessage,
        signOut: handleSignOut,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}
