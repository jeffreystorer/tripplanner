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
import * as state from '@/store';
import '@/styles/index.css';

export default function SignInPage() {
  const setUserId = useSetRecoilState(state.userId);
  const [loading, setLoading] = useState(true);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const resetCurrentTripIndex = useResetRecoilState(state.currentTripIndex);
  const refreshTripData = useRecoilRefresher_UNSTABLE(state.tripData);

  const handleSubmit = e => {
    e.preventDefault();
    /* const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email;
    const password = formJson.password; */
    const email = 'tptesting@storer.net';
    const password = 'testing';
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        setUserId(user.uid);
        setLoading(false);
        resetCurrentTripIndex();
        refreshTripData();
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
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
            {/* <label>
              Email:
              <input
                autoComplete='email'
                type='email'
                name='email'
                required
              />
            </label>
            <label>
              Password:
              <input
                autoComplete='current-password'
                type='password'
                name='password'
                required
              />
            </label> */}
            <button className={'not-stacked'} type='submit'>
              Sign In
            </button>
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
