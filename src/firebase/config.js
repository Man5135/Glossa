// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAMxhshRuTwiHFbocROLSb-hk8qWlHv2U",
  authDomain: "glossa-ellinika.firebaseapp.com",
  projectId: "glossa-ellinika",
  storageBucket: "glossa-ellinika.firebasestorage.app",
  messagingSenderId: "878493278977",
  appId: "1:878493278977:web:5f3fb206ea72a382e33100",
  measurementId: "G-NJEP6H2YVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Теперь getFirestore будет определен
export const db = getFirestore(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);