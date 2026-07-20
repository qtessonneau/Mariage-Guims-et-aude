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
export const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT.firebaseapp.com",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};

/** Code secret pour accéder au panneau admin (?admin=...) */
export const ADMIN_CODE = "aude-guims-2026";

/** true si Firebase n'est pas encore configuré */
export function isFirebaseConfigured() {
  return !firebaseConfig.apiKey.startsWith("VOTRE_");
}
