// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8Rqzxln-vlsuyIm5KC6mMsUrYgW2jThA",
  authDomain: "standup2-1bd9a.firebaseapp.com",
  projectId: "standup2-1bd9a",
  storageBucket: "standup2-1bd9a.appspot.com",
  messagingSenderId: "141499353915",
  appId: "1:141499353915:web:86ab70270e990441ec451e",
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
