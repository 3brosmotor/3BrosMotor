// 3BrosMotor Inventory Store
// Production-Ready Real-time Firebase Firestore cloud sync

import { INITIAL_60_VEHICLES } from './carsData';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, onSnapshot } from 'firebase/firestore';

// 5 initial demo vehicles retained as empty baseline for production
export const DEMO_CARS = [];
export const FULL_60_CARS = [];

const STORAGE_KEY = '3bros_inventory_vehicles';
export const INVENTORY_EVENT = '3bros_inventory_updated';

let isFirestoreListenerAttached = false;
let unsubscribeVehiclesListener = null;

// Initialize real-time synchronization with Firestore
export function initCarStoreSync() {
  if (typeof window === 'undefined') return;
  if (isFirestoreListenerAttached && unsubscribeVehiclesListener) {
    return;
  }
  isFirestoreListenerAttached = true;

  if (!db) return;

  try {
    const vehiclesCol = collection(db, 'vehicles');
    
    // Clean up any stale listener before attaching
    if (typeof unsubscribeVehiclesListener === 'function') {
      try { unsubscribeVehiclesListener(); } catch {}
    }

    // Attach single onSnapshot listener
    unsubscribeVehiclesListener = onSnapshot(vehiclesCol, (snapshot) => {
      try {
        if (!snapshot.empty) {
          const remoteCars = [];
          const demoMockModels = [
            'Land Cruiser Prado', 
            'Land Cruiser 79 Double Cab', 
            'Canter 3.5 Ton Dump', 
            'Harrier Elegance', 
            'HiAce Commuter 15-Seater'
          ];
          const demoIds = ['1001', '1002', '1003', '1004', '1005'];
          
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() || {};
            const idStr = String(docSnap.id);
            const isMockDemo = data.isDemo === true || (demoIds.includes(idStr) && demoMockModels.includes(data.model));
            if (isMockDemo) {
              deleteDoc(doc(db, 'vehicles', idStr)).catch(() => {});
            } else {
              remoteCars.push({ ...data, id: idStr });
            }
          });
          
          // Merge with any local genuine cars not yet synced to Firestore
          const localCurrent = getStoredCars();
          const remoteIdSet = new Set(remoteCars.map(c => String(c.id)));
          
          for (const localCar of localCurrent) {
            if (!remoteIdSet.has(String(localCar.id)) && !localCar.isDemo) {
              remoteCars.unshift(localCar);
              setDoc(doc(db, 'vehicles', String(localCar.id)), localCar, { merge: true }).catch(() => {});
            }
          }

          // Sort by creation date or stockNo
          remoteCars.sort((a, b) => {
            const timeA = new Date(a.createdAt || 0).getTime();
            const timeB = new Date(b.createdAt || 0).getTime();
            if (timeA && timeB && timeA !== timeB) return timeB - timeA;
            const numA = parseInt(String(a.stockNo || a.id).replace(/\D/g, ''), 10) || 0;
            const numB = parseInt(String(b.stockNo || b.id).replace(/\D/g, ''), 10) || 0;
            return numA - numB;
          });

          localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteCars));
          window.dispatchEvent(new Event(INVENTORY_EVENT));
        } else {
          // If remote collection is newly empty, back up any real local cars to Firestore
          const localCars = getStoredCars();
          if (localCars.length > 0) {
            localCars.forEach((c) => {
              if (!c.isDemo) {
                setDoc(doc(db, 'vehicles', String(c.id)), c, { merge: true }).catch(() => {});
              }
            });
          } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
            window.dispatchEvent(new Event(INVENTORY_EVENT));
          }
        }
      } catch (e) {
        console.error('Car store snapshot handling error:', e);
      }
    }, (error) => {
      // Gracefully handle aborted, offline, unavailable, network, or superseded connection states
      const msg = error?.message || '';
      const code = error?.code || '';
      if (
        error?.name !== 'AbortError' &&
        code !== 'unavailable' &&
        !msg.includes('unavailable') &&
        !msg.includes('offline') &&
        !msg.includes('aborted') &&
        !msg.includes('superseded') &&
        !msg.includes('fetch') &&
        !msg.includes('Failed to fetch') &&
        !msg.includes('network')
      ) {
        handleFirestoreError(error, OperationType.GET, 'vehicles');
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
      !msg.includes('superseded') &&
      !msg.includes('fetch') &&
      !msg.includes('network')
    ) {
      handleFirestoreError(err, OperationType.GET, 'vehicles');
    }
  }
}

export function getStoredCars() {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const demoMockModels = [
        'Land Cruiser Prado', 
        'Land Cruiser 79 Double Cab', 
        'Canter 3.5 Ton Dump', 
        'Harrier Elegance', 
        'HiAce Commuter 15-Seater'
      ];
      const demoIds = ['1001', '1002', '1003', '1004', '1005'];
      const realOnly = parsed.filter(c => {
        if (!c) return false;
        if (c.isDemo === true) return false;
        if (demoIds.includes(String(c.id)) && demoMockModels.includes(c.model)) return false;
        return true;
      });
      if (realOnly.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(realOnly));
      }
      return realOnly;
    }
    return [];
  } catch {
    return [];
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

/**
 * Remove all remaining starter/demo vehicles (IDs 1001-1005) from cloud and local storage
 */
export async function clearAllDemoCars() {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredCars();
    const demoIds = ['1001', '1002', '1003', '1004', '1005'];
    
    // Purge from Firestore
    if (db) {
      for (const id of demoIds) {
        try {
          await deleteDoc(doc(db, 'vehicles', id));
        } catch {}
      }
    }

    const realCarsOnly = current.filter(c => !demoIds.includes(String(c.id)));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(realCarsOnly));
    window.dispatchEvent(new Event(INVENTORY_EVENT));
    return realCarsOnly;
  } catch (err) {
    console.error('Failed to clear demo cars:', err);
  }
}

export async function saveCar(carData) {
  if (typeof window === 'undefined') return carData;
  try {
    const current = getStoredCars();
    
    // Normalize images array
    const rawImages = Array.isArray(carData.images) && carData.images.length > 0
      ? carData.images.filter(Boolean)
      : (carData.photo ? [carData.photo] : []);
    
    const primaryPhoto = rawImages[0] || carData.photo || '';
    const finalImages = rawImages.length > 0 ? rawImages : (primaryPhoto ? [primaryPhoto] : []);

    const carId = carData.id ? String(carData.id) : `car_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newCar = {
      ...carData,
      id: carId,
      status: carData.status || 'In Stock',
      photo: primaryPhoto,
      images: finalImages,
      location: carData.location || 'Dar es Salaam Yard',
      isDemo: false,
      createdAt: carData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Filter out any stale item with same id
    const updated = [newCar, ...current.filter(c => String(c.id) !== carId)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(INVENTORY_EVENT));

    // Save live to Firestore so every device sees the new vehicle
    if (db) {
      try {
        await setDoc(doc(db, 'vehicles', carId), newCar, { merge: true });
      } catch (dbErr) {
        console.error('Firestore save vehicle error:', dbErr);
        handleFirestoreError(dbErr, OperationType.WRITE, `vehicles/${carId}`);
      }
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
