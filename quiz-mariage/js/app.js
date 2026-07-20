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

const QUESTIONS = [
  {
    question: `Où ${CONFIG.bride} et ${CONFIG.groom} se sont-ils rencontrés pour la première fois ?`,
    answers: ["À Paris", "En vacances à la montagne", "Via des amis communs", "Au BTS"],
    correct: 4,
  },
  {
    question: `Quel est le plat préféré de ${CONFIG.groom} ?`,
    answers: ["Les pâtes carbonara", "Le burger", "La raclette", "Les sushis"],
    correct: 1,
  },
  {
    question: `Quel pays ${CONFIG.bride} a visité ?`,
    answers: ["Brésil", "Kenya", "Sri-lanka", "Albanie"],
    correct: 3,
  },
  {
    question: "Combien d'invité sommes nous aujourd'hui ?",
    answers: ["60", "64", "66", "70"],
    correct: 2,
  },
  {
    question: "Où ont-ils fait leur demande en mariage ?",
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
    answers: [CONFIG.bride, CONFIG.groom, "Personne, c'est implicite", "Les deux autant l'un que l'autre"],
    correct: 4,
  },
  {
    question: "Quel est le surnom que se donnent les mariés ?",
    answers: ["Mon cœur", "Mon chat", "Mon Tyrannosaure", "Mon amour"],
    correct: 1,
  },
];

const MESSAGES = [
  { min: 0, max: 3, title: "Il faut mieux les connaître !", message: "Pas de panique — on est tous venu pour la bouffe en vrai" },
  { min: 4, max: 6, title: "Pas mal !", message: "Vous connaissez les mariés ! Il reste encore quelques secrets à découvrir.. Apéro ?" },
  { min: 7, max: 8, title: "Très bien !", message: "Vous êtes malheureusement proche du couple, force à vous." },
  { min: 9, max: 10, title: "Expert du couple !", message: "Lèche botte va !." },
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
let answered = false;
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
  resultPlayerName: document.getElementById("result-player-name"),
  btnViewRanking: document.getElementById("btn-view-ranking"),
  btnBackHome: document.getElementById("btn-back-home"),
  leaderboardList: document.getElementById("leaderboard-list"),
  leaderboardCount: document.getElementById("leaderboard-count"),
  leaderboardTitle: document.getElementById("leaderboard-title"),
  btnBackFromRanking: document.getElementById("btn-back-from-ranking"),
  btnViewRankingFromWelcome: document.getElementById("btn-view-ranking-welcome"),
  adminParticipantCount: document.getElementById("admin-participant-count"),
  adminStatus: document.getElementById("admin-status"),
  adminLeaderboardPreview: document.getElementById("admin-leaderboard-preview"),
  btnCloseQuiz: document.getElementById("btn-close-quiz"),
  btnReopenQuiz: document.getElementById("btn-reopen-quiz"),
  btnShowRanking: document.getElementById("btn-show-ranking"),
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
  elements.btnViewRanking?.addEventListener("click", () => showScreen("leaderboard"));
  elements.btnBackHome?.addEventListener("click", () => showScreen("welcome"));
  elements.btnBackFromRanking?.addEventListener("click", goBackFromRanking);
  elements.btnViewRankingFromWelcome?.addEventListener("click", () => showScreen("leaderboard"));

  if (isAdmin) {
    elements.btnCloseQuiz?.addEventListener("click", closeQuiz);
    elements.btnReopenQuiz?.addEventListener("click", reopenQuiz);
    elements.btnShowRanking?.addEventListener("click", () => showScreen("leaderboard"));
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
      quizClosed = snap.exists() ? Boolean(snap.data().closed) : false;
      updateWelcomeState();
      updateAdminState();
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
      renderLeaderboard(elements.leaderboardList);
      renderLeaderboard(elements.adminLeaderboardPreview, true);
      elements.leaderboardCount.textContent = allScores.length;
      if (elements.adminParticipantCount) {
        elements.adminParticipantCount.textContent = allScores.length;
      }
    },
    (err) => console.error("Firestore scores error:", err)
  );
}

function updateWelcomeState() {
  if (isAdmin) return;
  const closed = quizClosed;
  if (elements.quizClosedNotice) elements.quizClosedNotice.hidden = !closed;
  if (elements.welcomeForm) elements.welcomeForm.hidden = closed;
  if (elements.btnViewRankingFromWelcome) elements.btnViewRankingFromWelcome.hidden = !closed;
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
  answered = false;

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
  if (answered) return;

  selectedAnswer = index;
  answered = true;

  const q = QUESTIONS[currentQuestion];
  const buttons = elements.answersList.querySelectorAll(".answer-btn");
  const correctIndex = q.correct - 1;

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.classList.add("correct");
    if (i === index && index !== correctIndex) btn.classList.add("incorrect");
    if (i === index) btn.classList.add("selected");
  });

  if (index === correctIndex) score++;

  elements.btnNext.disabled = false;
}

function nextQuestion() {
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

  const msg = MESSAGES.find((m) => score >= m.min && score <= m.max);
  elements.resultTitle.textContent = msg.title;
  elements.resultMessage.textContent = msg.message;

  elements.btnViewRanking.textContent = quizClosed
    ? "Voir le classement final"
    : "Voir le classement en direct";

  showScreen("results");
  await submitScore();
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
  Object.values(screens).forEach((s) => s?.classList.remove("active"));
  screens[name]?.classList.add("active");

  if (name === "leaderboard") {
    elements.leaderboardTitle.textContent = quizClosed ? "Classement final 🏆" : "Classement en direct";
  }
}

try {
  init();
} catch (err) {
  console.error("Erreur initialisation quiz:", err);
}
