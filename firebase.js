import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsUurd58zq5ltauZiDA4J3k_UR5JMI5Gs",
  authDomain: "debryne-info.firebaseapp.com",
  databaseURL: "https://debryne-info-default-rtdb.firebaseio.com",
  projectId: "debryne-info",
  storageBucket: "debryne-info.firebasestorage.app",
  messagingSenderId: "505266636991",
  appId: "1:505266636991:web:e2a47f69524af12f6bde0a",
  measurementId: "G-2D9QNNQL69"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { app, database };
