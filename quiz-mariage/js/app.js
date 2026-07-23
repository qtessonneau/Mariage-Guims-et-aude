import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig, ADMIN_CODE, isFirebaseConfigured } from "./firebase-config.js";

/* ─── Configuration du quiz ─── */
const CONFIG = {
  coupleNames: "Aude & Guims",
  bride: "Aude",
  groom: "Guims",
};

// correct : numéro(s) de la bonne réponse de 1 à 4
// Une seule : correct: 2
// Plusieurs : correct: [1, 3]  → les réponses 1 et 3 sont acceptées
const QUESTIONS = [
  {
    question: `Où ${CONFIG.bride} et ${CONFIG.groom} se sont-ils rencontrés pour la première fois ?`,
    answers: ["À Paris", "En vacances à la montagne", "Via des amis communs", "Au BTS"],
    correct: 4,
  },
  {
    question: `Quel est la date de naissance de ${CONFIG.groom} ?`,
    answers: ["11 Août", "30 Février", "15 Juillet", "3 Septembre"],
    correct: 1,
  },
  {
    question: `Quel pays ${CONFIG.bride} a visité ?`,
    answers: ["Brésil", "Kenya", "Sri-lanka", "Albanie"],
    correct: 3,
  },
  {
    question: "Combien d'invité sommes nous aujourd'hui ?",
    answers: ["51", "64", "70", "82"],
    correct: 2,
  },
  {
    question: "Où la demande en mariage a eu lieu ?",
    answers: ["Au restaurant", "En voyage", "Chez eux", "Dans un parc"],
    correct: 2,
  },
  {
    question: `Où ${CONFIG.groom} a t'il vu Iron Maiden ?`,
    answers: ["Download Festival", "Motocultor", "Resurrection fest", "Coachella"],
    correct: 1,
  },
  {
    question: `Quel est la couleur de la robe blanche de ${CONFIG.bride} ?`,
    answers: ["Blanc", "Ivoire", "Blush", "Champagne"],
    correct: 1,
  },
  {
    question: "Qui risque de finir la soirée le plus pompette ?",
    answers: ["Aude", "Guims", "Les témoins", "Tout le monde"],
    correct: 4,
  },
  {
    question: `Qui dit le plus souvent « Je t'aime » ?`,
    answers: [CONFIG.bride, CONFIG.groom, "Lara Fabian", "Les deux autant l'un que l'autre"],
    correct: 4,
  },
  {
    question: "Quel est le surnom que se donnent les mariés ?",
    answers: ["Mon cœur", "Mon chat", "Mon Tyrannosaure", "Mon amour"],
    correct: 2,
  },
  {
    question: `Avec qui ${CONFIG.groom} a t'il été en coloc ?`,
    answers: ["Tom et Quentin", "Baptiste et Romain", "Thomas et Chris", "Tristan et Maxime"],
    correct: 3,
  },
  {
    question: "Quel animal a vécu (ou va vivre) avec les mariés ?",
    answers: ["Basile le renard empaillé", "Mr Dupont le chat", "Edwige la chouette empaillée", "Les trois"],
    correct: [1, 2],
  },
  {
    question: "Que veux dire BAM ?",
    answers: ["Be Aware of Music", "Bonobo in Mulhouse", "Boite À Musique", "Banjo Accordéon et Mandoline"],
    correct: 3,
  },
  {
    question: `Quelle vidéo de Bien-être Simple ${CONFIG.bride} a présenté ?`,
    answers: ["J'ai échappé à une secte", "Les secrets de Sharon", "La santé mentale en entreprise", "Les hémorroïdes, ce fléau"],
    correct: 2,
  },
  {
    question: `A quelle course a participé ${CONFIG.groom} ?`,
    answers: ["10km du Beaujolais", "Semi-marathon de Paris", "Marathon de Paris", "Course du nouvel an 2022"],
    correct: 2,
  },
  {
    question: `Où est-ce que le magnifique couple formé par ${CONFIG.groom} et ${CONFIG.bride} n'a t'il pas vécu ?`,
    answers: ["Paris", "Biarritz", "Canada", "Valencia"],
    correct: 2,
  },
  {
    question: `Quel est le deuxième prénom de ${CONFIG.bride} ?`,
    answers: ["Marie", "Camille", "Maïté", "Emaztegaia"],
    correct: 3,
  },
  {
    question: `Quel sport ${CONFIG.bride} n'a pas pratiqué ?`,
    answers: ["Voile", "Ski", "Equitation", "Judo"],
    correct: 4,
  },
  {
    question: "Comment s'appelle le lieu du mariage ?",
    answers: ["Domaine Santa Maria", "Domaine de Larbéou", "Domaine Etxezahar", "J'avoue j'ai pas regardé le faire-part"],
    correct: 2,
  },
  {
    question: "Quel est l'agrûme emblême du couple ?",
    answers: ["L'orange", "Le pomello", "Le pamplemousse", "Le citron"],
    correct: 4,
  },
];

