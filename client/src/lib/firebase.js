import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDocFromServer, getFirestore } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with custom databaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Auth instance
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export const OperationType = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  LIST: "list",
  GET: "get",
  WRITE: "write",
};

/**
 * Translates Firebase Auth error codes into clear farmer-friendly messages
 */
export function getFriendlyAuthErrorMessage(error) {
  const code = error?.code || "";
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Please sign in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/user-not-found":
      return "No account found with this email. Please check your spelling or sign up.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again or use password reset.";
    case "auth/invalid-credential":
      return "Invalid email or password credentials. Please verify and try again.";
    case "auth/too-many-requests":
      return "Too many sign-in attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return error?.message || "Authentication failed. Please try again.";
  }
}

/**
 * Handles Firestore error formatting per specification
 */
export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo:
        auth.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validate connection to Firestore on boot
 */
export async function testConnection(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await getDocFromServer(doc(db, "test", "connection"));
      console.log("Firestore connection test passed.");
      return true;
    } catch (error) {
      const isTransient =
        error?.code === "unavailable" ||
        (error instanceof Error &&
          (error.message.includes("unavailable") ||
            error.message.includes("Could not reach Cloud Firestore backend")));

      if (isTransient && attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * attempt));
        continue;
      }

      if (
        error instanceof Error &&
        error.message.includes("the client is offline")
      ) {
        console.error("Please check your Firebase configuration.");
        return false;
      }
      // Expected when permission rules deny or doc doesn't exist, still indicates server responded
      return true;
    }
  }
  return true;
}

// Run connection test on module load
if (typeof window !== "undefined") {
  setTimeout(() => {
    testConnection();
  }, 300);
} else {
  testConnection();
}

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    const code = err?.code || "";
    // User intentionally closed or cancelled the popup - expected user interaction, not a runtime failure
    if (
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request"
    ) {
      console.info("Google sign-in popup closed by user.");
      return null;
    }
    if (code === "auth/popup-blocked") {
      console.warn(
        "Google sign-in popup was blocked by the browser. Please allow popups for this site."
      );
      return null;
    }
    console.error("Google sign in error:", err);
    throw err;
  }
}

export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    return userCredential.user;
  } catch (err) {
    throw err;
  }
}

export async function registerWithEmail(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: displayName.trim(),
      });
    }
    return userCredential.user;
  } catch (err) {
    throw err;
  }
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return true;
  } catch (err) {
    throw err;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Sign out error:", err);
    throw err;
  }
}
