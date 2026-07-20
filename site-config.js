/**
 * URL publique du quiz (GitHub Pages)
 * Renseignez-la une fois le site publié, ex :
 * "https://mon-pseudo.github.io/quiz-mariage"
 *
 * Laisser vide = détection automatique depuis l'adresse actuelle
 */
export const SITE_URL = "https://VOTRE-USERNAME.github.io/quiz-mariage";

export const COUPLE_NAMES = "Aude & Guims";

/** Retourne l'URL du quiz pointée par le QR code */
export function getQuizUrl() {
  if (SITE_URL && !SITE_URL.includes("VOTRE-USERNAME")) {
    return SITE_URL.replace(/\/$/, "") + "/";
  }

  const { origin, pathname } = window.location;
  const dir = pathname.endsWith("/")
    ? pathname
    : pathname.substring(0, pathname.lastIndexOf("/") + 1);
  return origin + dir;
}
