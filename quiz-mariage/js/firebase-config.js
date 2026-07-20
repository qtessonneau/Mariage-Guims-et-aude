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

export const ADMIN_CODE = "aude-guims-2026";

export function isFirebaseConfigured() {
  const key = firebaseConfig.apiKey;
  return Boolean(key) && !key.startsWith("VOTRE_") && !key.startsWith("COLLEZ_");
}
