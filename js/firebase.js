/* File: js/firebase.js */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoyBtYmm...",
  authDomain: "gps-gsm-dev.firebaseapp.com",
  databaseURL: "https://gps-gsm-dev-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gps-gsm-dev",
  storageBucket: "gps-gsm-dev.appspot.com",
  messagingSenderId: "622933364583",
  appId: "1:622933364583:web:5c13e64d95947325f169c2",
  measurementId: "G-XRJW9L3KTL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Export the database so other files can use it
export { database };
