// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDVJ2hmym6FtZQru73xWDTfv2VE0O4hgQs",
    authDomain: "forge-4f0f2.firebaseapp.com",
    projectId: "forge-4f0f2",
    storageBucket: "forge-4f0f2.firebasestorage.app",
    messagingSenderId: "375710553484",
    appId: "1:375710553484:web:91628c45e9d8f12a8bf2a9",
    measurementId: "G-CGF9WC9LVS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);