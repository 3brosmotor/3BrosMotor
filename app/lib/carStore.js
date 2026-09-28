// 3BrosMotor Inventory Store
// Real-time Firebase Firestore cloud sync with lean 5-car demo baseline

import { INITIAL_60_VEHICLES } from './carsData';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, onSnapshot } from 'firebase/firestore';

// 5 initial demo vehicles for preview until user inputs their own real fleet data
export const DEMO_CARS = INITIAL_60_VEHICLES.slice(0, 5);
export const FULL_60_CARS = DEMO_CARS;

const STORAGE_KEY = '3bros_inventory_vehicles';
export const INVENTORY_EVENT = '3bros_inventory_updated';

let isFirestoreListenerAttached = false;
let unsubscribeVehiclesListener = null;

// Initialize real-time synchronization with Firestore
export function initCarStoreSync() {
  if (typeof window === 'undefined' || isFirestoreListenerAttached) return;
  isFirestoreListenerAttached = true;

  if (!db) return;

  try {
    const vehiclesCol = collection(db, 'vehicles');
    
    // Attach single onSnapshot listener
    unsubscribeVehiclesListener = onSnapshot(vehiclesCol, (snapshot) => {
      try {
        if (!snapshot.empty) {
          const remoteCars = [];
          snapshot.forEach((docSnap) => {
            remoteCars.push({ ...docSnap.data(), id: String(docSnap.id) });
          });
          
          // Sort by stockNo or ID
          remoteCars.sort((a, b) => {
            const numA = parseInt(String(a.stockNo || a.id).replace(/\D/g, ''), 10) || 0;
            const numB = parseInt(String(b.stockNo || b.id).replace(/\D/g, ''), 10) || 0;
            return numA - numB;
          });

          // If Firestore currently holds the old 60-car test fleet, prune documents > 1005
          if (remoteCars.length >= 30 && remoteCars.some(c => c.id === '1060')) {
            remoteCars.forEach((car) => {
              const idNum = parseInt(car.id, 10);
              if (idNum > 1005 && idNum <= 1060) {
                deleteDoc(doc(db, 'vehicles', String(car.id))).catch(() => {});
              }
            });
            const pruned = remoteCars.filter(c => {
              const idNum = parseInt(c.id, 10);
              return !(idNum > 1005 && idNum <= 1060);
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned.length > 0 ? pruned : DEMO_CARS));
            window.dispatchEvent(new Event(INVENTORY_EVENT));
            return;
          }

          localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteCars));
          window.dispatchEvent(new Event(INVENTORY_EVENT));
        } else {
          // If remote collection is currently empty in Firebase,
          // seed only the 5 demo vehicles so visitors have an initial preview
          const cached = getStoredCars();
          const fleetToSeed = cached.length > 0 && cached.length <= 10 ? cached : DEMO_CARS;
          fleetToSeed.forEach((vehicle) => {
            setDoc(doc(db, 'vehicles', String(vehicle.id)), vehicle, { merge: true }).catch(() => {});
          });
        }
      } catch {
        // Fallback safely to local inventory
      }
    }, (error) => {
      // Gracefully handle aborted, network, or permission errors
      const msg = error?.message || '';
      if (
        error?.name !== 'AbortError' &&
        !msg.includes('aborted') &&
        !msg.includes('fetch') &&
        !msg.includes('Failed to fetch') &&
        !msg.includes('network')
      ) {
        handleFirestoreError(error, OperationType.GET, 'vehicles');
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
      handleFirestoreError(err, OperationType.GET, 'vehicles');
    }
  }
}

export function getStoredCars() {
  if (typeof window === 'undefined') {
    return DEMO_CARS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CARS));
      return DEMO_CARS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Prune old 60-car test fleet if stored
      const isOld60Fleet = parsed.length >= 30 && parsed.some(c => c.id === '1060');
      if (isOld60Fleet) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CARS));
        return DEMO_CARS;
      }
      if (parsed.length > 0) {
        return parsed;
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CARS));
    return DEMO_CARS;
  } catch {
    return DEMO_CARS;
  }
}

export function getCarImages(car) {
  if (!car) return [];
  if (Array.isArray(car.images) && car.images.length > 0) {
    return car.images.filter(Boolean);
  }
  if (car.photo) {
    return [car.photo];
  }
  return [];
}

export async function saveCar(carData) {
  if (typeof window === 'undefined') return carData;
  try {
    const current = getStoredCars();
    
    // Normalize images array
    const rawImages = Array.isArray(carData.images) && carData.images.length > 0
      ? carData.images.filter(Boolean)
      : (carData.photo ? [carData.photo] : []);
    
    const primaryPhoto = rawImages[0] || carData.photo || `https://picsum.photos/seed/${encodeURIComponent((carData.make || 'Car') + '-' + (carData.model || 'Auto'))}/800/600`;
    const finalImages = rawImages.length > 0 ? rawImages : [primaryPhoto];

    const newCar = {
      ...carData,
      id: carData.id ? String(carData.id) : String(Date.now()).slice(-4),
      status: carData.status || 'In Stock',
      photo: primaryPhoto,
      images: finalImages,
      location: carData.location || 'Dar es Salaam Yard',
      updatedAt: new Date().toISOString()
    };
    const updated = [newCar, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(INVENTORY_EVENT));

    // Save to Firestore so everyone sees the new car after deployment
    try {
      await setDoc(doc(db, 'vehicles', String(newCar.id)), newCar, { merge: true });
    } catch (dbErr) {
      handleFirestoreError(dbErr, OperationType.WRITE, `vehicles/${newCar.id}`);
    }

    return newCar;
  } catch (err) {
    console.error('Failed to save car:', err);
    return null;
  }
}

