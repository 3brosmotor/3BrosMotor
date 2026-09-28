// 3BrosMotor Dealership Admin Data Store
// Manages Expenses, Sales, Calendar Events, Reminders, Notes, and Settings with Firebase Firestore Cloud Sync

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

// Default initial data for clean demo start
const INITIAL_EXPENSES = [
  { id: 'exp-1', title: 'TRA Customs Duty & Port Clearance (Hilux Revo)', vehicleStock: '1001', category: 'Clearance', amount: 3200, date: '2026-09-18', status: 'Paid' },
  { id: 'exp-2', title: 'Trans-Tanzania Flatbed Freight Dar -> Mwanza Yard', vehicleStock: '1002', category: 'Transport', amount: 950, date: '2026-09-15', status: 'Paid' },
  { id: 'exp-3', title: 'JEVIC Pre-Shipment Inspection & Valet Polish', vehicleStock: '1003', category: 'Maintenance', amount: 450, date: '2026-09-12', status: 'Paid' }
];

const INITIAL_SOLD = [
  { id: 'sold-1', carId: '998', make: 'Toyota', model: 'Land Cruiser Prado TX', year: '2016', chassis: 'GDJ150-1092834', customerName: 'Hon. Josephat Mwita', customerPhone: '+255 754 112 233', salePrice: 42000, purchaseCost: 35000, profit: 7000, saleDate: '2026-09-10', paymentMethod: 'Bank Transfer' },
  { id: 'sold-2', carId: '999', make: 'Toyota', model: 'Harrier Premium', year: '2015', chassis: 'AVU65-0019284', customerName: 'Dr. Neema Kimaro', customerPhone: '+255 713 889 900', salePrice: 21500, purchaseCost: 17200, profit: 4300, saleDate: '2026-09-02', paymentMethod: 'Direct Cash' }
];

const INITIAL_CALENDAR = [
  { id: 'evt-1', title: 'Port Vessel Arrival: MSC Nicole (3 Scania Trucks & 2 Hilux)', date: '2026-09-24', time: '09:00 AM', location: 'Dar es Salaam Port Berth 4', type: 'Shipment', notes: 'Prepare TRA clearance documents with agent' },
  { id: 'evt-2', title: 'VIP Client Test Drive: Prado TX-L 2019 (Mr. Baraka)', date: '2026-09-25', time: '02:30 PM', location: 'Mwanza Sabasaba Yard', type: 'Appointment', notes: 'Vehicle washed & battery checked' },
  { id: 'evt-3', title: 'Japan Auction Bid Round (Toyota Prado & Land Cruiser 79)', date: '2026-09-28', time: '04:00 AM', location: 'Online USS Tokyo Auction', type: 'Auction', notes: 'Budget allocated: $75,000' }
];

const INITIAL_REMINDERS = [
  { id: 'rem-1', task: 'Submit TRA Single Customs Document (SAD) for SCANIA R450', dueDate: '2026-09-25', priority: 'High', completed: false },
  { id: 'rem-2', task: 'Follow up with TPA regarding Mwanza train freight slots', dueDate: '2026-09-26', priority: 'Medium', completed: false },
  { id: 'rem-3', task: 'Renew Dealership Showroom Insurance policy', dueDate: '2026-09-30', priority: 'High', completed: false },
  { id: 'rem-4', task: 'Update weekly USD to TZS exchange rate benchmark in system', dueDate: '2026-10-01', priority: 'Low', completed: true }
];

const INITIAL_NOTES = [
  { id: 'nt-1', title: 'Popular Requests from Lake Zone Clients', content: 'High demand for Toyota Hilux Double Cab and Land Cruiser Prado TX. Check upcoming USS Tokyo auctions for 2018-2021 clean units with mileage below 60,000 KM.', date: '2026-09-20', color: 'yellow' },
  { id: 'nt-2', title: 'Shipping Agent Port Contact', content: 'Harbor Agent: Capt. Ramadhani (+255 768 444 888) handling berth clearance at Dar es Salaam port terminal 2.', date: '2026-09-18', color: 'blue' },
  { id: 'nt-3', title: 'Yard Maintenance Notice', content: 'Security floodlights on North fence serviced. CCTV backup running normally with 45-day cycle retention.', date: '2026-09-15', color: 'green' }
];

const INITIAL_SETTINGS = {
  directorName: 'Hammad Riaz',
  dealershipName: '3BrosMotor .LTD',
  primaryLocation: 'Dar es Salaam, Tanzania',
  portOffice: 'Kurasini Port View, Dar es Salaam, Tanzania',
  currency: 'USD',
  tzsRate: '2650',
  autoNotifyWhatsApp: true,
  adminAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  cloudinaryUploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
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
      if (
        err?.name !== 'AbortError' &&
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
    if (
      err?.name !== 'AbortError' &&
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
  if (typeof window === 'undefined') return INITIAL_EXPENSES;
  try {
    const raw = localStorage.getItem(EXPENSES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_EXPENSES;
  } catch {
    return INITIAL_EXPENSES;
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
  if (typeof window === 'undefined') return INITIAL_SOLD;
  try {
    const raw = localStorage.getItem(SOLD_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_SOLD;
  } catch {
    return INITIAL_SOLD;
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
  if (typeof window === 'undefined') return INITIAL_CALENDAR;
  try {
    const raw = localStorage.getItem(CALENDAR_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_CALENDAR;
  } catch {
    return INITIAL_CALENDAR;
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
  if (typeof window === 'undefined') return INITIAL_REMINDERS;
  try {
    const raw = localStorage.getItem(REMINDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_REMINDERS;
  } catch {
    return INITIAL_REMINDERS;
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
  if (typeof window === 'undefined') return INITIAL_NOTES;
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_NOTES;
  } catch {
    return INITIAL_NOTES;
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
