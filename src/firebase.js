// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUqgwLWEI2yN6CS8Ljnqq1aXKuChVFgT0",
  authDomain: "realtor-clone-react-99e1a.firebaseapp.com",
  projectId: "realtor-clone-react-99e1a",
  storageBucket: "realtor-clone-react-99e1a.appspot.com",
  messagingSenderId: "694010844224",
  appId: "1:694010844224:web:644d04b45f31318c223ba5",
  measurementId: "G-PQHR87C26T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()