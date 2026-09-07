import { database } from "./firebase.js";

import {
  ref,
  get
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


// ==========================================
// DEFAULT KNOWLEDGE
// ==========================================

const defaultKnowledge = [

  {
    keywords: [
      "hello",
      "hi",
      "hey",
      "good morning",
      "good afternoon",
      "good evening"
    ],

    answer:
      "👋 Hello! Welcome to Debryne Info.\n\n" +
      "I'm here to help you find verified information " +
      "about your school and department.\n\n" +
      "You can ask me about school activities, " +
      "Computer Science, NACOS, SUG, SOSSA, SIWES, " +
      "registration, exams and more.\n\n" +
      "How can I help you today? 😊"
  },

  {
    keywords: [
      "thank you",
      "thanks",
      "thank u",
      "thankyou",
      "thx",
      "tnx",
      "i appreciate",
      "appreciate you",
      "much appreciated"
    ],

    answer:
      "😊 You're always welcome!\n\n" +
      "I'm always here to help. " +
      "Is there anything else you'd like to know? 💎🤖"
  },

  {
    keywords: [
      "bye",
      "goodbye",
      "see you",
      "see u",
      "good night"
    ],

    answer:
      "👋 Goodbye!\n\n" +
      "Have a great day! Feel free to come back " +
      "whenever you need verified information. 💎❤️"
  }

];


// ==========================================
// GET FIREBASE INFORMATION
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
      "Firebase loading error:",
      error
    );

    return [];
  }
}


// ==========================================
// CLEAN TEXT
// ==========================================

function cleanText(text) {

  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

}


// ==========================================
// STOP WORDS
// ==========================================

const stopWords = new Set([

  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "when",
  "what",
  "where",
  "who",
  "how",
  "why",
  "can",
  "could",
  "would",
  "should",
  "do",
  "does",
  "did",
  "will",
  "may",
  "please",
  "tell",
  "me",
  "about",
  "for",
  "to",
  "of",
  "in",
  "on",
  "at",
  "and",
  "or",
  "my",
  "your",
  "i",
  "we",
  "you",
  "they",
  "it",
  "be",
  "from",
  "this",
  "that",
  "with",
  "has",
  "have",
  "been"

]);


// ==========================================
// IMPORTANT WORDS
// ==========================================

function getImportantWords(text) {

  return cleanText(text)
    .split(" ")
    .filter(word =>
      word.length > 2 &&
      !stopWords.has(word)
    );

}


// ==========================================
// WORD SIMILARITY
// ==========================================

function wordsAreSimilar(
  word1,
  word2
) {

  if (word1 === word2) {
    return true;
  }

  if (
    word1.startsWith(word2) ||
    word2.startsWith(word1)
  ) {
    return true;
  }

  if (
    word1.endsWith("s") &&
    word1.slice(0, -1) === word2
  ) {
    return true;
  }

  if (
    word2.endsWith("s") &&
    word2.slice(0, -1) === word1
  ) {
    return true;
  }

  return false;
}


// ==========================================
// FIND BEST FIREBASE ANSWER
// ==========================================

function findBestFirebaseAnswer(
  question,
  information
) {

  const userText =
    cleanText(question);

  const userWords =
    getImportantWords(question);

  let bestMatch = null;
  let highestScore = 0;

  for (const item of information) {

    if (
      !item ||
      !item.question ||
      !item.answer
    ) {
      continue;
    }

    const storedQuestion =
      cleanText(item.question);

    const storedWords =
      getImportantWords(item.question);

    let score = 0;


    // Exact phrase

    if (
      userText.includes(storedQuestion) ||
      storedQuestion.includes(userText)
    ) {

      score += 10;

    }


    // Word matching

    for (const userWord of userWords) {

      for (const storedWord of storedWords) {

        if (
          wordsAreSimilar(
            userWord,
            storedWord
          )
        ) {

          score += 3;

        }

      }

    }


    // Category matching

    if (item.category) {

      const category =
        cleanText(item.category);

      if (
        userText.includes(category)
      ) {

        score += 4;

      }

    }


    // Topic matching

    const topicWords = [

      "registration",
      "exam",
      "exams",
      "examination",
      "fees",
      "fee",
      "school",
      "siwes",
      "nacos",
      "sug",
      "sossa",
      "department",
      "computer",
      "science",
      "semester",
      "result",
      "results",
      "admission",
      "screening",
      "clearance"

    ];


    for (const topic of topicWords) {

      if (
        userText.includes(topic) &&
        storedQuestion.includes(topic)
      ) {

        score += 5;

      }

    }


    if (
      score > highestScore
    ) {

      highestScore = score;
      bestMatch = item;

    }

  }


  if (
    bestMatch &&
    highestScore >= 3
  ) {

    return (

      "📚 " +
      (
        bestMatch.category ||
        "GENERAL"
      ).toUpperCase() +

      "\n\n" +

      bestMatch.answer +

      "\n\n" +

      "✅ Verified information from Debryne Info." +

      "\n\n" +

      "Is there anything else you'd like to know? 😊"

    );

  }

  return null;

}


