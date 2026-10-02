// 3BrosMotor Dealership Admin Data Store
// Manages Expenses, Sales, Calendar Events, Reminders, Notes, and Setting with Firebase Firestore Cloud Sync

import { db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';

const EXPENSES_STORAGE_KEY = '3bros_admin_expenses';
const SOLD_STORAGE_KEY = '3bros_admin_sold';
const CALENDAR_STORAGE_KEY = '3bros_admin_calendar';
const REMINDERS_STORAGE_KEY = '3bros_admin_reminders';
const NOTES_STORAGE_KEY = '3bros_admin_notes';
const SETTINGS_STORAGE_KEY = '3bros_admin_settings';

export const ADMIN_EVENT = '3bros_admin_state_updated';

function triggerEvent() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ADMIN_EVENT));
  }
}

// Client-side image compression for avatars and thumbnails
export function compressImage(fileOrDataUrl, maxWidth = 320, quality = 0.82) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
      return;
    }

    const processImg = (imgSrc) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(imgSrc);
      img.src = imgSrc;
    };

    if (typeof fileOrDataUrl === 'string') {
      processImg(fileOrDataUrl);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        processImg(e.target?.result);
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

// Clean production baseline: no mock or demo data
const INITIAL_EXPENSES = [];
const INITIAL_SOLD = [];
const INITIAL_CALENDAR = [];
const INITIAL_REMINDERS = [];
const INITIAL_NOTES = [];

const INITIAL_SETTINGS = {
  directorName: 'Hammad Riaz',
  dealershipName: '3BrosMotor .LTD',
  primaryLocation: 'Dar es Salaam, Tanzania',
  portOffice: 'Kurasini Port View, Dar es Salaam, Tanzania',
  currency: 'USD',
  tzsRate: '2650',
  autoNotifyWhatsApp: true,
  adminAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'ztiftbhu',
  cloudinaryUploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default',
  cloudinaryApiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || ''
};

let isAdminSyncInitialized = false;

// Real-time sync for dealership settings & profile across all devices
export function initAdminStoreSync() {
  if (typeof window === 'undefined' || isAdminSyncInitialized) return;
  isAdminSyncInitialized = true;

  if (!db) return;

  try {
    const settingsDocRef = doc(db, 'dealership_settings', 'main');

    // Subscribe to live settings document
    onSnapshot(settingsDocRef, (snap) => {
      if (snap.exists()) {
        const remote = snap.data();
        const local = getDealershipSettings();
        const merged = { ...local, ...remote };
        if (merged.directorName === 'Sajjad Ahmad Sardar' || !merged.directorName) {
          merged.directorName = 'Hammad Riaz';
        }
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
        triggerEvent();
      } else {
        // First time initialization: seed to Firestore
        const current = getDealershipSettings();
        setDoc(settingsDocRef, current, { merge: true }).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, 'dealership_settings/main');
        });
      }
    }, (err) => {
      const msg = err?.message || '';
      const code = err?.code || '';
      if (
        err?.name !== 'AbortError' &&
        code !== 'unavailable' &&
        !msg.includes('unavailable') &&
        !msg.includes('offline') &&
        !msg.includes('aborted') &&
        !msg.includes('fetch') &&
        !msg.includes('Failed to fetch') &&
        !msg.includes('network')
      ) {
        handleFirestoreError(err, OperationType.GET, 'dealership_settings/main');
      }
    });
  } catch (err) {
    const msg = err?.message || '';
    const code = err?.code || '';
    if (
      err?.name !== 'AbortError' &&
      code !== 'unavailable' &&
      !msg.includes('unavailable') &&
      !msg.includes('offline') &&
      !msg.includes('aborted') &&
      !msg.includes('fetch') &&
      !msg.includes('network')
    ) {
      handleFirestoreError(err, OperationType.GET, 'dealership_settings/main');
    }
  }
}

// Expenses Helpers
export function getExpenses() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(EXPENSES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const cleaned = parsed.filter(item => !['exp-1', 'exp-2', 'exp-3'].includes(item.id));
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return [];
  }
}

export function addExpense(expense) {
  if (typeof window === 'undefined') return;
  const current = getExpenses();
  const newExp = { ...expense, id: `exp-${Date.now()}` };
  const updated = [newExp, ...current];
  localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(updated));
  triggerEvent();

  // Firestore sync
  setDoc(doc(db, 'expenses', newExp.id), newExp, { merge: true }).catch(err => {
    handleFirestoreError(err, OperationType.WRITE, `expenses/${newExp.id}`);
  });

  return updated;
}

export function deleteExpense(id) {
  if (typeof window === 'undefined') return;
  const current = getExpenses();
  const updated = current.filter(e => e.id !== id);
  localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(updated));
  triggerEvent();
  return updated;
}

// Sold Vehicles Helpers
export function getSoldVehicles() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SOLD_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const cleaned = parsed.filter(item => !['sold-1', 'sold-2'].includes(item.id));
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(SOLD_STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return [];
  }
}

