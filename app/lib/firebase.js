import { initializeApp, getApps, getApp, setLogLevel } from 'firebase/app';
import { initializeFirestore, getFirestore, setLogLevel as setFirestoreLogLevel } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Silence verbose Firebase and Firestore internal connectivity log
try {
  setLogLevel('silent');
} catch {}

try {
  setFirestoreLogLevel('silent');
} catch {}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAkmidm20fPXeuJMZdBlTApuWe_3zz6KbA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "brosmotor-6a8fc.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "brosmotor-6a8fc",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "brosmotor-6a8fc.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "374594160201",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:374594160201:web:1ba0b9fa3dfca17b1f6198",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-N2NJV46DTC"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let firestoreInstance;
try {
  // Use HTTP long polling to prevent WebSocket/streaming issues in proxied/cloud environments
  firestoreInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    ignoreUndefinedProperties: true
  });
} catch {
  try {
    firestoreInstance = getFirestore(app);
  } catch {
    firestoreInstance = null;
  }
}

let storageInstance;
try {
  storageInstance = getStorage(app);
} catch {
  storageInstance = null;
}

export { app, firebaseConfig };
export const db = firestoreInstance;
export const auth = getAuth(app);
export const storage = storageInstance;
export const googleProvider = new GoogleAuthProvider();

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write'
};

export let isFirestorePermissionDenied = false;

export function handleFirestoreError(error, operationType, path) {
  // Ignore harmless user/browser aborts, network errors, or fetch errors
  if (
    error?.name === 'AbortError' ||
    (typeof error?.message === 'string' && (
      error.message.includes('aborted') ||
      error.message.includes('The user aborted a request') ||
      error.message.includes('failed to fetch') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('network') ||
      error.message.includes('offline') ||
      error.message.includes('unavailable')
    ))
  ) {
    return null;
  }

  const errorMsg = error instanceof Error ? error.message : String(error || '');
  const isPermissionIssue = 
    error?.code === 'permission-denied' ||
    errorMsg.includes('Missing or insufficient permissions') ||
    errorMsg.includes('permission');

  if (isPermissionIssue) {
    isFirestorePermissionDenied = true;
    if (typeof window !== 'undefined') {
      window.__FIREBASE_PERMISSION_DENIED__ = true;
    }
    // Return structured info without emitting console warnings that disrupt preview
    return {
      error: 'Permission pending - publish firestore.rules in Firebase Console',
      operationType,
      path
    };
  }

  const currentUser = auth.currentUser;
  const errInfo = {
    error: errorMsg,
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerInfo: currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  return errInfo;
}

export default app;
