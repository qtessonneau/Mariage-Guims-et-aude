# Quiz de Mariage 💍

Quiz interactif pour votre mariage avec **inscription des invités** et **classement en direct**.

## Fonctionnalités

- Chaque invité saisit **prénom + nom** avant de jouer
- Scores enregistrés en ligne (Firebase)
- **Classement en direct** visible pendant le quiz
- **Panneau admin** pour clore le quiz et afficher le podium final

## QR code pour les invités

Les invités accèdent au quiz en scannant un QR code avec leur téléphone.

### 1. Configurer l'URL

Dans `js/site-config.js`, renseignez votre URL GitHub Pages :

```javascript
export const SITE_URL = "https://VOTRE-USERNAME.github.io/quiz-mariage";
```

### 2. Afficher le QR code le jour J

**Option A — Page dédiée (recommandé pour affichage sur table / vidéo-projecteur)**

Ouvrez `qr.html` sur votre site :
`https://VOTRE-USERNAME.github.io/quiz-mariage/qr.html`

→ Bouton **Imprimer / PDF** pour créer des affiches à placer sur les tables.

**Option B — Panneau admin**

Ouvrez `?admin=votre-code-secret` : le QR code y est affiché avec un lien à copier.

### 3. Déroulement

1. Affichez le QR code à l'entrée ou sur les tables
2. Les invités scannent → arrivent sur le quiz
3. Ils saisissent prénom + nom et jouent

## Configuration Firebase (obligatoire pour le classement)

GitHub Pages héberge le site, mais les scores doivent être stockés quelque part. Firebase (gratuit) s'en charge.

### 1. Créer un projet Firebase

1. Allez sur [console.firebase.google.com](https://console.firebase.google.com)
2. **Créer un projet** (ex. `quiz-mariage-aude-guims`)
3. **Build → Firestore Database → Create database**
   - Mode **test** pour commencer (à sécuriser après le mariage)
4. **Project settings → Your apps → Web** (icône `</>`)
5. Copiez la configuration dans `js/firebase-config.js`

### 2. Règles Firestore

Dans Firestore → **Rules**, collez :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{scoreId} {
      allow read: if true;
      allow create: if true;
    }
    match /config/quiz {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

> Ces règles sont ouvertes — suffisant pour un quiz de mariage. Supprimez le projet Firebase après l'événement si vous le souhaitez.

### 3. Code admin

Dans `js/firebase-config.js`, modifiez `ADMIN_CODE` :

```javascript
export const ADMIN_CODE = "votre-code-secret";
```

Accédez au panneau admin via :

`https://VOTRE-SITE.github.io/quiz-mariage/?admin=votre-code-secret`

## Personnalisation du quiz

Modifiez en haut de `js/app.js` :

- **CONFIG** — noms des mariés
- **QUESTIONS** — questions et bonnes réponses (`correct` : **1** à **4**)
- **MESSAGES** — textes selon le score

## Déroulement le jour J

1. **Avant** : partagez le lien du quiz aux invités
2. **Pendant** : les invités jouent, vous suivez le classement en direct depuis le panneau admin
3. **À la fin** : cliquez **« Clore le quiz »** dans le panneau admin
4. **Résultat** : tous les invités voient le **classement final** avec le podium 🥇🥈🥉

## Publier sur GitHub Pages

```bash
git add .
git commit -m "Quiz mariage avec classement"
git push
```

Settings → Pages → branche `main`, dossier `/ (root)`.

## Structure

```
quiz-mariage/
├── index.html
├── qr.html               # Page QR code (grand format + impression)
├── css/
│   ├── style.css
│   └── qr.css
├── js/
│   ├── app.js
│   ├── firebase-config.js
│   ├── site-config.js    # URL du site + noms mariés
│   └── qrcode-helper.js
└── README.md
```

Bon mariage ! 🥂
