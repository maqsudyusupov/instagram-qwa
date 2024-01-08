// // import firebase from "firebase/app";
// import firebaseConfig from "../credentials";
// import "firebase/auth";
// // compat packages are API compatible with namespaced code
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

// firebase.initializeApp = {
//     apiKey: "AIzaSyDlUdb8NubyV3uQtzIB-cJRMGtNw6GKqWU",
//   authDomain: "instagram-code-5eac0.firebaseapp.com",
//   projectId: "instagram-code-5eac0",
//   storageBucket: "instagram-code-5eac0.appspot.com",
//   messagingSenderId: "983946842488",
//   appId: "1:983946842488:web:3609e456ebe1419f10388d"
// };
// export const auth = firebase.auth();



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlUdb8NubyV3uQtzIB-cJRMGtNw6GKqWU",
  authDomain: "instagram-code-5eac0.firebaseapp.com",
  projectId: "instagram-code-5eac0",
  storageBucket: "instagram-code-5eac0.appspot.com",
  messagingSenderId: "983946842488",
  appId: "1:983946842488:web:3609e456ebe1419f10388d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);