// ==========================================
// DEFAULT ANSWER
// ==========================================

function findDefaultAnswer(
  question
) {

  const text =
    cleanText(question);

  let bestMatch = null;
  let highestScore = 0;


  for (
    const item of defaultKnowledge
  ) {

    let score = 0;


    for (
      const keyword of item.keywords
    ) {

      const cleanKeyword =
        cleanText(keyword);


      if (
        text.includes(cleanKeyword)
      ) {

        score +=
          cleanKeyword.includes(" ")
            ? 5
            : 3;

      }

    }


    if (
      score > highestScore
    ) {

      highestScore = score;
      bestMatch = item;

    }

  }


  if (
    bestMatch &&
    highestScore >= 3
  ) {

    return bestMatch.answer;

  }


  return null;

}


// ==========================================
// FIND ANSWER
// ==========================================

async function findAnswer(
  question
) {

  const text =
    cleanText(question);


  // ========================================
  // THANK YOU — CHECK FIRST
  // ========================================

  const thanksWords = [

    "thank you",
    "thanks",
    "thank u",
    "thankyou",
    "thx",
    "tnx",
    "i appreciate",
    "appreciate you",
    "much appreciated"

  ];


  for (const phrase of thanksWords) {

    if (text.includes(phrase)) {

      return (
        "😊 You're always welcome!\n\n" +
        "I'm always here to help. " +
        "Is there anything else you'd like to know? 💎🤖"
      );

    }

  }


  // ========================================
  // GREETINGS — CHECK FIRST
  // ========================================

  const greetings = [

    "hello",
    "hi",
    "hey",
    "good morning",
    "good afternoon",
    "good evening"

  ];


  for (const greeting of greetings) {

    if (
      text === greeting ||
      text.startsWith(greeting + " ")
    ) {

      return (

        "👋 Hello! Welcome to Debryne Info.\n\n" +

        "I'm here to help you find verified information " +
        "about your school and department.\n\n" +

        "You can ask me about your school, " +
        "Computer Science, NACOS, SUG, SOSSA, " +
        "SIWES, registration, exams and more.\n\n" +

        "How can I help you today? 😊"

      );

    }

  }


  // ========================================
  // GOODBYE — CHECK FIRST
  // ========================================

  const goodbyeWords = [

    "bye",
    "goodbye",
    "see you",
    "see u",
    "good night"

  ];


  for (const phrase of goodbyeWords) {

    if (text.includes(phrase)) {

      return (

        "👋 Goodbye!\n\n" +

        "Have a great day! Feel free to come back " +

        "whenever you need verified information. 💎❤️"

      );

    }

  }


  // ========================================
  // FIREBASE VERIFIED INFORMATION
  // ========================================

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


  // ========================================
  // DEFAULT KNOWLEDGE
  // ========================================

  const defaultAnswer =
    findDefaultAnswer(question);


  if (defaultAnswer) {

    return defaultAnswer;

  }


  // ========================================
  // UNKNOWN QUESTION
  // ========================================

  return (

    "🤔 I couldn't find a verified answer " +
    "to that question yet.\n\n" +

    "You can ask me about:\n\n" +

    "🏫 School\n" +
    "💻 Computer Science\n" +
    "🎓 NACOS\n" +
    "🏛️ SUG\n" +
    "🔬 SOSSA\n" +
    "🧑‍💻 SIWES\n" +
    "📝 Exams\n" +
    "📚 Registration\n" +
    "💰 School Fees\n\n" +

    "If you have another question, feel free " +
    "to ask me. 😊"

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
    document.getElementById(
      "chatBox"
    );


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
    document.querySelector(
      ".chat-area"
    );


  if (chatArea) {

    chatArea.scrollTop =
      chatArea.scrollHeight;

  }

}


// ==========================================
// TYPING INDICATOR
// ==========================================

function showTyping() {

  const chatBox =
    document.getElementById(
      "chatBox"
    );


  const message =
    document.createElement("div");


  message.className =
    "message bot";


  message.id =
    "typingMessage";


  message.innerHTML = `

    <div class="avatar">
      D
    </div>

    <div class="bubble">
      🤔 Checking verified information...
    </div>

  `;


  chatBox.appendChild(message);


  const chatArea =
    document.querySelector(
      ".chat-area"
    );


  if (chatArea) {

    chatArea.scrollTop =
      chatArea.scrollHeight;

  }

}


// ==========================================
// REMOVE TYPING
// ==========================================

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


  if (!input) {

    return;

  }


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
      await findAnswer(
        question
      );


    removeTyping();


    addMessage(
      answer,
      "bot"
    );


  } catch (error) {

    console.error(
      "ANSWER ERROR:",
      error
    );


    removeTyping();


    addMessage(

      "❌ I couldn't connect to the " +
      "information database right now.\n\n" +

      "Please try again later. 😊",

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


  if (!input) {

    return;

  }


  input.value =
    question;


  sendQuestion();

}


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


// ==========================================
// MAKE FUNCTIONS AVAILABLE
// ==========================================

window.sendQuestion =
  sendQuestion;


window.askQuestion =
  askQuestion;
