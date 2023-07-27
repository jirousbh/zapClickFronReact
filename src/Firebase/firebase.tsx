import firebase from "firebase/compat/app";

// Add the Firebase products that you want to use
import "firebase/compat/auth";
import "firebase/compat/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDm3M53asD2voJcYkhEixNvDBzQBdY7Kf0",
  authDomain: "test-zap-click.firebaseapp.com",
  projectId: "test-zap-click",
  databaseURL: "https://test-zap-click-default-rtdb.firebaseio.com",
  storageBucket: "test-zap-click.appspot.com",
  messagingSenderId: "993297592200",
  appId: "1:993297592200:web:22b060570774219152d43d",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
