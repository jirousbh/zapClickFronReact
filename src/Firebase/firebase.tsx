import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
// Add the Firebase products that you want to use
import "firebase/compat/auth";
import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

import * as FirebaseService from "../services/FirebaseService";

import { ttlStorage } from "../utils/ttl-storage";

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
const functions = getFunctions(getApp());

let verboseFunctions = false;

// if (
// 	location.hostname === "localhost" ||
// 	location.hostname === "127.0.0.1" ||
// 	location.hostname === "0.0.0.0"
// ) {
// 	functions.useEmulator("localhost", 5001);
// 	db.useEmulator("localhost", 8070);
// 	auth.useEmulator("http://localhost:9099");
// } else if (
// 	location.hostname === "xmicroserver.ddns.net" ||
// 	location.hostname === "192.168.1.14"
// ) {
connectFunctionsEmulator(functions, "xmicroserver.ddns.net", 5002);
db.useEmulator("xmicroserver.ddns.net", 8070);
auth.useEmulator("http://xmicroserver.ddns.net:9099");
// }

FirebaseService.init(ttlStorage, functions, verboseFunctions);

export { db, auth, functions };
