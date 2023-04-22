// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKSkowGHKoyyesPVG5stLK9K9zPjCcOhQ",
  authDomain: "netflix-clone-2cff1.firebaseapp.com",
  projectId: "netflix-clone-2cff1",
  storageBucket: "netflix-clone-2cff1.appspot.com",
  messagingSenderId: "204682191732",
  appId: "1:204682191732:web:909e5a11ed826515748221",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();

export default app;
export { auth, db };
