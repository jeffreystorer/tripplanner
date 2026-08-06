import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  useRecoilRefresher_UNSTABLE,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '@/firebaseConfig';
import { hasLocalBackup, openLocalBackup, setBackupUser } from '@/services';
import * as state from '@/store';
import '@/styles/index.css';

export default function SignInPage() {
  const setUserId = useSetRecoilState(state.userId);
  const [loading, setLoading] = useState(true);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const resetCurrentTripIndex = useResetRecoilState(state.currentTripIndex);
  const refreshTripData = useRecoilRefresher_UNSTABLE(state.tripData);
  const [error, setError] = useState('');
  const offlineAvailable = hasLocalBackup();

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email;
    const password = formJson.password;
   
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        setUserId(user.uid);
        setBackupUser(user.uid);
        setLoading(false);
        resetCurrentTripIndex();
        refreshTripData();
      })
      .catch(error => {
        console.error(error.code, error.message);
        setError(
          offlineAvailable
            ? 'Could not sign in. If you are offline you can still open the ' +
                'saved copy of your trips on this device.'
            : 'Could not sign in. Check your email and password.'
        );
      });
  };

  //No network and no sign-in: read the snapshot already on this device. Read
  //only - every write is refused while this is active.
  const handleOpenOffline = () => {
    setError('');
    try {
      const userId = openLocalBackup();
      setUserId(userId);
      setLoading(false);
      resetCurrentTripIndex();
      refreshTripData();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      {loading ? (
        <>
      <header>
          <h1>Storer TP</h1>
      </header>
      <main>
        <form id='sign-in' onSubmit={handleSubmit}>
          <fieldset>
            <label>
              Email:
              <input
                autoComplete='email'
                type='email'
                name='email'
                defaultValue='tp@storer.net'
                required
              />
            </label>
            <label>
              Password:
              <input
                autoComplete='current-password'
                type='password'
                name='password'
                autoFocus
                required
              />
            </label>
            <button className={'not-stacked'} type='submit'>
              Sign In
            </button>
            {offlineAvailable && (
              <button
                className={'not-stacked'}
                type='button'
                onClick={handleOpenOffline}
              >
                View Saved Itinerary
              </button>
            )}
            {error && <p id='sign-in-error'>{error}</p>}
          </fieldset>
        </form>
      </main>
    </>
      ) : (
        <Navigate to="/pages/trip" />
      )}
    </>
  );
}
