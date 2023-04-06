// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyOmSnf4KsLox7YfWBfp2If0-R4H57rwA",
  authDomain: "reccoonwork.firebaseapp.com",
  projectId: "reccoonwork",
  storageBucket: "reccoonwork.appspot.com",
  messagingSenderId: "434233519230",
  appId: "1:434233519230:web:7e33d7de8bc421437abc2f",
  measurementId: "G-QNNSCLC3ZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

