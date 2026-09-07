import { database } from "./firebase.js";

import {
  ref,
  get
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


// ==========================================
// DEBRYNE INFO
// STUDENT CHATBOT
// ==========================================


// ==========================================
// DEFAULT INFORMATION
// ==========================================

const defaultKnowledge = [

  {
    keywords: ["hello", "hi", "hey"],
    answer:
      "👋 Hello! I'm Debryne Info.\n\n" +
      "I'm here to help you find verified information " +
      "about your school and department.\n\n" +
      "What would you like to know?"
  },

  {
    keywords: ["nacos"],
    answer:
      "💻 NACOS\n\n" +
      "NACOS stands for Nigeria Association of Computing Students.\n\n" +
      "Ask me about NACOS meetings, executives, events or announcements."
  },

  {
    keywords: ["sug"],
    answer:
      "🎓 SUG\n\n" +
      "SUG refers to the Students' Union Government.\n\n" +
      "I can provide information about SUG activities and announcements."
  },

  {
    keywords: ["sossa", "school of science"],
    answer:
      "🔬 SCHOOL OF SCIENCE\n\n" +
      "I can provide information about the School of Science, " +
      "its activities and departments."
  },

  {
    keywords: ["computer science", "computer science department"],
    answer:
      "💻 COMPUTER SCIENCE DEPARTMENT\n\n" +
      "I can help with verified information about Computer Science, " +
      "including courses, registration, SIWES and departmental notices."
  },

  {
    keywords: ["siwes", "industrial training"],
    answer:
      "🧑‍💻 SIWES / INDUSTRIAL TRAINING\n\n" +
      "I can help with SIWES information, requirements and departmental procedures."
  }

];


// ==========================================
// GET INFORMATION FROM FIREBASE
// ==========================================

async function getFirebaseInformation() {

  try {

    const informationRef =
      ref(database, "information");

    const snapshot =
      await get(informationRef);

    if (!snapshot.exists()) {

      return [];

    }

    return Object.values(snapshot.val());

  } catch (error) {

    console.error(
      "Firebase error:",
      error
    );

    return [];

  }

}


// ==========================================
// SEARCH FIREBASE
// ==========================================

function findBestFirebaseAnswer(
  question,
  information
) {

  const text =
    question.toLowerCase();

  let bestMatch = null;

  let highestScore = 0;


  for (const item of information) {

    if (!item.question || !item.answer) {
      continue;
    }

    const questionWords =
      item.question
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 3);


    let score = 0;


    for (const word of questionWords) {

      if (text.includes(word)) {

        score++;

      }

    }


    if (score > highestScore) {

      highestScore = score;

      bestMatch = item;

    }

  }


  if (
    bestMatch &&
    highestScore >= 1
  ) {

    return (
      "📚 " +
      (bestMatch.category || "GENERAL")
        .toUpperCase() +

      "\n\n" +

      bestMatch.answer +

      "\n\n" +

      "✅ Verified information from Debryne Info."
    );

  }


  return null;

}


// ==========================================
// FIND ANSWER
// ==========================================

async function findAnswer(question) {

  // Search Firebase first

  const firebaseInformation =
    await getFirebaseInformation();


  const firebaseAnswer =
    findBestFirebaseAnswer(
      question,
      firebaseInformation
    );


  if (firebaseAnswer) {

    return firebaseAnswer;

  }


  // Search default information

  const text =
    question.toLowerCase();


  for (const item of defaultKnowledge) {

    for (const keyword of item.keywords) {

      if (text.includes(keyword)) {

        return item.answer;

      }

    }

  }


  // Nothing found

  return (
    "🤔 I couldn't find a verified answer " +
    "to that question yet.\n\n" +

    "Try asking about:\n\n" +

    "🏫 School\n" +
    "💻 Computer Science\n" +
    "🎓 NACOS\n" +
    "🏛️ SUG\n" +
    "🔬 SOSSA\n" +
    "🧑‍💻 SIWES\n" +
    "📝 Exams\n" +
    "📚 Registration"
  );

}


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(
  text,
  type
) {

  const chatBox =
    document.getElementById("chatBox");


  const message =
    document.createElement("div");


  message.className =
    `message ${type}`;


  const avatar =
    document.createElement("div");


  avatar.className =
    "avatar";


  avatar.textContent =
    type === "bot"
      ? "D"
      : "U";


  const bubble =
    document.createElement("div");


  bubble.className =
    "bubble";


  bubble.innerText =
    text;


  message.appendChild(avatar);

  message.appendChild(bubble);

  chatBox.appendChild(message);


  const chatArea =
    document.querySelector(".chat-area");


  chatArea.scrollTop =
    chatArea.scrollHeight;

}


// ==========================================
// TYPING MESSAGE
// ==========================================

function showTyping() {

  const chatBox =
    document.getElementById("chatBox");


  const message =
    document.createElement("div");


  message.className =
    "message bot";


  message.id =
    "typingMessage";


  message.innerHTML = `
    <div class="avatar">D</div>
    <div class="bubble">🤔 Thinking...</div>
  `;


  chatBox.appendChild(message);


  const chatArea =
    document.querySelector(".chat-area");


  chatArea.scrollTop =
    chatArea.scrollHeight;

}


function removeTyping() {

  const typing =
    document.getElementById(
      "typingMessage"
    );


  if (typing) {

    typing.remove();

  }

}


// ==========================================
// SEND QUESTION
// ==========================================

async function sendQuestion() {

  const input =
    document.getElementById(
      "questionInput"
    );


  const question =
    input.value.trim();


  if (!question) {

    return;

  }


  addMessage(
    question,
    "user"
  );


  input.value = "";


  showTyping();


  try {

    const answer =
      await findAnswer(question);


    removeTyping();


    addMessage(
      answer,
      "bot"
    );

  } catch (error) {

    console.error(error);


    removeTyping();


    addMessage(
      "❌ Sorry, something went wrong while checking the information.",
      "bot"
    );

  }

}


// ==========================================
// QUICK QUESTIONS
// ==========================================

function askQuestion(
  question
) {

  const input =
    document.getElementById(
      "questionInput"
    );


  input.value =
    question;


  sendQuestion();

}


// Make available to HTML buttons

window.sendQuestion =
  sendQuestion;


window.askQuestion =
  askQuestion;


// ==========================================
// ENTER KEY
// ==========================================

const input =
  document.getElementById(
    "questionInput"
  );


if (input) {

  input.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key === "Enter"
      ) {

        event.preventDefault();

        sendQuestion();

      }

    }
  );

               }