/** Vérifie si une réponse est correcte (index 0-based) */
function isCorrectAnswer(question, answerIndex) {
  const { correct } = question;
  if (Array.isArray(correct)) {
    return correct.some((n) => n - 1 === answerIndex);
  }
  return correct - 1 === answerIndex;
}

const MESSAGES = [
  { min: 0, max: 5, title: "Il faut mieux les connaître !", message: "Pas de panique — on est tous venu pour la bouffe en vrai" },
  { min: 6, max: 10, title: "Pas mal !", message: "Le Patxaran va vous aider à récolter plus d'informations." },
  { min: 11, max: 15, title: "Tout à fait respectable", message: "Vous connaissez les mariés ! Il reste encore quelques secrets à découvrir.. Apéro ?" },
  { min: 16, max: 18, title: "Très bien !", message: "Vous êtes malheureusement proche du couple, force à vous." },
  { min: 19, max: 20, title: "Expert du couple !", message: "Lèche botte va !." },
];

/* ─── Firebase ─── */
let db = null;
let quizClosed = false;
let allScores = [];
let unsubscribeScores = null;
let unsubscribeConfig = null;

if (isFirebaseConfigured()) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (err) {
    console.error("Firebase init error:", err);
  }
}

/* ─── État ─── */
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let player = { firstName: "", lastName: "" };
let scoreSubmitted = false;
const adminParam = new URLSearchParams(window.location.search).get("admin")?.trim();
const isAdmin =
  window.QUIZ_ADMIN_MODE === true ||
  adminParam === ADMIN_CODE ||
  window.location.pathname.includes("admin.html");

/* ─── DOM ─── */
const screens = {
  welcome: document.getElementById("screen-welcome"),
  quiz: document.getElementById("screen-quiz"),
  results: document.getElementById("screen-results"),
  leaderboard: document.getElementById("screen-leaderboard"),
  admin: document.getElementById("screen-admin"),
};

const elements = {
  coupleNames: document.getElementById("couple-names"),
  welcomeForm: document.getElementById("welcome-form"),
  firstName: document.getElementById("first-name"),
  lastName: document.getElementById("last-name"),
  formError: document.getElementById("form-error"),
  quizClosedNotice: document.getElementById("quiz-closed-notice"),
  btnStart: document.getElementById("btn-start"),
  questionCounter: document.getElementById("question-counter"),
  progressFill: document.getElementById("progress-fill"),
  questionText: document.getElementById("question-text"),
  answersList: document.getElementById("answers-list"),
  btnNext: document.getElementById("btn-next"),
  scoreValue: document.getElementById("score-value"),
  scoreTotal: document.getElementById("score-total"),
  resultTitle: document.getElementById("result-title"),
  resultMessage: document.getElementById("result-message"),
  resultRankingNotice: document.getElementById("result-ranking-notice"),
  resultPlayerName: document.getElementById("result-player-name"),
  btnBackHome: document.getElementById("btn-back-home"),
  leaderboardList: document.getElementById("leaderboard-list"),
  leaderboardCount: document.getElementById("leaderboard-count"),
  leaderboardTitle: document.getElementById("leaderboard-title"),
  btnBackFromRanking: document.getElementById("btn-back-from-ranking"),
  adminParticipantCount: document.getElementById("admin-participant-count"),
  adminStatus: document.getElementById("admin-status"),
  adminLeaderboardPreview: document.getElementById("admin-leaderboard-preview"),
  adminPreviewTitle: document.getElementById("admin-preview-title"),
  btnCloseQuiz: document.getElementById("btn-close-quiz"),
  btnReopenQuiz: document.getElementById("btn-reopen-quiz"),
  firebaseWarning: document.getElementById("firebase-warning"),
  adminQrCode: document.getElementById("admin-qr-code"),
  adminQuizUrl: document.getElementById("admin-quiz-url"),
  btnCopyQuizUrl: document.getElementById("btn-copy-quiz-url"),
  adminCopyFeedback: document.getElementById("admin-copy-feedback"),
};

