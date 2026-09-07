import { database } from "./firebase.js";

import {
  ref,
  get
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


/* =========================================================
   DEFAULT CONVERSATIONAL KNOWLEDGE
   These are only basic conversation responses.
   School information MUST come from Firebase.
========================================================= */

const defaultKnowledge = [
  {
    keywords: [
      "hello",
      "hi",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
      "how are you"
    ],

    answer:
      "👋 Hello! Welcome to Debryne Info.\n\n" +
      "I'm here to help you find verified information " +
      "about your school and department.\n\n" +
      "You can ask me about school activities, " +
      "Computer Science, NACOS, SUG, SOSSA, SIWES, " +
      "registration, admission, exams and more.\n\n" +
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


/* =========================================================
   LOAD INFORMATION FROM FIREBASE
========================================================= */

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


/* =========================================================
   TEXT CLEANING
========================================================= */

function cleanText(text) {

  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


/* =========================================================
   WORDS THAT SHOULD NOT AFFECT MATCHING
========================================================= */

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
  "might",

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
  "had",
  "been",

  "there",
  "any",
  "some",
  "more",
  "much",

  "please"
]);


/* =========================================================
   IMPORTANT WORDS
========================================================= */

function getImportantWords(text) {

  return cleanText(text)
    .split(" ")
    .filter(
      word =>
        word.length > 2 &&
        !stopWords.has(word)
    );

}


/* =========================================================
   INTENT DEFINITIONS
=========================================================

   This is the important upgrade.

   Debryne Info now understands the PURPOSE of a question,
   not just the words inside it.
========================================================= */

const intents = {

  registrationStatus: {

    phrases: [
      "has registration started",
      "is registration open",
      "is registration ongoing",
      "is registration available",
      "can i register now",
      "can we register now",
      "can students register",
      "are we registering",
      "registration open now"
    ],

    words: [
      "started",
      "open",
      "ongoing",
      "available",
      "register",
      "now"
    ]

  },


  registrationStart: {

    phrases: [
      "when will registration start",
      "when does registration start",
      "when is registration starting",
      "when will registration begin",
      "when does registration begin",
      "registration commencement",
      "registration starting date",
      "registration start date"
    ],

    words: [
      "when",
      "start",
      "starting",
      "begin",
      "beginning",
      "commencement"
    ]

  },


  registrationDeadline: {

    phrases: [
      "when is registration closing",
      "when does registration close",
      "when will registration close",
      "when is registration ending",
      "when does registration end",
      "registration closing date",
      "registration deadline",
      "last day for registration",
      "last day to register"
    ],

    words: [
      "closing",
      "close",
      "closing",
      "ending",
      "end",
      "deadline",
      "last",
      "due"
    ]

  },


  admissionForm: {

    phrases: [
      "is the admission form available",
      "is the admission form ongoing",
      "is admission form still available",
      "is admission form still ongoing",
      "can i get the admission form",
      "can i still get the form",
      "is the form still available",
      "is form picking ongoing",
      "is form picking still ongoing",
      "when is form picking"
    ],

    words: [
      "admission",
      "form",
      "picking",
      "applying",
      "application"
    ]

  },


  admissionDeadline: {

    phrases: [
      "when is admission form closing",
      "when does admission form close",
      "when is the admission deadline",
      "when is the application deadline",
      "last day to get the form",
      "last day for admission form"
    ],

    words: [
      "admission",
      "form",
      "deadline",
      "closing",
      "close",
      "last"
    ]

  },


  examDate: {

    phrases: [
      "when is the exam",
      "when are exams",
      "when is the next exam",
      "exam date",
      "examination date",
      "when will exams start",
      "when does exam start"
    ],

    words: [
      "exam",
      "examination",
      "test",
      "date",
      "start"
    ]

  },


  examDeadline: {

    phrases: [
      "when will exams end",
      "when do exams end",
      "when are exams ending",
      "last day of exams",
      "exam closing date"
    ],

    words: [
      "exam",
      "examination",
      "end",
      "ending",
      "last"
    ]

  },


  fees: {

    phrases: [
      "how much is school fees",
      "how much are school fees",
      "what is the school fee",
      "what are the school fees",
      "school fees amount",
      "school fee amount",
      "how much do i pay"
    ],

    words: [
      "fees",
      "fee",
      "school",
      "payment",
      "amount"
    ]

  },


  result: {

    phrases: [
      "when will results be released",
      "when is result coming out",
      "how do i check my result",
      "where can i check my result",
      "result checker",
      "academic result"
    ],

    words: [
      "result",
      "results",
      "checker",
      "released",
      "check"
    ]

  },


  siwes: {

    phrases: [
      "tell me about siwes",
      "what is siwes",
      "when is siwes",
      "siwes information",
      "industrial training",
      "industrial attachment"
    ],

    words: [
      "siwes",
      "industrial",
      "training",
      "attachment"
    ]

  },


  nacos: {

    phrases: [
      "tell me about nacos",
      "what is nacos",
      "nacos information",
      "nacos update",
      "computer society"
    ],

    words: [
      "nacos",
      "computer",
      "society"
    ]

  },


  sug: {

    phrases: [
      "tell me about sug",
      "what is sug",
      "sug information",
      "sug update",
      "student union"
    ],

    words: [
      "sug",
      "union",
      "student"
    ]

  },


  sossa: {

    phrases: [
      "tell me about sossa",
      "what is sossa",
      "sossa information",
      "sossa update",
      "school of science students association"
    ],

    words: [
      "sossa",
      "science",
      "students",
      "association"
    ]

  },


  department: {

    phrases: [
      "tell me about computer science",
      "computer science department",
      "information about computer science",
      "what is computer science",
      "computer science information"
    ],

    words: [
      "computer",
      "science",
      "department"
    ]

  }

};


/* =========================================================
   DETECT USER INTENT
========================================================= */

function detectIntent(question) {

  const text =
    cleanText(question);

  let bestIntent = null;

  let highestScore = 0;


  for (
    const intentName in intents
  ) {

    const intent =
      intents[intentName];

    let score = 0;


    /* EXACT PHRASE MATCH */

    for (
      const phrase of intent.phrases
    ) {

      const cleanPhrase =
        cleanText(phrase);

      if (
        text === cleanPhrase
      ) {

        score += 30;

      }

      else if (
        text.includes(cleanPhrase)
      ) {

        score += 18;

      }

    }


    /* WORD MATCH */

    const userWords =
      getImportantWords(question);


    for (
      const intentWord of intent.words
    ) {

      const cleanIntentWord =
        cleanText(intentWord);

      for (
        const userWord of userWords
      ) {

        if (
          userWord === cleanIntentWord ||
          userWord.startsWith(cleanIntentWord) ||
          cleanIntentWord.startsWith(userWord)
        ) {

          score += 3;

          break;

        }

      }

    }


    if (
      score > highestScore
    ) {

      highestScore =
        score;

      bestIntent =
        intentName;

    }

  }


  /*
     Only return an intent when there is
     enough evidence.
  */

  if (
    bestIntent &&
    highestScore >= 6
  ) {

    return bestIntent;

  }


  return null;

}


/* =========================================================
   FIREBASE ITEM INTENT MATCHING
========================================================= */

function firebaseItemMatchesIntent(
  item,
  intentName
) {

  if (!item) {
    return false;
  }


  const question =
    cleanText(item.question);


  const answer =
    cleanText(item.answer);


  const category =
    cleanText(item.category);


  /*
     Combine the stored information.

     This allows the admin to save:

     Question:
     "Has registration started?"

     Category:
     "Registration"

     Answer:
     "Registration has not started..."

     and still have Debryne Info understand it.
  */

  const storedText =
    question +
    " " +
    answer +
    " " +
    category;


  const intent =
    intents[intentName];


  if (!intent) {
    return false;
  }


  let score = 0;


  /* PHRASE MATCH */

  for (
    const phrase of intent.phrases
  ) {

    const cleanPhrase =
      cleanText(phrase);


    if (
      question.includes(cleanPhrase)
    ) {

      score += 20;

    }


    if (
      storedText.includes(cleanPhrase)
    ) {

      score += 5;

    }

  }


  /* INTENT WORD MATCH */

  for (
    const intentWord of intent.words
  ) {

    const word =
      cleanText(intentWord);


    if (
      question.includes(word)
    ) {

      score += 5;

    }


    else if (
      storedText.includes(word)
    ) {

      score += 2;

    }

  }


  /*
     CATEGORY BONUS

     Registration information gets priority
     for registration intents.
  */

  if (
    intentName.startsWith(
      "registration"
    )
  ) {

    if (
      category === "registration"
    ) {

      score += 15;

    }

  }


  if (
    intentName.startsWith(
      "admission"
    )
  ) {

    if (
      category === "admission"
    ) {

      score += 15;

    }

  }


  if (
    intentName.startsWith(
      "exam"
    )
  ) {

    if (
      category === "exams"
    ) {

      score += 15;

    }

  }


  if (
    intentName === "fees"
  ) {

    if (
      category === "fees"
    ) {

      score += 15;

    }

  }


  if (
    intentName === "siwes"
  ) {

    if (
      category === "siwes"
    ) {

      score += 15;

    }

  }


  if (
    intentName === "nacos"
  ) {

    if (
      category === "nacos"
    ) {

      score += 15;

    }

  }


  if (
    intentName === "sug"
  ) {

    if (
      category === "sug"
    ) {

      score += 15;

    }

  }


  if (
    intentName === "sossa"
  ) {

    if (
      category === "sossa"
    ) {

      score += 15;

    }

  }


  if (
    intentName === "department"
  ) {

    if (
      category === "department"
    ) {

      score += 15;

    }

  }


  return score;

}


/* =========================================================
   FIND ANSWER USING INTENT
========================================================= */

function findAnswerByIntent(
  question,
  information
) {

  const intent =
    detectIntent(question);


  /*
     If we cannot confidently identify
     the intent, don't guess.
  */

  if (!intent) {
    return null;
  }


  let bestMatch = null;

  let highestScore = 0;


  for (
    const item of information
  ) {

    if (
      !item ||
      !item.question ||
      !item.answer
    ) {

      continue;

    }


    const score =
      firebaseItemMatchesIntent(
        item,
        intent
      );


    if (
      score > highestScore
    ) {

      highestScore =
        score;

      bestMatch =
        item;

    }

  }


  /*
     Strong threshold.

     This prevents a random registration
     answer from being returned just because
     the word "registration" appeared.
  */

  if (
    bestMatch &&
    highestScore >= 12
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

      "✅ Verified information from Debryne Info." +

      "\n\n" +

      "Is there anything else you'd like to know? 😊"
    );

  }


  return null;

}


/* =========================================================
   GENERAL FIREBASE MATCH
   Used when no special intent is detected.
========================================================= */

function findGeneralFirebaseAnswer(
  question,
  information
) {

  const userText =
    cleanText(question);

  const userWords =
    getImportantWords(question);


  let bestMatch = null;

  let highestScore = 0;


  for (
    const item of information
  ) {

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
      getImportantWords(
        item.question
      );


    let score = 0;


    /* EXACT QUESTION */

    if (
      userText === storedQuestion
    ) {

      score += 40;

    }


    /* PHRASE */

    if (
      userText.includes(
        storedQuestion
      )
    ) {

      score += 20;

    }


    if (
      storedQuestion.includes(
        userText
      )
    ) {

      score += 15;

    }


    /* WORD MATCH */

    let matchedWords = 0;


    for (
      const userWord of userWords
    ) {

      for (
        const storedWord of storedWords
      ) {

        if (
          userWord === storedWord ||
          userWord.startsWith(storedWord) ||
          storedWord.startsWith(userWord)
        ) {

          score += 4;

          matchedWords++;

          break;

        }

      }

    }


    /* MATCH RATIO */

    if (
      userWords.length > 0
    ) {

      const ratio =
        matchedWords /
        userWords.length;


      if (
        ratio >= 0.8
      ) {

        score += 12;

      }

      else if (
        ratio >= 0.6
      ) {

        score += 7;

      }

    }


    /* CATEGORY */

    if (
      item.category &&
      userText.includes(
        cleanText(item.category)
      )
    ) {

      score += 8;

    }


    if (
      score > highestScore
    ) {

      highestScore =
        score;

      bestMatch =
        item;

    }

  }


  /*
     Strong threshold for general
     matching to avoid false answers.
  */

  if (
    bestMatch &&
    highestScore >= 10
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

      "✅ Verified information from Debryne Info." +

      "\n\n" +

      "Is there anything else you'd like to know? 😊"
    );

  }


  return null;

}


