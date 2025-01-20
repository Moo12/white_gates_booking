// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxX7eLxGzINQ85J1SoNwgTi1ZddtTzKe4",
  authDomain: "whitegatesbooking-569cc.firebaseapp.com",
  projectId: "whitegatesbooking-569cc",
  storageBucket: "whitegatesbooking-569cc.firebasestorage.app",
  messagingSenderId: "802507830090",
  appId: "1:802507830090:web:258ab0642635efbe6e87b3",
  measurementId: "G-HSRWN22GPW"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// init services
const projectFireStore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()
// const analytics = getAnalytics(app);

//timestamp 
const timestamp = firebase.firestore.FieldValue.serverTimestamp


export { projectFireStore, projectAuth, projectStorage, timestamp} 