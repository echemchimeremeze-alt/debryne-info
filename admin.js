// ==========================================
// DEBRYNE INFO - ADMIN PANEL
// ==========================================

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getDatabase,
  ref,
  push,
  set
} from
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {

  apiKey:
    "AIzaSyDsUurd58zq5ltauZiDA4J3k_UR5JMI5Gs",

  authDomain:
    "debryne-info.firebaseapp.com",

  databaseURL:
    "https://debryne-info-default-rtdb.firebaseio.com/",

  projectId:
    "debryne-info",

  storageBucket:
    "debryne-info.firebasestorage.app",

  messagingSenderId:
    "505266636991",

  appId:
    "1:505266636991:web:e2a47f69524af12f6bde0a",

  measurementId:
    "G-2D9QNNQL69"

};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const database = getDatabase(app);


// ==========================================
// WAIT FOR PAGE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  const loginScreen =
    document.getElementById("loginScreen");

  const dashboard =
    document.getElementById("dashboard");

  const loginButton =
    document.getElementById("loginButton");

  const logoutButton =
    document.getElementById("logoutButton");

  const loginStatus =
    document.getElementById("loginStatus");

  const saveButton =
    document.getElementById("saveButton");

  const status =
    document.getElementById("status");


  // ========================================
  // CHECK ELEMENTS
  // ========================================

  if (!loginButton) {

    alert("Debryne Info Admin: Login button not found.");

    return;

  }


  // ========================================
  // LOGIN
  // ========================================

  loginButton.addEventListener("click", async () => {

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;


    if (!email) {

      loginStatus.textContent =
        "⚠️ Please enter your admin email.";

      return;

    }


    if (!password) {

      loginStatus.textContent =
        "⚠️ Please enter your password.";

      return;

    }


    loginButton.disabled = true;

    loginButton.textContent =
      "⏳ Logging in...";

    loginStatus.textContent =
      "";


    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );


      loginStatus.textContent =
        "✅ Login successful!";


    } catch (error) {

      console.error(
        "DEBRYNE LOGIN ERROR:",
        error
      );


      if (
        error.code ===
        "auth/invalid-credential"
      ) {

        loginStatus.textContent =
          "❌ Wrong email or password.";

      } else if (
        error.code ===
        "auth/user-not-found"
      ) {

        loginStatus.textContent =
          "❌ Admin account not found.";

      } else if (
        error.code ===
        "auth/wrong-password"
      ) {

        loginStatus.textContent =
          "❌ Wrong password.";

      } else if (
        error.code ===
        "auth/invalid-email"
      ) {

        loginStatus.textContent =
          "❌ Invalid email address.";

      } else {

        loginStatus.textContent =
          "❌ " + error.message;

      }


      loginButton.disabled = false;

      loginButton.textContent =
        "🔐 Login";

    }

  });


  // ========================================
  // LOGIN STATE
  // ========================================

  onAuthStateChanged(
    auth,
    (user) => {

      if (user) {

        loginScreen.style.display =
          "none";

        dashboard.style.display =
          "block";

      } else {

        loginScreen.style.display =
          "flex";

        dashboard.style.display =
          "none";

      }

    }
  );


  // ========================================
  // LOGOUT
  // ========================================

  if (logoutButton) {

    logoutButton.addEventListener(
      "click",
      async () => {

        try {

          await signOut(auth);

        } catch (error) {

          console.error(
            "LOGOUT ERROR:",
            error
          );

        }

      }
    );

  }


  // ========================================
  // SAVE INFORMATION
  // ========================================

  if (saveButton) {

    saveButton.addEventListener(
      "click",
      async () => {

        const category =
          document.getElementById("category").value;

        const question =
          document
            .getElementById("question")
            .value
            .trim();

        const answer =
          document
            .getElementById("answer")
            .value
            .trim();


        if (!question || !answer) {

          status.textContent =
            "⚠️ Enter both the question and answer.";

          return;

        }


        saveButton.disabled = true;

        saveButton.textContent =
          "⏳ Saving...";


        try {

          const informationRef =
            push(
              ref(
                database,
                "information"
              )
            );


          await set(
            informationRef,
            {

              category:
                category,

              question:
                question,

              answer:
                answer,

              createdAt:
                new Date().toISOString(),

              createdBy:
                auth.currentUser
                  ? auth.currentUser.email
                  : "Admin"

            }
          );


          status.textContent =
            "✅ Information saved successfully!";


          document.getElementById(
            "question"
          ).value = "";


          document.getElementById(
            "answer"
          ).value = "";


        } catch (error) {

          console.error(
            "SAVE ERROR:",
            error
          );


          status.textContent =
            "❌ Save failed: " +
            error.message;

        }


        saveButton.disabled = false;

        saveButton.textContent =
          "💾 Save Information";

      }
    );

  }

});
