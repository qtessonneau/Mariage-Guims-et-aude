/**
 * Configuration Firebase
 * ─────────────────────
 * 1. Créez un projet sur https://console.firebase.google.com
 * 2. Ajoutez une application Web et copiez la config ci-dessous
 * 3. Activez Firestore Database (mode test ou règles ci-dessous)
 *
 * Code admin : ajoutez ?admin=VOTRE_CODE à l'URL pour gérer le quiz
 * Exemple : https://votre-site.github.io/quiz-mariage/?admin=aude-guims-2026
 */

/**
 * Configuration Firebase
 */
export const firebaseConfig = {
  apiKey: "AIzaSyCF4W_SxGIlUzUEeaHzOoDlqCVWou1ZKp0",
  authDomain: "quiz-mariage-aude-guims.firebaseapp.com",
  projectId: "quiz-mariage-aude-guims",
  storageBucket: "quiz-mariage-aude-guims.firebasestorage.app",
  messagingSenderId: "1082994682992",
  appId: "1:1082994682992:web:59737978e5c749e1fcd8b5",
};

/** Code secret pour accéder au panneau admin (?admin=...) */
export const ADMIN_CODE = "aude-guims-2026";

export function isFirebaseConfigured() {
  return (
    firebaseConfig.apiKey !== "AIzaSyCF4W_SxGIlUzUEeaHzOoDlqCVWou1ZKp0" &&
    !firebaseConfig.apiKey.startsWith("VOTRE_")
  );
}
