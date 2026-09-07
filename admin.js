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


/* ==============================
   LOGIN
============================== */

loginButton.addEventListener(
  "click",
  async function () {

    const email =
      document.getElementById("email")
        .value.trim();

    const password =
      document.getElementById("password")
        .value;


    if (!email || !password) {

      loginStatus.innerText =
        "⚠️ Enter your email and password.";

      return;

    }


    loginButton.disabled = true;

    loginButton.innerText =
      "⏳ Logging in...";


    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      loginStatus.innerText =
        "✅ Login successful.";

    } catch (error) {

      console.error(error);

      loginStatus.innerText =
        "❌ Login failed. Check your email and password.";

      loginButton.disabled = false;

      loginButton.innerText =
        "🔐 Login";

    }

  }
);


/* ==============================
   CHECK LOGIN
============================== */

onAuthStateChanged(
  auth,
  function (user) {

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


/* ==============================
   LOGOUT
============================== */

logoutButton.addEventListener(
  "click",
  async function () {

    await signOut(auth);

  }
);


/* ==============================
   SAVE INFORMATION
============================== */

saveButton.addEventListener(
  "click",
  async function () {

    const category =
      document.getElementById("category")
        .value;

    const question =
      document.getElementById("question")
        .value.trim();

    const answer =
      document.getElementById("answer")
        .value.trim();


    if (!question || !answer) {

      status.innerText =
        "⚠️ Enter both the question and answer.";

      return;

    }


    saveButton.disabled = true;

    saveButton.innerText =
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
            auth.currentUser.email

        }
      );


      status.innerText =
        "✅ Information saved successfully!";


      document.getElementById(
        "question"
      ).value = "";

      document.getElementById(
        "answer"
      ).value = "";


    } catch (error) {

      console.error(error);

      status.innerText =
        "❌ Save failed: " +
        error.message;

    }


    saveButton.disabled = false;

    saveButton.innerText =
      "💾 Save Information";

  }
);
