// Admin Authentication & Session Management for 3BrosMotor 
import { auth, googleProvider } from './firebase';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';

export const DEMO_ADMIN_CREDENTIALS = {
  username: 'admin',
  email: 'admin@3brosmotor.com',
  password: 'admin123'
};

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
 * Friendly error messages for Firebase Authentication error codes
 */
export function getFirebaseErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Invalid credentials. Please verify your email and password.';
    case 'auth/user-not-found':
      return 'No administrator account found with this email in Firebase.';
    case 'auth/invalid-email':
      return 'The email address is improperly formatted.';
    case 'auth/user-disabled':
      return 'This administrator account has been disabled in Firebase Console.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to many failed login attempts. Please try again later or reset password.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase Console. Go to Firebase Console > Authentication > Sign-in method to enable it.';
    case 'auth/popup-closed-by-user':
      return 'Google Sign-In popup was closed before completing login.';
    case 'auth/popup-blocked':
      return 'Google Sign-In popup was blocked by browser. Please allow popups for this site.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Console under Authentication > Settings > Authorized domains.';
    default:
      return null;
  }
}

/**
 * Check if the admin is currently authenticated with a valid (unexpired) 24-hour session
 */
export function isUserAuthenticated() {
  if (typeof window === 'undefined') return false;
  try {
    const session = localStorage.getItem(STORAGE_KEY);
    if (session !== 'true') return false;

    // Verify 24-hour session expiration
    const expiryStr = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (expiryStr) {
      const expiresAt = parseInt(expiryStr, 10);
      if (Number.isNaN(expiresAt) || Date.now() >= expiresAt) {
        // 24-hour session expired: clear credentials and require re-authentication
        logoutAdmin();
        return false;
      }
    } else {
      // First session: initialize 24-hour timer from now
      localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_DURATION_MS));
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Get current admin user info
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
    email: 'admin@3brosmotor.com',
    displayName: 'Dealership Admin',
    provider: 'local'
  };
}

/**
 * Authenticate with Firebase Email & Password
 */
export async function authenticateWithFirebaseEmail(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Please enter both email and password.' };
  }

  // If Firebase is available, authenticate against Firebase Auth
  if (auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      if (typeof window !== 'undefined') {
        setAdminSession({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Administrator',
          photoURL: user.photoURL,
          provider: 'firebase-email'
        });
      }

      return { success: true, user };
    } catch (err) {
      const friendly = getFirebaseErrorMessage(err?.code);
      return { 
        success: false, 
        error: friendly || (err?.message ? `Firebase Auth error: ${err.message}` : 'Login failed')
      };
    }
  }

  // Local demo fallback if Firebase Auth instance is not initialized
  return authenticateAdmin(email, password);
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

    if (typeof window !== 'undefined') {
      setAdminSession({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Administrator',
        photoURL: user.photoURL,
        provider: 'google'
      });
    }

    return { success: true, user };
  } catch (err) {
    const friendly = getFirebaseErrorMessage(err?.code);
    return { 
      success: false, 
      error: friendly || (err?.message ? `Google Sign-in error: ${err.message}` : 'Google Sign-in failed')
    };
  }
}

/**
 * Local credential authenticate (demo / fallback)
 */
export function authenticateAdmin(userOrEmail, password) {
  if (!userOrEmail || !password) return { success: false, error: 'Please enter both username and password.' };
  
  const cleanInput = userOrEmail.trim().toLowerCase();
  const validUser = cleanInput === DEMO_ADMIN_CREDENTIALS.username || cleanInput === DEMO_ADMIN_CREDENTIALS.email;
  const validPass = password === DEMO_ADMIN_CREDENTIALS.password;

  if (validUser && validPass) {
    if (typeof window !== 'undefined') {
      setAdminSession({
        email: DEMO_ADMIN_CREDENTIALS.email,
        displayName: 'Demo Administrator',
        provider: 'demo'
      });
    }
    return { success: true };
  }

  return { 
    success: false, 
    error: 'Invalid username or password.' 
  };
}

/**
 * Log out administrator and clear Firebase & local session
 */
export async function logoutAdmin() {
  try {
    if (auth && auth.currentUser) {
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
 * Subscribe to auth state changes from Firebase
 */
export function subscribeToAuthChanges(callback) {
  if (!auth) {
    // If no Firebase auth, just report current local state
    callback(isUserAuthenticated() ? getAdminUser() : null);
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    if (user) {
      // Validate 24-hour expiration
      if (!isUserAuthenticated()) {
        logoutAdmin();
        callback(null);
        return;
      }
      if (typeof window !== 'undefined' && !localStorage.getItem(SESSION_EXPIRY_KEY)) {
        setAdminSession({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Administrator',
          photoURL: user.photoURL,
          provider: user.providerData?.[0]?.providerId || 'firebase'
        });
      }
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Administrator',
        photoURL: user.photoURL,
        provider: user.providerData?.[0]?.providerId || 'firebase'
      });
    } else {
      callback(null);
    }
  });
}