/* =========================================================
   DEFAULT CONVERSATION
========================================================= */

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
        text === cleanKeyword
      ) {

        score += 8;

      }

      else if (
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

      highestScore =
        score;

      bestMatch =
        item;

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


/* =========================================================
   UNKNOWN QUESTION
========================================================= */

function unknownAnswer() {

  return (
    "🤔 I couldn't find a verified answer " +
    "to that question yet.\n\n" +

    "I only answer questions using " +
    "verified information added to Debryne Info.\n\n" +

    "You can ask me about:\n\n" +

    "🏫 School\n" +
    "💻 Computer Science\n" +
    "🎓 NACOS\n" +
    "🏛️ SUG\n" +
    "🔬 SOSSA\n" +
    "🧑‍💻 SIWES\n" +
    "📝 Exams\n" +
    "📚 Registration\n" +
    "💰 School Fees\n" +
    "🎓 Admission\n" +
    "📊 Results\n\n" +

    "If the information has not been added " +
    "by an administrator yet, I won't guess. 😊"
  );

}


/* =========================================================
   MAIN ANSWER ENGINE
========================================================= */

async function findAnswer(
  question
) {

  const text =
    cleanText(question);


  /* THANK YOU */

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


  for (
    const phrase of thanksWords
  ) {

    if (
      text.includes(phrase)
    ) {

      return (
        "😊 You're always welcome!\n\n" +
        "I'm always here to help. " +
        "Is there anything else you'd like to know? 💎🤖"
      );

    }

  }


  /* GREETING */

  const greetings = [
    "hello",
    "hi",
    "hey",
    "good morning",
    "good afternoon",
    "good evening"
  ];


  for (
    const greeting of greetings
  ) {

    if (
      text === greeting ||
      text.startsWith(
        greeting + " "
      )
    ) {

      return (
        "👋 Hello! Welcome to Debryne Info.\n\n" +
        "I'm here to help you find verified information " +
        "about your school and department.\n\n" +
        "You can ask me about your school, " +
        "Computer Science, NACOS, SUG, SOSSA, " +
        "SIWES, registration, admission, exams and more.\n\n" +
        "How can I help you today? 😊"
      );

    }

  }


  /* GOODBYE */

  const goodbyeWords = [
    "bye",
    "goodbye",
    "see you",
    "see u",
    "good night"
  ];


  for (
    const phrase of goodbyeWords
  ) {

    if (
      text.includes(phrase)
    ) {

      return (
        "👋 Goodbye!\n\n" +
        "Have a great day! Feel free to come back " +
        "whenever you need verified information. 💎❤️"
      );

    }

  }


  /* LOAD VERIFIED INFORMATION */

  const firebaseInformation =
    await getFirebaseInformation();


  /* =====================================================
     1. TRY INTENT MATCH FIRST
  ====================================================== */

  const intentAnswer =
    findAnswerByIntent(
      question,
      firebaseInformation
    );


  if (
    intentAnswer
  ) {

    return intentAnswer;

  }


  /* =====================================================
     2. TRY GENERAL FIREBASE MATCH
  ====================================================== */

  const generalAnswer =
    findGeneralFirebaseAnswer(
      question,
      firebaseInformation
    );


  if (
    generalAnswer
  ) {

    return generalAnswer;

  }


  /* =====================================================
     3. BASIC CONVERSATION
  ====================================================== */

  const defaultAnswer =
    findDefaultAnswer(question);


  if (
    defaultAnswer
  ) {

    return defaultAnswer;

  }


  /* =====================================================
     4. NOTHING VERIFIED
  ====================================================== */

  return unknownAnswer();

}


/* =========================================================
   ADD MESSAGE
========================================================= */

function addMessage(
  text,
  type
) {

  const chatBox =
    document.getElementById(
      "chatBox"
    );


  if (!chatBox) {
    return;
  }


  const message =
    document.createElement(
      "div"
    );


  message.className =
    `message ${type}`;


  const avatar =
    document.createElement(
      "div"
    );


  avatar.className =
    "avatar";


  avatar.textContent =
    type === "bot"
      ? "D"
      : "U";


  const bubble =
    document.createElement(
      "div"
    );


  bubble.className =
    "bubble";


  bubble.innerText =
    text;


  message.appendChild(
    avatar
  );


  message.appendChild(
    bubble
  );


  chatBox.appendChild(
    message
  );


  const chatArea =
    document.querySelector(
      ".chat-area"
    );


  if (chatArea) {

    chatArea.scrollTop =
      chatArea.scrollHeight;

  }

}


/* =========================================================
   TYPING INDICATOR
========================================================= */

function showTyping() {

  const chatBox =
    document.getElementById(
      "chatBox"
    );


  if (!chatBox) {
    return;
  }


  const message =
    document.createElement(
      "div"
    );


  message.className =
    "message bot";


  message.id =
    "typingMessage";


  message.innerHTML = `
    <div class="avatar">D</div>

    <div class="bubble">
      🤔 Checking verified information...
    </div>
  `;


  chatBox.appendChild(
    message
  );


  const chatArea =
    document.querySelector(
      ".chat-area"
    );


  if (chatArea) {

    chatArea.scrollTop =
      chatArea.scrollHeight;

  }

}


/* =========================================================
   REMOVE TYPING
========================================================= */

function removeTyping() {

  const typing =
    document.getElementById(
      "typingMessage"
    );


  if (typing) {

    typing.remove();

  }

}


/* =========================================================
   SEND QUESTION
========================================================= */

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


  input.value =
    "";


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


  }


  catch (error) {


    console.error(
      "ANSWER ERROR:",
      error
    );


    removeTyping();


    addMessage(

      "❌ I couldn't connect to the " +
      "verified information database right now.\n\n" +

      "Please try again later. 😊",

      "bot"

    );

  }

}


/* =========================================================
   QUICK QUESTIONS
========================================================= */

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


/* =========================================================
   ENTER KEY
========================================================= */

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


/* =========================================================
   MAKE FUNCTIONS AVAILABLE TO HTML
========================================================= */

window.sendQuestion =
  sendQuestion;


window.askQuestion =
  askQuestion;
