# Quiz de Mariage 💍

Un quiz interactif et élégant pour animer votre mariage. Les invités répondent à des questions sur les mariés et découvrent leur score à la fin.

## Personnalisation

Ouvrez le fichier `js/quiz.js` et modifiez :

1. **CONFIG** — noms des mariés (`coupleNames`, `bride`, `groom`)
2. **QUESTIONS** — vos propres questions, réponses et index de la bonne réponse (`correct`, de 0 à 3)
3. **MESSAGES** — textes affichés selon le score obtenu

## Tester en local

Ouvrez simplement `index.html` dans votre navigateur, ou servez le dossier avec un serveur local :

```bash
# Avec Python
python -m http.server 8080
# Puis ouvrir http://localhost:8080
```

## Publier sur GitHub Pages

### 1. Créer un dépôt GitHub

1. Allez sur [github.com/new](https://github.com/new)
2. Créez un dépôt (ex. `quiz-mariage`)
3. Ne cochez pas « Add a README » si vous uploadez les fichiers vous-même

### 2. Envoyer les fichiers

Dans le dossier `quiz-mariage`, exécutez :

```bash
git init
git add .
git commit -m "Quiz de mariage — première version"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/quiz-mariage.git
git push -u origin main
```

### 3. Activer GitHub Pages

1. Sur GitHub, ouvrez votre dépôt → **Settings** → **Pages**
2. Sous **Source**, choisissez **Deploy from a branch**
3. Branche : **main**, dossier : **/ (root)**
4. Cliquez **Save**

Après 1 à 2 minutes, votre site sera disponible à :

`https://VOTRE-USERNAME.github.io/quiz-mariage/`

## Structure du projet

```
quiz-mariage/
├── index.html      # Page principale
├── css/
│   └── style.css   # Mise en forme (thème mariage)
├── js/
│   └── quiz.js     # Questions et logique du quiz
└── README.md       # Ce fichier
```

## Licence

Libre d'utilisation pour votre mariage. Bonne fête ! 🥂
