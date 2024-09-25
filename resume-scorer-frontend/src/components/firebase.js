import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged

const firebaseConfig = {
    apiKey: "AIzaSyDVCzYKpYxxdo7vKx-1vNdUHschNiXF2sE",
    authDomain: "resumescorer-72be8.firebaseapp.com",
    projectId: "resumescorer-72be8",
    storageBucket: "resumescorer-72be8.appspot.com",
    messagingSenderId: "40032609771",
    appId: "1:40032609771:web:2ae16067be87b7b752a5ae",
    measurementId: "G-346B5LCQ3C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export the functions you need
export { auth, provider, signInWithPopup, signOut, onAuthStateChanged }; // Add onAuthStateChanged here
