// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-mern-c6168.firebaseapp.com",
  projectId: "blog-mern-c6168",
  storageBucket: "blog-mern-c6168.appspot.com",
  messagingSenderId: "983920453411",
  appId: "1:983920453411:web:45999bbc9f750b5d6ece96",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
