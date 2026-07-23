/**
 * Quiz de Mariage — Configuration
 * Modifiez les valeurs ci-dessous pour personnaliser le quiz.
 */
const CONFIG = {
  // Noms des mariés affichés sur la page d'accueil
  coupleNames: "Aude & Guims",

  // Prénoms utilisés dans les questions (mariée / marié)
  bride: "Aude",
  groom: "Guims",
};

// correct : numéro de la bonne réponse de 1 à 4
// (1 = 1re réponse, 2 = 2e, 3 = 3e, 4 = 4e)
const QUESTIONS = [
 {
    question: `Où ${CONFIG.bride} et ${CONFIG.groom} se sont-ils rencontrés pour la première fois ?`,
    answers: ["À Paris", "En vacances à la montagne", "Via des amis communs", "Au BTS"],
    correct: 4,
  },
  {
    question: `Quel est la date de naissance du ${CONFIG.groom} ?`,
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
    question: `Quel est le surnom que se donnent les mariés ?`,
    answers: ["Mon cœur", "Mon chat", "Mon Tyrannosaure", "Mon amour"],
    correct: 2,
  },
  {
    question: `Avec qui ${CONFIG.groom} a t'il été en coloc ?`,
    answers: ["Tom et Quentin", "Baptiste et Romain", "Thomas et Chris", "Tristan et Maxime"],
    correct: 3,
  },
  {
    question: `Quel animal a vécu (ou va vivre) avec les mariés ?`,
    answers: ["Basile le renard empaillé", "Mr Dupont le chat", "Edwige la chouette empaillée", "Les trois"],
    correct: [1,2],
  },
  {
    question: `Que veux dire BAM ?`,
    answers : ["Be Aware of Music", "Bonobo in Mulhouse","Boite À Musique", " Banjo Accordéon et Mandoline"],
    correct: 3,
  },
  {
    question: `Quelle vidéo de Bien-être Simple ${CONFIG.bride} a présenté ?`,
    answers : ["J'ai échappé à une secte", "Les secrets de Sharon", "La santé mentale en entreprise", "Les hémorroïdes, ce fléau"],
    correct: 2,
  },
  {
    question: `A quelle course a participé ${Config.groom} ?`,
    answers : [" 10km du Beaujolais", "Semi-marathon de Paris", "Marathon de Paris", "Course du nouvel an 2022"],
    correct: 2,
  },
  {
    question: ` Où est-ce que le magnifique couple formé par ${config.groom} et ${config.bride} n'a t'il pas vécu ?`,
    answers : ["Paris", "Biarritz","Canada","Valencia"],
    correct: 2,
  },
  {
    question: ` Quel est le deuxième prénom de ${config.bride} ?`,
    answers : ["Marie","Camille","Maïté","Emaztegaia"],
    correct: 3,
  },
  {
    question: `Quel sport ${config.bride} n'a pas pratiqué ?`,
    answers : ["Voile","Ski","Equitation","Judo"],
    correct: 4,
  },
  {
    question: `Comment s'appelle le lieu du mariage ?`,
    answers : ["Domaine Santa Maria", "Domaine de Larbéou", "Domaine Etxezahar", "J'avoue j'ai pas regardé le faire-part"],
    correct: 2,
  },
  {
    question: `Quel est l'agrûme emblême du couple ?`,
    answers: ["L'orange", "Le pomello", "Le pamplemousse", "Le citron"],
    correct: 4,
  },
];

const MESSAGES = [
  { min: 0, max: 5, title: "Il faut mieux les connaître !", message: "Pas de panique — on est tous venu pour la bouffe en vrai" },
  { min: 6, max: 10, title: "Pas mal !", message: "Le Patxaran va vous aider à récolter plus d'informations." },
  { min: 11, max: 15, title: "Tout à fait respectable", message: "Vous connaissez les mariés ! Il reste encore quelques secrets à découvrir.. Apéro ?" },
  { min: 16, max: 18, title: "Très bien !", message: "Vous êtes malheureusement proche du couple, force à vous." },
  { min: 19, max: 20, title: "Expert du couple !", message: "Lèche botte va !."
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
