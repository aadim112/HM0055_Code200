// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDatabase} from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,RecaptchaVerifier,signInWithPhoneNumber } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsMnXuL6HI1gsHs8es96Kka4iq8uhaEW0",
  authDomain: "healthlog-24854.firebaseapp.com",
  databaseURL:'https://healthlog-24854-default-rtdb.firebaseio.com/',
  projectId: "healthlog-24854",
  storageBucket: "healthlog-24854.firebasestorage.app",
  messagingSenderId: "1083101193290",
  appId: "1:1083101193290:web:467c4736a328184a2cf2b3",
  measurementId: "G-ECK3Z3PP77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.useDeviceLanguage();
const db = getDatabase(app);
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,signInWithPhoneNumber,RecaptchaVerifier };
export default db;