import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  useRecoilRefresher_UNSTABLE,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
//import Logo from '../assets/android-chrome-512X512.svg';
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
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const username = formJson.username;
    const password = formJson.password;
    signInWithEmailAndPassword(auth, username, password)
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
        <div>
          {/* <img alt='Logo' src={Logo} width='30' height='30'/> */}
          <h1>Storer TP</h1>
        </div>
      </header>
      <main>
        <form id='sign-in' onSubmit={handleSubmit}>
          <fieldset>
            <label>
              Username:
              <input
                type='text'
                name='username'
                required
              />
            </label>
            <label>
              Password:
              <input
                type='password'
                name='password'
                required
              />
            </label>
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
