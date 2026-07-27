// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Replace these with your actual Firebase config values
// Find them in Firebase Console → Project Settings → Your apps
const firebaseConfig = {
  apiKey: "AIzaSyDdI0OWwmKYxqUpTPl31UGNcRDalpTWed0",
  authDomain: "salon-web-35188.firebaseapp.com",
  projectId: "salon-web-35188",
  storageBucket: "salon-web-35188.firebasestorage.app",
  messagingSenderId: "979183009749",
  appId: "1:979183009749:web:9c4475720cf68fb8ac475c",
  measurementId: "G-ERPSXYVD5Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);