
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJyeADd9J0kUPDisk-IpCEkDekNU_vsvI",
  authDomain: "game-store-poli.firebaseapp.com",
  projectId: "game-store-poli",
  storageBucket: "game-store-poli.firebasestorage.app",
  messagingSenderId: "27178421565",
  appId: "1:27178421565:web:b5899632bafb8867dec954",
  measurementId: "G-1CJ2XSKNMV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);