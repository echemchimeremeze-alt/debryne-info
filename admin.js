import { database, auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  ref,
  push,
  set
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


document.addEventListener("DOMContentLoaded", () => {

  const loginScreen = document.getElementById("loginScreen");
  const dashboard = document.getElementById("dashboard");

  const loginButton = document.getElementById("loginButton");
  const logoutButton = document.getElementById("logoutButton");

  const loginStatus = document.getElementById("loginStatus");
  const saveButton = document.getElementById("saveButton");
  const status = document.getElementById("status");


  // LOGIN
  loginButton.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      loginStatus.textContent =
        "⚠️ Please enter your email and password.";
      return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "⏳ Logging in...";

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      loginStatus.textContent =
        "✅ Login successful!";

    } catch (error) {

      console.error("LOGIN ERROR:", error);

      loginStatus.textContent =
        "❌ " + error.message;

      loginButton.disabled = false;
      loginButton.textContent = "🔐 Login";
    }

  });


  // CHECK LOGIN
  onAuthStateChanged(auth, (user) => {

    if (user) {

      loginScreen.style.display = "none";
      dashboard.style.display = "block";

    } else {

      loginScreen.style.display = "flex";
      dashboard.style.display = "none";

    }

  });


  // LOGOUT
  logoutButton.addEventListener("click", async () => {

    try {

      await signOut(auth);

    } catch (error) {

      console.error("LOGOUT ERROR:", error);

    }

  });


  // SAVE INFORMATION
  saveButton.addEventListener("click", async () => {

    const category =
      document.getElementById("category").value;

    const question =
      document.getElementById("question").value.trim();

    const answer =
      document.getElementById("answer").value.trim();


    if (!question || !answer) {

      status.textContent =
        "⚠️ Enter both the question and answer.";

      return;

    }


    saveButton.disabled = true;
    saveButton.textContent = "⏳ Saving...";


    try {

      const informationRef =
        push(ref(database, "information"));


      await set(informationRef, {

        category: category,

        question: question,

        answer: answer,

        createdAt:
          new Date().toISOString(),

        createdBy:
          auth.currentUser
            ? auth.currentUser.email
            : "Admin"

      });


      status.textContent =
        "✅ Information saved successfully!";


      document.getElementById("question").value = "";
      document.getElementById("answer").value = "";


    } catch (error) {

      console.error("SAVE ERROR:", error);

      status.textContent =
        "❌ Save failed: " + error.message;

    }


    saveButton.disabled = false;
    saveButton.textContent =
      "💾 Save Information";

  });

});