function init() {
  if (isAdmin) {
    showScreen("admin");
  }

  elements.coupleNames && (elements.coupleNames.textContent = CONFIG.coupleNames);
  elements.scoreTotal && (elements.scoreTotal.textContent = QUESTIONS.length);

  elements.welcomeForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    tryStartQuiz();
  });
  elements.btnStart?.addEventListener("click", tryStartQuiz);
  elements.btnNext?.addEventListener("click", nextQuestion);
  elements.btnBackHome?.addEventListener("click", () => showScreen("welcome"));
  elements.btnBackFromRanking?.addEventListener("click", goBackFromRanking);

  if (isAdmin) {
    elements.btnCloseQuiz?.addEventListener("click", closeQuiz);
    elements.btnReopenQuiz?.addEventListener("click", reopenQuiz);
    initAdminQr();
    if (!db) {
      if (elements.btnCloseQuiz) elements.btnCloseQuiz.disabled = true;
      if (elements.btnReopenQuiz) elements.btnReopenQuiz.disabled = true;
    }
  }

  if (!isFirebaseConfigured()) {
    if (elements.firebaseWarning) elements.firebaseWarning.hidden = false;
  } else {
    listenToConfig();
    listenToScores();
  }

  updateWelcomeState();
  updateRankingVisibility();
}

async function initAdminQr() {
  if (!elements.adminQrCode) return;

  try {
    const { renderQrCode, copyQuizUrl } = await import("./qrcode-helper.js");
    const url = await renderQrCode(elements.adminQrCode, 180);
    elements.adminQuizUrl.textContent = url;

    elements.btnCopyQuizUrl?.addEventListener("click", async () => {
      await copyQuizUrl();
      elements.adminCopyFeedback.hidden = false;
      setTimeout(() => {
        elements.adminCopyFeedback.hidden = true;
      }, 2000);
    });
  } catch (err) {
    console.error("QR code admin indisponible:", err);
    elements.adminQrCode.innerHTML =
      '<p class="empty-ranking">QR code indisponible — utilisez qr.html</p>';
  }
}

function listenToConfig() {
  if (!db) return;
  const configRef = doc(db, "config", "quiz");
  unsubscribeConfig = onSnapshot(
    configRef,
    (snap) => {
      const wasClosed = quizClosed;
      quizClosed = snap.exists() ? Boolean(snap.data().closed) : false;
      updateWelcomeState();
      updateAdminState();
      updateRankingVisibility();

      if (quizClosed && !wasClosed) {
        revealLeaderboardToGuests();
      } else if (!quizClosed && wasClosed && !isAdmin) {
        showScreen("welcome");
      }
    },
    (err) => console.error("Firestore config error:", err)
  );
}

function listenToScores() {
  if (!db) return;
  const scoresRef = collection(db, "scores");
  unsubscribeScores = onSnapshot(
    scoresRef,
    (snap) => {
      allScores = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (quizClosed) {
        renderLeaderboard(elements.leaderboardList);
        if (isAdmin) {
          renderLeaderboard(elements.adminLeaderboardPreview, true);
        }
      }
      elements.leaderboardCount.textContent = allScores.length;
      if (elements.adminParticipantCount) {
        elements.adminParticipantCount.textContent = allScores.length;
      }
    },
    (err) => console.error("Firestore scores error:", err)
  );
}

function updateRankingVisibility() {
  const canSeeRanking = quizClosed;

  if (elements.resultRankingNotice) {
    elements.resultRankingNotice.hidden = canSeeRanking || isAdmin;
  }
  if (elements.adminPreviewTitle) {
    elements.adminPreviewTitle.hidden = !canSeeRanking;
  }
  if (elements.adminLeaderboardPreview) {
    elements.adminLeaderboardPreview.hidden = !canSeeRanking;
    if (!canSeeRanking) {
      elements.adminLeaderboardPreview.innerHTML = "";
    }
  }
}

function openLeaderboard() {
  if (!quizClosed) return;
  showScreen("leaderboard");
}

function revealLeaderboardToGuests() {
  showScreen("leaderboard");
}

function updateWelcomeState() {
  if (isAdmin) return;
  const closed = quizClosed;
  if (elements.quizClosedNotice) elements.quizClosedNotice.hidden = !closed;
  if (elements.welcomeForm) elements.welcomeForm.hidden = closed;

  if (closed && screens.welcome?.classList.contains("active")) {
    openLeaderboard();
  }
}

function updateAdminState() {
  if (!isAdmin) return;
  elements.adminStatus.textContent = quizClosed ? "Quiz clôturé" : "Quiz en cours";
  elements.adminStatus.className = "admin-status " + (quizClosed ? "closed" : "open");
  elements.btnCloseQuiz.hidden = quizClosed;
  elements.btnReopenQuiz.hidden = !quizClosed;
}

