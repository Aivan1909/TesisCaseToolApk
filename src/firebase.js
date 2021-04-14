import firebase from 'firebase/app'
import 'firebase/firestore'

export const db = firebase.initializeApp({
    apiKey: "AIzaSyDKRKgkpOYnu6C5x8-FbIpSY2_rIW0ecng",
    authDomain: "tesiscase.firebaseapp.com",
    projectId: "tesiscase",
    storageBucket: "tesiscase.appspot.com",
    messagingSenderId: "845140039633",
    appId: "1:845140039633:web:cc7d2249d41b24cf1fb2f0"
  }).firestore();
  // Initialize Firebase
  export const {T_Lenguajes} = firebase.firestore;

  db.settings({ timestampsInSnapshots: true })
