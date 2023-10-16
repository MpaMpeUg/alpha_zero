// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALo8POw98gtpOEhcVsBvjHGywwtsoj2ho",
  authDomain: "mpampe-344006.firebaseapp.com",
  projectId: "mpampe-344006",
  storageBucket: "mpampe-344006.appspot.com",
  messagingSenderId: "1072830894140",
  appId: "1:1072830894140:web:8cbd15bf6a1197f30ef339",
  measurementId: "G-P3VY42ZSEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);