# MatchUp - Swipe ton avenir 🎯

> Plateforme de mise en relation entre étudiants et entreprises via un système de swipe façon Tinder.

---

## Prérequis

Avant d'installer le projet, assure-toi d'avoir les outils suivants installés :

| Outil | Version recommandée | Lien |
|---|---|---|
| Node.js | v18+ | https://nodejs.org |
| Python | v3.10+ | https://www.python.org/downloads |
| MySQL | v8+ | https://dev.mysql.com/downloads |
| Git | latest | https://git-scm.com |

---


## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Kotar09/MatchUp.git
cd matchup
```

---

### 2. Base de données MySQL

Ouvre ton client MySQL (MySQL Workbench, TablePlus, DBeaver ou terminal) et exécute le script sql fichier -> db.sql

---

### 3. Backend Node.js

```bash
cd backend
npm install
```

Crée le fichier `.env` dans `/backend` :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton mot de passe
DB_NAME=tinder_job_app
JWT_SECRET=matchup_secret_jwt_2024
PORT=3000
```

Lance le serveur :

```bash
npm run dev
```

> Le serveur démarre sur http://localhost:3000

---

### 4. Extractor Python

```bash
cd extractor
```

**Mac/Linux :**
```bash
pip install mysql-connector-python python-dotenv pdfplumber
```

Crée le fichier `.env` dans `/extractor` :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
DB_NAME=tinder_job_app
```

---

### 5. Frontend

Pas d'installation nécessaire ! Ouvre simplement `/frontend/pages/index.html` dans ton navigateur.

> 💡 Pour éviter les problèmes CORS, utilise l'extension **Live Server** dans VS Code.

---

## Lancement du projet

### Démarrer le backend

```bash
cd backend
npm run dev
```

### Importer des offres depuis des JSON existants

Dépose tes fichiers JSON dans `/extractor/output/` puis lance :


**Mac/Linux :**
```bash
cd extractor
python extract.py
```

### Ouvrir le frontend

Ouvre `/frontend/pages/index.html` avec Live Server ou double-clique dessus.


---

## Stack technique

| Couche | Technologie |
|---|---|
| Backend | Node.js, Express.js, Socket.io |
| Base de données | MySQL |
| Authentification | JWT + bcryptjs |
| Extraction PDF | Python, pdfplumber |
| Upload fichiers | Multer |
| Frontend | HTML5, CSS3, JavaScript Vanilla |
| Temps réel | WebSockets (Socket.io) |

---

## Fonctionnalités

### Côté Étudiant
- ✅ Inscription et connexion
- ✅ Création de profil (nom, titre, compétences, formation)
- ✅ Swipe des offres d'alternance (like / dislike)
- ✅ Drag & drop des cartes + animations feux d'artifice
- ✅ Page "Mes likes" — offres likées
- ✅ Page "Mes matches" — entreprises matchées
- ✅ Chat temps réel avec les entreprises matchées

### Côté Entreprise
- ✅ Inscription et connexion
- ✅ Dashboard avec statistiques
- ✅ Upload d'offres en PDF (extraction automatique)
- ✅ Swipe des profils étudiants
- ✅ Chat temps réel avec les étudiants matchés


---

## Auteur

Projet développé dans le cadre d'un projet pédagogique.
**MatchUp - Swipe ton avenir** 🚀