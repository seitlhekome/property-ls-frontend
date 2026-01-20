// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABUpGpMGxxB48LI0Btcoff8lKjRDEw-t0",
  authDomain: "property-ls.firebaseapp.com",
  projectId: "property-ls",
  storageBucket: "property-ls.appspot.com",
  messagingSenderId: "405367001273",
  appId: "1:405367001273:web:2b2a4f202c2766f8724b68",
  measurementId: "G-D32DK9BLQ7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth, Firestore, Storage
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ⚠️ Offline persistence removed to prevent client-is-offline errors

export { auth, db, storage };
