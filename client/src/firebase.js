// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-5919e.firebaseapp.com",
  projectId: "mern-estate-5919e",
  storageBucket: "mern-estate-5919e.appspot.com",
  messagingSenderId: "419419797642",
  appId: "1:419419797642:web:829e31baa46b7edb0d5573",
  measurementId: "G-KVYLRVY5ZN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
