// Admin Authentication & Session Management for 3BrosMotor Dealership
import { auth, googleProvider } from './firebase';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';

export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 Hours Security Session
const STORAGE_KEY = '3bros_admin_session_auth';
const SESSION_EXPIRY_KEY = '3bros_admin_session_expiry';
const USER_INFO_KEY = '3bros_admin_user_info';

export function isFirebaseConfigured() {
  return Boolean(auth);
}

/**
 * Record an authenticated session with an exact 24-hour expiration timestamp
 */
export function setAdminSession(userMetadata = {}) {
  if (typeof window === 'undefined') return;
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  localStorage.setItem(STORAGE_KEY, 'true');
  localStorage.setItem(SESSION_EXPIRY_KEY, String(expiresAt));
  if (userMetadata) {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userMetadata));
  }
}

/**
 * Get remaining hours left in the current 24-hour session
 */
export function getRemainingSessionHours() {
  if (typeof window === 'undefined') return 0;
  try {
    const expiryStr = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (!expiryStr) return 0;
    const expiresAt = parseInt(expiryStr, 10);
    const diffMs = expiresAt - Date.now();
    if (diffMs <= 0) return 0;
    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
  } catch {
    return 0;
  }
}

/**
 * Friendly error messages for Authentication error codes (neutral & secure)
 */
export function getFirebaseErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid credentials.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again in a few minutes.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    default:
      return 'Invalid credentials.';
  }
}

/**
 * Check if the admin is currently authenticated in Firebase
 */
export function isUserAuthenticated() {
  if (typeof window === 'undefined') return false;
  if (auth && auth.currentUser) return true;
  try {
    const session = localStorage.getItem(STORAGE_KEY);
    return session === 'true';
  } catch {
    return false;
  }
}

/**
 * Get current admin user info from Firebase
 */
export function getAdminUser() {
  if (auth && auth.currentUser) {
    return {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Administrator',
      photoURL: auth.currentUser.photoURL || null,
      provider: auth.currentUser.providerData?.[0]?.providerId || 'firebase'
    };
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(USER_INFO_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  return {
    email: '3brosmotor@gmail.com',
    displayName: 'Dealership Admin',
    provider: 'firebase'
  };
}

/**
 * Authenticate strictly with Firebase Email & Password
 */
export async function authenticateWithFirebaseEmail(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Please enter both email and password.' };
  }

  if (!auth) {
    return { success: false, error: 'Firebase is not initialized. Please verify your Firebase configuration.' };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    const adminInfo = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'Administrator',
      photoURL: user.photoURL,
      provider: 'firebase-email'
    };

    setAdminSession(adminInfo);
    return { success: true, user: adminInfo };
  } catch (err) {
    const friendly = getFirebaseErrorMessage(err?.code);
    return { 
      success: false, 
      error: friendly || 'Invalid credentials.'
    };
  }
}

/**
 * Authenticate with Google Provider (signInWithPopup)
 */
export async function authenticateWithFirebaseGoogle() {
  if (!auth) {
    return { success: false, error: 'Firebase is not initialized.' };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const adminInfo = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Administrator',
      photoURL: user.photoURL,
      provider: 'google'
    };

    setAdminSession(adminInfo);
    return { success: true, user: adminInfo };
  } catch (err) {
    const friendly = getFirebaseErrorMessage(err?.code);
    return { 
      success: false, 
      error: friendly || (err?.message ? `Google Sign-in error: ${err.message}` : 'Google Sign-in failed')
    };
  }
}

/**
 * Log out administrator and clear Firebase session
 */
export async function logoutAdmin() {
  try {
    if (auth) {
      await fbSignOut(auth);
    }
  } catch (e) {
    console.warn('Firebase signout error:', e);
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    localStorage.removeItem('3bros_admin_user');
  }
}

/**
 * Subscribe directly to Firebase Auth state changes (Single Source of Truth)
 */
export function subscribeToAuthChanges(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    if (user) {
      const adminInfo = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Administrator',
        photoURL: user.photoURL,
        provider: user.providerData?.[0]?.providerId || 'firebase'
      };
      setAdminSession(adminInfo);
      callback(adminInfo);
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SESSION_EXPIRY_KEY);
        localStorage.removeItem(USER_INFO_KEY);
      }
      callback(null);
    }
  });
}
