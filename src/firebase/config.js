const firebase = require('firebase')
require('firebase/app')
require('firebase/auth')
require('firebase/storage');

const firebaseConfig = {
    apiKey: "AIzaSyApQlsN-3i6MkYyTqCPFMFkRJsqXUoBQiM",
    authDomain: "fakebook-images.firebaseapp.com",
    projectId: "fakebook-images",
    storageBucket: "fakebook-images.appspot.com",
    messagingSenderId: "224313676506",
    appId: "1:224313676506:web:ca6bbfcfc406f450fa8be3",
    measurementId: "G-HEHVEQF75H"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var admin = require("firebase-admin");

var serviceAccount = require("../../firebase-serviceAccountKey/fakebook-images-firebase-adminsdk-ydxyg-3c2a91306b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});