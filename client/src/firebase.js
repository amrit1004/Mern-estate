// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-1702d.firebaseapp.com",
  projectId: "mern-estate-1702d",
  storageBucket: "mern-estate-1702d.appspot.com",
  messagingSenderId: "1075355168472",
  appId: "1:1075355168472:web:383e274b3d259126b7b1ad",
  measurementId: "G-N4T2PDRXS2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);