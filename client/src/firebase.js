// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);