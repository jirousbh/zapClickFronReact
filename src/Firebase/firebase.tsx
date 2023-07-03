import firebase from "firebase/compat/app";

// Add the Firebase products that you want to use
import "firebase/compat/auth";
import "firebase/compat/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBiqTTBi3g0bgNqpYTv1U5bRPkm4WVJ6gw",
  authDomain: "zapclick-9efd3.firebaseapp.com",
  databaseURL: "https://zapclick-9efd3-default-rtdb.firebaseio.com",
  projectId: "zapclick-9efd3",
  storageBucket: "zapclick-9efd3.appspot.com",
  messagingSenderId: "136662292535",
  appId: "1:136662292535:web:e392c92df1de7b85ccc7b2",
  measurementId: "G-5HT1J7CFH4",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
