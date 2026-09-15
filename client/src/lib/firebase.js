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

// Merge static config with potential runtime VITE_ environment variables
const finalConfig = {
  projectId:
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_FIREBASE_PROJECT_ID) ||
    firebaseConfig.projectId,
  appId:
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_FIREBASE_APP_ID) ||
    firebaseConfig.appId,
  apiKey:
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_FIREBASE_API_KEY) ||
    firebaseConfig.apiKey,
  authDomain:
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) ||
    firebaseConfig.authDomain,
  firestoreDatabaseId:
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_FIREBASE_FIRESTORE_DATABASE_ID) ||
    firebaseConfig.firestoreDatabaseId ||
    "(default)",
  storageBucket:
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) ||
    firebaseConfig.storageBucket,
  messagingSenderId:
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) ||
    firebaseConfig.messagingSenderId,
  measurementId:
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID) ||
    firebaseConfig.measurementId ||
    "",
  oAuthClientId:
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_FIREBASE_OAUTH_CLIENT_ID) ||
    firebaseConfig.oAuthClientId ||
    "",
  recaptchaSiteKey:
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_FIREBASE_RECAPTCHA_SITE_KEY) ||
    firebaseConfig.recaptchaSiteKey ||
    "",
};

// Initialize Firebase App
const app = initializeApp(finalConfig);

// Initialize Firestore safely with graceful fallback to default
let firestoreDb;
try {
  if (
    finalConfig.firestoreDatabaseId &&
    finalConfig.firestoreDatabaseId !== "(default)"
  ) {
    firestoreDb = getFirestore(app, finalConfig.firestoreDatabaseId);
  } else {
    firestoreDb = getFirestore(app);
  }
} catch (e) {
  console.warn("Custom Firestore DB init failed, using default database:", e);
  firestoreDb = getFirestore(app);
}
export const db = firestoreDb;

// Auth instance
export const auth = getAuth(app);

// Google Auth Provider configured for maximum reliability
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
googleProvider.addScope("email");
googleProvider.addScope("profile");

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
  const currentHost =
    typeof window !== "undefined" ? window.location.hostname : "your domain";

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
    case "auth/popup-blocked":
      return "Google sign-in pop-up was blocked by your browser. Please allow popups for this site and try again.";
    case "auth/unauthorized-domain":
      return `Domain not authorized: "${currentHost}" is not in your Firebase Authorized Domains. Add "${currentHost}" in Firebase Console > Authentication > Settings > Authorized domains.`;
    case "auth/operation-not-allowed":
      return "Google Sign-in is not enabled in Firebase. Please enable 'Google' under Authentication > Sign-in method in Firebase Console.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email address. Please sign in using your existing account password.";
    case "auth/cancelled-popup-request":
      return "Sign-in request was cancelled.";
    case "auth/popup-closed-by-user":
      return "Sign-in pop-up was closed before completing.";
    case "auth/internal-error":
      return "Internal Firebase authentication error. Please try again or sign in with email.";
    case "auth/configuration-not-found":
      return "Firebase OAuth configuration not found. Please verify your Firebase project setup.";
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
      const msg =
        "Google sign-in pop-up was blocked by your browser. Please enable popups for this site and try again.";
      console.warn(msg);
      throw new Error(msg);
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
