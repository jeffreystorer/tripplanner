import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  child,
  get,
  push,
  ref,
  remove,
  update,
} from 'firebase/database';
import { firebaseConfig } from '@/firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

// --- Dirty flag & visibility change backup ---

let backupNeeded = false;
let currentUserId = null;

function markDirty(userId) {
  backupNeeded = true;
  currentUserId = userId;
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && backupNeeded && currentUserId) {
    backupToJson(currentUserId);
    backupNeeded = false;
  }
});

// --- Backup functions ---

export async function backupToJson(userId, forceDownload = false) {
  try {
    const data = await getTrips(userId);
    const exportData = { [userId]: data };
    const json = JSON.stringify(exportData, null, 2);

    // Always save to localStorage as a safety net
    localStorage.setItem('tripBackup', json);
    localStorage.setItem('tripBackupDate', new Date().toISOString());

    // Only trigger a file download if the page is visible (or forced)
    if (forceDownload || document.visibilityState === 'visible') {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `trip-backup-${timestamp}.json`;

      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
}

export function downloadBackup() {
  const json = localStorage.getItem('tripBackup');
  const date = localStorage.getItem('tripBackupDate');

  if (!json) {
    alert('No backup available yet.');
    return;
  }

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const timestamp = date
    ? new Date(date).toISOString().replace(/[:.]/g, '-')
    : 'unknown';

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `trip-backup-${timestamp}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

// --- Logging ---

function logAction(userId, action, path, data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action, // 'create' | 'update' | 'delete'
    path,
    data: data ?? null,
  };
  push(child(dbRef, `/_logs/${userId}/`), logEntry);
}

export function getLogs(userId) {
  return get(child(dbRef, `/_logs/${userId}/`))
    .then(snapshot => {
      if (!snapshot.exists()) return [];
      const raw = snapshot.val();
      const entries = Object.entries(raw).map(([key, value]) => ({ key, ...value }));
      entries.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
      return entries;
    })
    .catch(error => {
      console.error(error);
      return [];
    });
}

export function clearLogs(userId) {
  return remove(child(dbRef, `/_logs/${userId}/`));
}

// --- Reads (unchanged) ---

export function getTrip(userId, key) {
  let trip = get(child(dbRef, `/${userId}/${key}/`))
    .then(snapshot => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log('No data available');
        return {};
      }
    })
    .catch(error => {
      console.error(error);
      window.location = '/';
    });
  return trip;
}

export function getTrips(userId) {
  let trips = get(child(dbRef, `/${userId}/`))
    .then(snapshot => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return {};
      }
    })
    .catch(error => {
      console.error(error);
      window.location = '/';
    });
  return trips;
}

export function getDetails(userId, key, page) {
  let details = get(child(dbRef, `/${userId}/${key}/details/${page}/`))
    .then(snapshot => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return {};
      }
    })
    .catch(error => {
      console.error(error);
      window.location = '/';
    });
  return details;
}

// --- Writes & deletes (logged) ---

export function addTrip(userId, data) {
  const newTripKey = push(child(ref(db), `/${userId}/`)).key;
  const updates = {};
  updates[`/${userId}/${newTripKey}`] = data;
  const result = update(dbRef, updates);
  logAction(userId, 'create', `/${userId}/${newTripKey}`, data);
  markDirty(userId);
  return result;
}

export async function updateTrip(userId, key, data) {
  const path = `/${userId}/${key}`;
  const snapshot = await get(child(dbRef, path));
  const oldData = snapshot.exists() ? snapshot.val() : null;

  const updates = {};
  updates[path] = data;
  const result = await update(dbRef, updates);

  logAction(userId, 'update', path, { old: oldData, new: data });
  markDirty(userId);
  return result;
}

export async function updateDetail(userId, tripKey, data, page, detailKey) {
  const path = `/${userId}/${tripKey}/details/${page}/${detailKey}`;
  const snapshot = await get(child(dbRef, path));
  const oldData = snapshot.exists() ? snapshot.val() : null;

  const updates = {};
  updates[path] = data;
  const result = await update(dbRef, updates);

  logAction(userId, 'update', path, { old: oldData, new: data });
  markDirty(userId);
  return result;
}

export function addDetail(userId, tripKey, data, page) {
  const newDetailKey = push(
    child(dbRef, `/${userId}/${tripKey}/details/${page}`)
  ).key;
  const updates = {};
  updates[`/${userId}/${tripKey}/details/${page}/${newDetailKey}`] = data;
  const result = update(dbRef, updates);
  logAction(userId, 'create', `/${userId}/${tripKey}/details/${page}/${newDetailKey}`, data);
  markDirty(userId);
  return result;
}

export async function removeDetail(userId, currentTripKey, page, key) {
  const path = `/${userId}/${currentTripKey}/details/${page}/${key}`;
  const snapshot = await get(child(dbRef, path));
  const data = snapshot.exists() ? snapshot.val() : null;

  await remove(child(dbRef, path));
  logAction(userId, 'delete', path, data);
  markDirty(userId);
}

export async function removeTrip(userId, key) {
  const path = `/${userId}/${key}`;
  const snapshot = await get(child(dbRef, path));
  const data = snapshot.exists() ? snapshot.val() : null;

  await remove(child(dbRef, path));
  logAction(userId, 'delete', path, data);
  markDirty(userId);
}

export const removeAll = async (userId) => {
  const path = `/${userId}/`;
  const snapshot = await get(child(dbRef, path));
  const data = snapshot.exists() ? snapshot.val() : null;

  await remove(ref(db, path));
  logAction(userId, 'delete', path, data);
  markDirty(userId);
};