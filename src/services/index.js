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
let lastLocalBackupError = null;

function markDirty(userId) {
  backupNeeded = true;
  currentUserId = userId;
}

//Called at sign-in so the backup helpers know whose data to fetch before any
//write has happened. Without this, currentUserId stays null until the first
//markDirty, and downloadBackup cannot fall back to a live fetch.
export function setBackupUser(userId) {
  currentUserId = userId;
}

//true when unsaved changes exist or the last local copy failed to store, i.e.
//the copy in localStorage should not be trusted as current
export function backupIsStale() {
  return backupNeeded || lastLocalBackupError !== null;
}

document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState !== 'hidden') return;
  if (!backupNeeded || !currentUserId) return;
  try {
    const { localSaved } = await backupToJson(currentUserId);
    //only clear the flag once the copy actually landed, so a quota failure
    //retries on the next hide rather than being forgotten
    if (localSaved) backupNeeded = false;
  } catch (error) {
    console.error('Background backup failed:', error);
  }
});

// --- Backup functions ---

//Both backup paths need the same download dance, so keep it in one place.
//Two details matter: the anchor has to be in the document for the click to
//register in some browsers, and the object URL must stay alive until the
//browser has actually read the blob - revoking it synchronously after click()
//can cancel the download.
function triggerDownload(json, filename) {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export async function backupToJson(userId, forceDownload = false) {
  try {
    const data = await getTrips(userId);
    const exportData = { [userId]: data };
    const json = JSON.stringify(exportData, null, 2);

    const localSaved = saveLocalBackup(json);

    // Only trigger a file download if the page is visible (or forced)
    let downloaded = false;
    if (forceDownload || document.visibilityState === 'visible') {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      triggerDownload(json, `trip-backup-${timestamp}.json`);
      downloaded = true;
    }

    return { localSaved, downloaded };
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
}

//the origin has a hard storage limit (~5MB): once trips outgrow it setItem
//throws QuotaExceededError. Both keys are written together so the stored data
//and its timestamp can never disagree, and a failure is recorded rather than
//being allowed to take the file download with it.
function saveLocalBackup(json) {
  try {
    localStorage.setItem('tripBackup', json);
    localStorage.setItem('tripBackupDate', new Date().toISOString());
    lastLocalBackupError = null;
    return true;
  } catch (error) {
    lastLocalBackupError = error;
    console.error('Local backup copy failed:', error);
    return false;
  }
}

export async function downloadBackup() {
  //when the stored copy is known to be out of date, go straight to the
  //database rather than handing over a stale file the user would trust
  if (backupIsStale() && currentUserId) {
    try {
      await backupToJson(currentUserId, true);
      backupNeeded = false;
      return;
    } catch (error) {
      console.error('Live backup failed, falling back to stored copy:', error);
    }
  }

  const json = localStorage.getItem('tripBackup');
  const date = localStorage.getItem('tripBackupDate');

  if (!json) {
    alert(
      'No backup available yet. Make a change while online, or reopen the app ' +
        'with a connection, and try again.'
    );
    return;
  }

  if (backupIsStale()) {
    const when = date ? new Date(date).toLocaleString() : 'an unknown time';
    alert(
      `Could not reach the database, so this is the copy saved at ${when}. ` +
        'Any changes made since then are NOT in this file.'
    );
  }

  const timestamp = date
    ? new Date(date).toISOString().replace(/[:.]/g, '-')
    : 'unknown';

  triggerDownload(json, `trip-backup-${timestamp}.json`);
}

// --- Logging ---

function logAction(userId, action, path, data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action, // 'create' | 'update' | 'delete'
    path,
    data: data ?? null,
  };
  //logging is a side effect and must never take down the write that triggered
  //it. push() validates synchronously and throws on a malformed payload, so
  //catch both the throw and the rejected promise
  try {
    push(child(dbRef, `/_logs/${userId}/`), logEntry).catch(error => {
      console.error('logAction failed:', error);
    });
  } catch (error) {
    console.error('logAction failed:', error);
  }
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

//Firebase's get() does not reject when offline - it waits for a connection,
//with no default timeout. Left alone, a read on a train simply never settles,
//the Recoil selector stays suspended, and the user watches "Loading" forever.
//Race it against a timer so a stalled read becomes a real, catchable error.
const READ_TIMEOUT_MS = 15000;

//navigator.onLine === false means the device has no network interface at all,
//so there is genuinely nothing to wait for - drop to a short grace period
//instead of the full timeout. Note the reverse is NOT reliable: onLine is true
//on a captive portal or a connection that goes nowhere, which is why this only
//ever shortens the wait and never skips the attempt.
const OFFLINE_TIMEOUT_MS = 1500;

function readTimeoutMs() {
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
  return offline ? OFFLINE_TIMEOUT_MS : READ_TIMEOUT_MS;
}

function withTimeout(promise, label) {
  let timer;
  const ms = readTimeoutMs();
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(
        new Error(
          `Timed out after ${ms / 1000}s loading ${label}. ` +
            'Check your connection and try again.'
        )
      );
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// --- Read-only offline fallback ---
//
//Firebase's web SDK keeps no offline cache, so a read with no connection has
//nothing to return. backupToJson already writes a full snapshot of every trip
//to localStorage on each change, so serve that instead of failing - the trip
//you are standing in the middle of is exactly what you need on a train.
//
//Data served this way is READ ONLY: it may be older than the database, so
//writing on top of it risks clobbering newer changes. Writes are refused
//while this mode is active.

let servingLocalData = false;
const offlineListeners = new Set();

function setServingLocalData(value) {
  if (servingLocalData === value) return;
  servingLocalData = value;
  offlineListeners.forEach(fn => fn());
}

//useSyncExternalStore contract, consumed by OfflineBanner
export function subscribeOfflineData(listener) {
  offlineListeners.add(listener);
  return () => offlineListeners.delete(listener);
}

export function isServingLocalData() {
  return servingLocalData;
}

export function localBackupDate() {
  return localStorage.getItem('tripBackupDate');
}

//the snapshot is shaped { [userId]: trips }, matching getTrips' return value
function localSnapshot(userId) {
  try {
    const raw = localStorage.getItem('tripBackup');
    if (!raw) return null;
    return JSON.parse(raw)?.[userId] ?? null;
  } catch (error) {
    console.error('Could not read the local backup:', error);
    return null;
  }
}

//Serve `resolve(snapshot)` from the local copy, or rethrow if there is no
//usable copy - a visible error beats silently showing nothing.
function fallbackToLocal(userId, resolve, error) {
  const snapshot = localSnapshot(userId);
  const value = snapshot ? resolve(snapshot) : null;
  if (value === null || value === undefined) {
    setServingLocalData(false);
    throw error;
  }
  console.warn('Serving trip data from the local backup:', error.message);
  setServingLocalData(true);
  return value;
}

//Guard for every write path.
function assertWritable() {
  if (servingLocalData) {
    throw new Error(
      'You are offline and viewing a saved copy of your trips. ' +
        'Changes cannot be saved until you reconnect.'
    );
  }
}

//Keep the offline copy current from a live read. Deliberately skipped for an
//empty result: getTrips returns {} both for a user with no trips and for a
//path that read as absent, and overwriting a good snapshot with {} would
//destroy the offline copy on a bad day.
function refreshLocalSnapshot(userId, trips) {
  if (!trips || Object.keys(trips).length === 0) return;
  currentUserId = userId;
  saveLocalBackup(JSON.stringify({ [userId]: trips }, null, 2));
}

export function getTrip(userId, key) {
  let trip = withTimeout(get(child(dbRef, `/${userId}/${key}/`)), 'this trip')
    .then(snapshot => {
      setServingLocalData(false);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log('No data available');
        return {};
      }
    })
    .catch(error => {
      //no connection means no data from Firebase - fall back to the local
      //snapshot, and only rethrow if there isn't one
      console.error(error);
      return fallbackToLocal(userId, snapshot => snapshot?.[key], error);
    });
  return trip;
}

export function getTrips(userId) {
  let trips = withTimeout(get(child(dbRef, `/${userId}/`)), 'your trips')
    .then(snapshot => {
      setServingLocalData(false);
      if (snapshot.exists()) {
        const value = snapshot.val();
        //This read already holds every trip, which is exactly the shape the
        //offline snapshot needs - so refresh it here, for free. Without this
        //the snapshot only updates when the app is hidden after an edit, so a
        //read-only visit (or a force-quit) left the offline copy as old as the
        //last change rather than the last visit.
        refreshLocalSnapshot(userId, value);
        return value;
      } else {
        return {};
      }
    })
    .catch(error => {
      //no connection means no data from Firebase - fall back to the local
      //snapshot, and only rethrow if there isn't one
      console.error(error);
      return fallbackToLocal(userId, snapshot => snapshot, error);
    });
  return trips;
}

export function getDetails(userId, key, page) {
  let details = withTimeout(
    get(child(dbRef, `/${userId}/${key}/details/${page}/`)),
    'trip details'
  )
    .then(snapshot => {
      setServingLocalData(false);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return {};
      }
    })
    .catch(error => {
      //no connection means no data from Firebase - fall back to the local
      //snapshot, and only rethrow if there isn't one
      console.error(error);
      return fallbackToLocal(
        userId,
        snapshot => snapshot?.[key]?.details?.[page] ?? {},
        error
      );
    });
  return details;
}

// --- Writes & deletes (logged) ---

export function addTrip(userId, data) {
  assertWritable();
  const newTripKey = push(child(ref(db), `/${userId}/`)).key;
  const updates = {};
  updates[`/${userId}/${newTripKey}`] = data;
  const result = update(dbRef, updates);
  logAction(userId, 'create', `/${userId}/${newTripKey}`, data);
  markDirty(userId);
  return result;
}

//the editable fields of a trip record. `details` and `key` are deliberately
//absent: details is owned by the detail screens, and key duplicates the
//Firebase key it is stored under
const TRIP_FIELDS = ['atrip_Name', 'bstart_Date', 'cend_Date', 'dprint_Date'];

export async function updateTrip(userId, key, data) {
  assertWritable();
  const path = `/${userId}/${key}`;
  const snapshot = await get(child(dbRef, path));
  const oldData = snapshot.exists() ? snapshot.val() : null;

  //write one field at a time. assigning an object to `path` would REPLACE the
  //whole node, silently dropping any child missing from `data` - above all
  //details, which holds every activity, room, car and transport on the trip
  const updates = {};
  const oldFields = {};
  const newFields = {};
  TRIP_FIELDS.forEach(field => {
    if (data[field] === undefined) return;
    updates[`${path}/${field}`] = data[field];
    oldFields[field] = oldData ? oldData[field] ?? null : null;
    newFields[field] = data[field];
  });

  const result = await update(dbRef, updates);

  //log plain field names. the keys of `updates` are full paths containing "/",
  //which Firebase allows in an update path but rejects as a stored key
  logAction(userId, 'update', path, { old: oldFields, new: newFields });
  markDirty(userId);
  return result;
}

export async function updateDetail(userId, tripKey, data, page, detailKey) {
  assertWritable();
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
  assertWritable();
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
  assertWritable();
  const path = `/${userId}/${currentTripKey}/details/${page}/${key}`;
  const snapshot = await get(child(dbRef, path));
  const data = snapshot.exists() ? snapshot.val() : null;

  await remove(child(dbRef, path));
  logAction(userId, 'delete', path, data);
  markDirty(userId);
}

export async function removeTrip(userId, key) {
  assertWritable();
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