// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyD8Rqzxln-vlsuyIm5KC6mMsUrYgW2jThA",
  // authDomain: "standup2-1bd9a.firebaseapp.com",
  // projectId: "standup2-1bd9a",
  // storageBucket: "standup2-1bd9a.appspot.com",
  // messagingSenderId: "141499353915",
  // appId: "1:141499353915:web:86ab70270e990441ec451e",
  apiKey: "AIzaSyB9TWdxLz8jucbTxTpK97gM4PnYmcgV7A4",
  authDomain: "standup3-e0014.firebaseapp.com",
  projectId: "standup3-e0014",
  storageBucket: "standup3-e0014.appspot.com",
  messagingSenderId: "1097179240683",
  appId: "1:1097179240683:web:6869356006f1b585c6c6ae",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Init services
export const db = getFirestore(app);

// collection ref
export const colRef = collection(db, "vystoupeni");

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