export async function updateCar(updatedCar) {
  if (typeof window === 'undefined') return null;
  try {
    const current = getStoredCars();
    
    // Normalize images array
    const rawImages = Array.isArray(updatedCar.images) && updatedCar.images.length > 0
      ? updatedCar.images.filter(Boolean)
      : (updatedCar.photo ? [updatedCar.photo] : []);
      
    const primaryPhoto = rawImages[0] || updatedCar.photo || '';
    const finalImages = rawImages.length > 0 ? rawImages : (primaryPhoto ? [primaryPhoto] : []);

    const carWithTimestamp = {
      ...updatedCar,
      id: String(updatedCar.id),
      photo: primaryPhoto,
      images: finalImages,
      updatedAt: new Date().toISOString()
    };
    const updated = current.map(c => String(c.id) === String(carWithTimestamp.id) ? { ...c, ...carWithTimestamp } : c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(INVENTORY_EVENT));

    // Update in Firestore
    try {
      await setDoc(doc(db, 'vehicles', String(carWithTimestamp.id)), carWithTimestamp, { merge: true });
    } catch (dbErr) {
      handleFirestoreError(dbErr, OperationType.UPDATE, `vehicles/${carWithTimestamp.id}`);
    }

    return carWithTimestamp;
  } catch (err) {
    console.error('Failed to update car:', err);
    return null;
  }
}

export async function deleteCar(id) {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredCars();
    const updated = current.filter(c => String(c.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(INVENTORY_EVENT));

    // Delete in Firestore
    try {
      await deleteDoc(doc(db, 'vehicles', String(id)));
    } catch (dbErr) {
      handleFirestoreError(dbErr, OperationType.DELETE, `vehicles/${id}`);
    }
  } catch (err) {
    console.error('Failed to delete car:', err);
  }
}

export function resetToDemo() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CARS));
    window.dispatchEvent(new Event(INVENTORY_EVENT));
  } catch (err) {
    console.error('Failed to reset demo cars:', err);
  }
}

// Backward compatibility alias
export const resetToFull60Fleet = resetToDemo;

/**
 * Diagnostic function to test if Firestore reads/writes are allowed or permission-denied
 */
export async function testFirestoreConnection() {
  if (!db) {
    return { status: 'error', error: 'Firestore client not initialized' };
  }
  try {
    const colRef = collection(db, 'vehicles');
    const snap = await getDocs(colRef);
    return { status: 'connected', count: snap.size, error: null };
  } catch (err) {
    const msg = err?.message || String(err || '');
    const isPerm = err?.code === 'permission-denied' || msg.includes('permission');
    return {
      status: isPerm ? 'permission-denied' : 'error',
      error: msg,
      code: err?.code
    };
  }
}

/**
 * Push all active vehicles to Firestore so that every visitor across the world sees them
 */
export async function syncAllCarsToFirestore(fleet) {
  if (!db) {
    return { success: false, count: 0, error: 'Firebase is not initialized' };
  }
  const targetFleet = Array.isArray(fleet) && fleet.length > 0 ? fleet : getStoredCars();
  let successCount = 0;
  let lastErr = null;

  for (const car of targetFleet) {
    try {
      await setDoc(doc(db, 'vehicles', String(car.id)), car, { merge: true });
      successCount++;
    } catch (err) {
      lastErr = err;
    }
  }

  if (lastErr && successCount === 0) {
    const msg = lastErr?.message || String(lastErr || '');
    const isPerm = lastErr?.code === 'permission-denied' || msg.includes('permission');
    return {
      success: false,
      count: 0,
      isPermissionDenied: isPerm,
      error: isPerm
        ? 'Permission denied: Please enable read/write rules in Firebase Console'
        : msg
    };
  }

  return { success: true, count: successCount, total: targetFleet.length };
}

/**
 * Import a full fleet array from JSON and sync to both localStorage and Firestore
 */
export function importFleetJSON(jsonStringOrArray) {
  try {
    const parsed = typeof jsonStringOrArray === 'string' ? JSON.parse(jsonStringOrArray) : jsonStringOrArray;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return { success: false, error: 'Data must be a non-empty array of vehicle objects' };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    window.dispatchEvent(new Event(INVENTORY_EVENT));
    // Trigger async sync to cloud
    syncAllCarsToFirestore(parsed).catch(() => {});
    return { success: true, count: parsed.length };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to parse JSON file' };
  }
}
