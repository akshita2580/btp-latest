import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import {setPersistence, browserLocalPersistence } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBnGOH7bh4b6Viitb4zP_Pd-yURfpCAn1A',
  authDomain: 'btpproject-31ad6.firebaseapp.com',
  projectId: 'btpproject-31ad6',
  // storageBucket: 'btpproject-31ad6.firebasestorage.app',
  storageBucket: "btpproject-31ad6.appspot.com",
  messagingSenderId: '854924933617',
  appId: '1:854924933617:web:3269fb64f0db074f76ac50',
  measurementId: 'G-58L37L6NV1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// setPersistence(auth, browserLocalPersistence)
//   .then(() => {
//     console.log("Firebase Auth persistence set successfully.");
//   })
//   .catch((error) => {
//     console.error("Error setting Firebase Auth persistence:", error);
//   });

export { auth, db, storage };