/**
 * Quiz de Mariage — Configuration
 * Modifiez les valeurs ci-dessous pour personnaliser le quiz.
 */
const CONFIG = {
  // Noms des mariés affichés sur la page d'accueil
  coupleNames: "Marie & Pierre",

  // Prénoms utilisés dans les questions (mariée / marié)
  bride: "Marie",
  groom: "Pierre",
};

const QUESTIONS = [
  {
    question: `Où ${CONFIG.bride} et ${CONFIG.groom} se sont-ils rencontrés pour la première fois ?`,
    answers: ["À Paris", "En vacances à la montagne", "Via des amis communs", "Au travail"],
    correct: 2,
  },
  {
    question: `Quel est le plat préféré de ${CONFIG.groom} ?`,
    answers: ["Les pâtes carbonara", "Le burger", "La raclette", "Les sushis"],
    correct: 0,
  },
  {
    question: `Quelle chanson ${CONFIG.bride} écoute en boucle ?`,
    answers: ["Du jazz", "De la pop française", "Du rock", "De la musique classique"],
    correct: 1,
  },
  {
    question: "En quelle année le couple s'est-il mis ensemble ?",
    answers: ["2018", "2019", "2020", "2021"],
    correct: 1,
  },
  {
    question: `Quel est le hobby secret de ${CONFIG.bride} ?`,
    answers: ["La peinture", "Le yoga", "Les jeux vidéo", "La cuisine"],
    correct: 2,
  },
  {
    question: "Où ont-ils fait leur demande en mariage ?",
    answers: ["Au restaurant", "En voyage", "Chez eux", "Dans un parc"],
    correct: 1,
  },
  {
    question: `Quel animal ${CONFIG.groom} rêverait-il d'adopter ?`,
    answers: ["Un chien", "Un chat", "Un lapin", "Un perroquet"],
    correct: 0,
  },
  {
    question: "Quelle est la destination de leur lune de miel ?",
    answers: ["La Grèce", "Le Japon", "L'Italie", "La Thaïlande"],
    correct: 2,
  },
  {
    question: `Qui dit le plus souvent « Je t'aime » ?`,
    answers: [CONFIG.bride, CONFIG.groom, "Personne, c'est implicite", "Les deux autant l'un que l'autre"],
    correct: 3,
  },
  {
    question: "Quel est le surnom que se donnent les mariés ?",
    answers: ["Mon cœur", "Mon chat", "Mon trésor", "Mon amour"],
    correct: 0,
  },
];

const MESSAGES = [
  { min: 0, max: 3, title: "Il faut mieux les connaître !", message: "Pas de panique — le mariage sera l'occasion parfaite d'apprendre à les connaître encore mieux !" },
  { min: 4, max: 6, title: "Pas mal !", message: "Vous connaissez les mariés, mais il reste encore quelques secrets à découvrir…" },
  { min: 7, max: 8, title: "Très bien !", message: "Vous êtes clairement proche du couple. Les mariés peuvent compter sur vous !" },
  { min: 9, max: 10, title: "Expert du couple !", message: "Impressionnant ! Vous connaissez les mariés mieux qu'ils ne se connaissent eux-mêmes. 🎉" },
];

// Éléments du DOM
const screens = {
  welcome: document.getElementById("screen-welcome"),
  quiz: document.getElementById("screen-quiz"),
  results: document.getElementById("screen-results"),
};

const elements = {
  coupleNames: document.getElementById("couple-names"),
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
  btnRestart: document.getElementById("btn-restart"),
};

// État du quiz
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;

function init() {
  elements.coupleNames.textContent = CONFIG.coupleNames;
  elements.scoreTotal.textContent = QUESTIONS.length;
  elements.btnStart.addEventListener("click", startQuiz);
  elements.btnNext.addEventListener("click", nextQuestion);
  elements.btnRestart.addEventListener("click", restartQuiz);
}

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
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
    btn.dataset.index = index;
    btn.addEventListener("click", () => selectAnswer(index, btn));
    li.appendChild(btn);
    elements.answersList.appendChild(li);
  });
}

function selectAnswer(index, clickedBtn) {
  if (answered) return;

  selectedAnswer = index;
  answered = true;

  const q = QUESTIONS[currentQuestion];
  const buttons = elements.answersList.querySelectorAll(".answer-btn");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
    if (i === index && index !== q.correct) btn.classList.add("incorrect");
    if (i === index) btn.classList.add("selected");
  });

  if (index === q.correct) score++;

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

function showResults() {
  elements.scoreValue.textContent = score;

  const msg = MESSAGES.find((m) => score >= m.min && score <= m.max);
  elements.resultTitle.textContent = msg.title;
  elements.resultMessage.textContent = msg.message;

  showScreen("results");
}

function restartQuiz() {
  showScreen("welcome");
}

init();