export function addSoldVehicle(saleData) {
  if (typeof window === 'undefined') return;
  const current = getSoldVehicles();
  const newSale = { ...saleData, id: `sold-${Date.now()}` };
  const updated = [newSale, ...current];
  localStorage.setItem(SOLD_STORAGE_KEY, JSON.stringify(updated));
  triggerEvent();

  // Firestore sync
  setDoc(doc(db, 'sales', newSale.id), newSale, { merge: true }).catch(err => {
    handleFirestoreError(err, OperationType.WRITE, `sales/${newSale.id}`);
  });

  return updated;
}

export function updateSoldVehicle(updatedSale) {
  if (typeof window === 'undefined' || !updatedSale?.id) return;
  const current = getSoldVehicles();
  const salePriceNum = Number(String(updatedSale.salePrice).replace(/[^0-9]/g, '')) || 0;
  const purchaseCostNum = Number(String(updatedSale.purchaseCost).replace(/[^0-9]/g, '')) || 0;
  const profitNum = salePriceNum - purchaseCostNum;

  const normalized = {
    ...updatedSale,
    salePrice: salePriceNum,
    purchaseCost: purchaseCostNum,
    profit: profitNum
  };

  const updated = current.map(item => item.id === updatedSale.id ? normalized : item);
  localStorage.setItem(SOLD_STORAGE_KEY, JSON.stringify(updated));
  triggerEvent();

  // Firestore sync
  setDoc(doc(db, 'sales', updatedSale.id), normalized, { merge: true }).catch(err => {
    handleFirestoreError(err, OperationType.WRITE, `sales/${updatedSale.id}`);
  });

  return updated;
}

export function deleteSoldVehicle(id) {
  if (typeof window === 'undefined' || !id) return;
  const current = getSoldVehicles();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(SOLD_STORAGE_KEY, JSON.stringify(updated));
  triggerEvent();

  // Firestore sync
  deleteDoc(doc(db, 'sales', id)).catch(err => {
    handleFirestoreError(err, OperationType.DELETE, `sales/${id}`);
  });

  return updated;
}

// Calendar Events Helpers
export function getCalendarEvents() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CALENDAR_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const cleaned = parsed.filter(e => !['evt-1', 'evt-2', 'evt-3'].includes(e.id));
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return [];
  }
}

export function addCalendarEvent(evt) {
  if (typeof window === 'undefined') return;
  const current = getCalendarEvents();
  const updated = [{ ...evt, id: `evt-${Date.now()}` }, ...current];
  localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(updated));
  triggerEvent();
  return updated;
}

export function deleteCalendarEvent(id) {
  if (typeof window === 'undefined') return;
  const current = getCalendarEvents();
  const updated = current.filter(e => e.id !== id);
  localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(updated));
  triggerEvent();
  return updated;
}

// Reminders Helpers
export function getReminders() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REMINDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const cleaned = parsed.filter(r => !['rem-1', 'rem-2', 'rem-3', 'rem-4'].includes(r.id));
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return [];
  }
}

export function toggleReminder(id) {
  if (typeof window === 'undefined') return;
  const current = getReminders();
  const updated = current.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
  localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updated));
  triggerEvent();
  return updated;
}

export function addReminder(rem) {
  if (typeof window === 'undefined') return;
  const current = getReminders();
  const updated = [{ ...rem, id: `rem-${Date.now()}`, completed: false }, ...current];
  localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updated));
  triggerEvent();
  return updated;
}

export function deleteReminder(id) {
  if (typeof window === 'undefined') return;
  const current = getReminders();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updated));
  triggerEvent();
  return updated;
}

// Notes Helpers
export function getNotes() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const cleaned = parsed.filter(n => !['nt-1', 'nt-2', 'nt-3'].includes(n.id));
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return [];
  }
}

export function addNote(note) {
  if (typeof window === 'undefined') return;
  const current = getNotes();
  const updated = [{ ...note, id: `nt-${Date.now()}`, date: new Date().toISOString().split('T')[0] }, ...current];
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
  triggerEvent();
  return updated;
}

export function deleteNote(id) {
  if (typeof window === 'undefined') return;
  const current = getNotes();
  const updated = current.filter(n => n.id !== id);
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
  triggerEvent();
  return updated;
}

// Dealership Settings Helpers
export function getDealershipSettings() {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return INITIAL_SETTINGS;
    const parsed = JSON.parse(raw);
    if (parsed.directorName === 'Sajjad Ahmad Sardar' || !parsed.directorName) {
      parsed.directorName = 'Hammad Riaz';
    }
    if (parsed.dealershipName === '3B MOTORS CO. LTD' || !parsed.dealershipName) {
      parsed.dealershipName = '3BrosMotor .LTD';
    }
    if (!parsed.cloudinaryCloudName && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      parsed.cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    }
    if (!parsed.cloudinaryUploadPreset && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      parsed.cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    }
    if (!parsed.cloudinaryApiKey && process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY) {
      parsed.cloudinaryApiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    }
    return { ...INITIAL_SETTINGS, ...parsed };
  } catch {
    return INITIAL_SETTINGS;
  }
}

export async function saveDealershipSettings(settings) {
  if (typeof window === 'undefined') return settings;
  const clean = {
    ...settings,
    directorName: settings.directorName || 'Hammad Riaz'
  };
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(clean));
  triggerEvent();

  // Save live to Firestore database so everyone sees the updated settings & photo
  try {
    await setDoc(doc(db, 'dealership_settings', 'main'), clean, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'dealership_settings/main');
  }

  return clean;
}
