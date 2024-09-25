// src/GoogleLogin.js
import React from 'react';
import { auth, provider } from './firebase-config';
import { signInWithPopup } from 'firebase/auth';

const GoogleLogin = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User:', user);
      // User is signed in, you can redirect or perform other actions
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

export default GoogleLogin;
