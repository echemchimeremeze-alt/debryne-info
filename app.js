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
      "👋 Hello! I'm Debryne Info.\n\n" +
      "I'm here to help you find verified information " +
      "about your school and department.\n\n" +
      "What would you like to know?"
  },


  {
    keywords: [
      "thank you",
      "thanks",
      "thank u",
      "thx",
      "i appreciate",
      "appreciate you"
    ],

    answer:
      "😊 You're always welcome!\n\n" +
      "I'm always here to help. 💎🤖"
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
      "Have a great day and stay informed with Debryne Info. 💎"
  },


  {
    keywords: [
      "nacos",
      "computing students",
      "computer students association"
    ],

    answer:
      "🎓 NACOS\n\n" +
      "NACOS stands for Nigeria Association of Computing Students.\n\n" +
      "Ask me about NACOS meetings, executives, events and announcements."
  },


  {
    keywords: [
      "sug",
      "students union",
      "student union"
    ],

    answer:
      "🏛️ SUG\n\n" +
      "SUG refers to the Students' Union Government.\n\n" +
      "I can provide information about SUG activities and announcements."
  },


  {
    keywords: [
      "sossa",
      "school of science",
      "science students association"
    ],

    answer:
      "🔬 SOSSA\n\n" +
      "SOSSA refers to the School of Science Students Association.\n\n" +
      "Ask me about verified SOSSA information and announcements."
  },


  {
    keywords: [
      "computer science",
      "cs department",
      "computing department"
    ],

    answer:
      "💻 COMPUTER SCIENCE\n\n" +
      "I can help with verified information about the Computer Science Department, " +
      "including courses, registration, SIWES and departmental notices."
  },


  {
    keywords: [
      "siwes",
      "industrial training",
      "it placement",
      "student industrial work"
    ],

    answer:
      "🧑‍💻 SIWES\n\n" +
      "SIWES refers to Students Industrial Work Experience Scheme.\n\n" +
      "Ask me about SIWES requirements, procedures and announcements."
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
// GET IMPORTANT WORDS
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
// SIMPLE WORD SIMILARITY
// ==========================================

function wordsAreSimilar(word1, word2) {

  if (word1 === word2) {

    return true;

  }


  // registration / registrations
  if (
    word1.startsWith(word2) ||
    word2.startsWith(word1)
  ) {

    return true;

  }


  // exam / exams
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
// SMART FIREBASE MATCHING
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


    // ======================================
    // EXACT PHRASE MATCH
    // ======================================

    if (
      userText.includes(storedQuestion) ||
      storedQuestion.includes(userText)
    ) {

      score += 10;

    }


    // ======================================
    // WORD MATCHING
    // ======================================

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


    // ======================================
    // CATEGORY MATCH
    // ======================================

    if (item.category) {

      const category =
        cleanText(item.category);


      if (
        userText.includes(category)
      ) {

        score += 4;

      }

    }


    // ======================================
    // IMPORTANT TOPIC WORDS
    // ======================================

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


    // ======================================
    // SAVE BEST MATCH
    // ======================================

    if (
      score > highestScore
    ) {

      highestScore = score;

      bestMatch = item;

    }

  }


  // ========================================
  // RETURN ONLY STRONG ENOUGH MATCH
  // ========================================

  if (
    bestMatch &&
    highestScore >= 3
  ) {

    return (

      "📚 " +

      (
        bestMatch.category ||
        "GENERAL"
      )
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
// DEFAULT KNOWLEDGE MATCHING
// ==========================================

function findDefaultAnswer(question) {

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


      // Exact phrase
      if (
        text.includes(cleanKeyword)
      ) {

        score +=
          cleanKeyword.includes(" ")
            ? 5
            : 3;

      }


      // Individual words
      const keywordWords =
        getImportantWords(keyword);


      const userWords =
        getImportantWords(question);


      for (
        const keywordWord of keywordWords
      ) {

        for (
          const userWord of userWords
        ) {

          if (
            wordsAreSimilar(
              keywordWord,
              userWord
            )
          ) {

            score += 2;

          }

        }

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

async function findAnswer(question) {

  // Firebase verified information FIRST
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


  // Then default knowledge
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

    "Try asking about:\n\n" +

    "🏫 School\n" +
    "💻 Computer Science\n" +
    "🎓 NACOS\n" +
    "🏛️ SUG\n" +
    "🔬 SOSSA\n" +
    "🧑‍💻 SIWES\n" +
    "📝 Exams\n" +
    "📚 Registration\n" +
    "💰 School Fees\n\n" +

    "If the information is not yet available, " +
    "please check official school announcements."

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
// SHOW TYPING
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
      "Please try again.",

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
// MAKE FUNCTIONS AVAILABLE TO HTML
// ==========================================

window.sendQuestion =
  sendQuestion;


window.askQuestion =
  askQuestion;
