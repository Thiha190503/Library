import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCtS-dn0zs_Lx0rFn8as-P3xUim493OAXw",
  authDomain: "library-3e9a4.firebaseapp.com",
  projectId: "library-3e9a4",
  storageBucket: "library-3e9a4.appspot.com",
  messagingSenderId: "495589936246",
  appId: "1:495589936246:web:f679ac672ae148bd666357",
  measurementId: "G-CZE61J52KT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let db = getFirestore(app);
let storage = getStorage(app);
let auth = getAuth(app);

export { db, storage, auth };