function tryStartQuiz() {
  elements.formError.hidden = true;

  if (quizClosed) {
    elements.formError.textContent = "Le quiz est terminé. Consultez le classement ci-dessous.";
    elements.formError.hidden = false;
    return;
  }

  const firstName = elements.firstName.value.trim();
  const lastName = elements.lastName.value.trim();

  if (!firstName || !lastName) {
    elements.formError.textContent = "Merci de renseigner votre prénom et votre nom.";
    elements.formError.hidden = false;
    return;
  }

  player = { firstName, lastName };
  startQuiz();
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  scoreSubmitted = false;
  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  selectedAnswer = null;

  elements.questionCounter.textContent = `Question ${currentQuestion + 1} / ${QUESTIONS.length}`;
  elements.progressFill.style.width = `${((currentQuestion + 1) / QUESTIONS.length) * 100}%`;
  elements.questionText.textContent = q.question;
  elements.btnNext.disabled = true;
  elements.btnNext.textContent =
    currentQuestion === QUESTIONS.length - 1 ? "Voir mon score" : "Question suivante";

  elements.answersList.innerHTML = "";
  q.answers.forEach((answer, index) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer-btn";
    btn.textContent = answer;
    btn.addEventListener("click", () => selectAnswer(index));
    li.appendChild(btn);
    elements.answersList.appendChild(li);
  });
}

function selectAnswer(index) {
  selectedAnswer = index;

  const buttons = elements.answersList.querySelectorAll(".answer-btn");
  buttons.forEach((btn, i) => {
    btn.classList.toggle("selected", i === index);
  });

  elements.btnNext.disabled = false;
}

function nextQuestion() {
  if (selectedAnswer === null) return;

  const q = QUESTIONS[currentQuestion];
  if (isCorrectAnswer(q, selectedAnswer)) score++;

  if (currentQuestion < QUESTIONS.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResults();
  }
}

async function showResults() {
  elements.scoreValue.textContent = score;
  elements.resultPlayerName.textContent = `${player.firstName} ${player.lastName}`;

  const msg = MESSAGES.find((m) => score >= m.min && score <= m.max) ?? MESSAGES[0];
  elements.resultTitle.textContent = msg.title;
  elements.resultMessage.textContent = msg.message;

  updateRankingVisibility();
  showScreen("results");
  await submitScore();

  if (quizClosed) {
    showScreen("leaderboard");
  }
}

async function submitScore() {
  if (scoreSubmitted || !db) return;

  try {
    await addDoc(collection(db, "scores"), {
      firstName: player.firstName,
      lastName: player.lastName,
      fullName: `${player.firstName} ${player.lastName}`,
      score,
      total: QUESTIONS.length,
      createdAt: serverTimestamp(),
    });
    scoreSubmitted = true;
  } catch (err) {
    console.error("Erreur enregistrement score:", err);
  }
}

function renderLeaderboard(container, compact = false) {
  if (!container) return;
  container.innerHTML = "";

  if (allScores.length === 0) {
    container.innerHTML = '<p class="empty-ranking">Aucun participant pour l\'instant…</p>';
    return;
  }

  const sorted = [...allScores].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const ta = a.createdAt?.seconds ?? 0;
    const tb = b.createdAt?.seconds ?? 0;
    return ta - tb;
  });

  sorted.forEach((entry, index) => {
    const rank = index + 1;
    const row = document.createElement("div");
    row.className = "ranking-row" + (rank <= 3 ? ` rank-${rank}` : "");

    const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;

    row.innerHTML = `
      <span class="ranking-position">${medal}</span>
      <span class="ranking-name">${entry.firstName} ${entry.lastName}</span>
      <span class="ranking-score">${entry.score}/${entry.total ?? QUESTIONS.length}</span>
    `;

    container.appendChild(row);
  });

  if (compact && container.children.length > 5) {
    while (container.children.length > 5) {
      container.removeChild(container.lastChild);
    }
  }
}

async function closeQuiz() {
  if (!db || !confirm("Clore le quiz ? Les invités verront le classement final.")) return;
  await setDoc(doc(db, "config", "quiz"), { closed: true, closedAt: serverTimestamp() });
}

async function reopenQuiz() {
  if (!db || !confirm("Rouvrir le quiz ? Les invités pourront à nouveau participer.")) return;
  await setDoc(doc(db, "config", "quiz"), { closed: false, closedAt: null });
}

function goBackFromRanking() {
  if (isAdmin) {
    showScreen("admin");
  } else if (scoreSubmitted) {
    showScreen("results");
  } else {
    showScreen("welcome");
  }
}

function showScreen(name) {
  if (name === "leaderboard" && !quizClosed) return;

  Object.values(screens).forEach((s) => s?.classList.remove("active"));
  screens[name]?.classList.add("active");

  if (name === "leaderboard") {
    elements.leaderboardTitle.textContent = "Classement final 🏆";
    renderLeaderboard(elements.leaderboardList);
  }
}

try {
  init();
} catch (err) {
  console.error("Erreur initialisation quiz:", err);
}
