// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

//My web app's FB config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
//my web app linked to FB
const firebaseApp = initializeApp(firebaseConfig);

//my web app linked to fb db via 17
// Get a reference to the database and storage service and export the reference for other modules
export const database = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp);
