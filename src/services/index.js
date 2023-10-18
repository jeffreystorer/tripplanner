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

export function addTrip(userId, data) {
  const newTripKey = push(child(ref(db), `/${userId}/`)).key;
  const updates = {};
  updates[`/${userId}/${newTripKey}`] = data;
  return update(dbRef, updates);
}

export function updateTrip(userId, key, data) {
  const updates = {};
  updates[`/${userId}/${key}`] = data;
  return update(dbRef, updates);
}

export function updateDetail(userId, tripKey, data, page, detailKey) {
  const updates = {};
  updates[`/${userId}/${tripKey}/details/${page}/${detailKey}`] = data;
  return update(dbRef, updates);
}

export function addDetail(userId, tripKey, data, page) {
  const newDetailKey = push(
    child(dbRef, `/${userId}/${tripKey}/details/${page}`)
  ).key;
  const updates = {};
  updates[`/${userId}/${tripKey}/details/${page}/${newDetailKey}`] = data;
  return update(dbRef, updates);
}

export function removeDetail(userId, currentTripKey, page, key) {
  remove(child(dbRef, `/${userId}/${currentTripKey}/details/${page}/${key}`));
}

export function removeTrip(userId, key) {
  remove(child(dbRef, `/${userId}/` + key));
}

export const removeAll = userId => {
  remove(ref(db, `/${userId}/`));
};
