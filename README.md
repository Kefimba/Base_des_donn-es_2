# Modelisation et implementation d'une base de donnees pour la gestion des etudiants d'un etablissement

Projet academique ISE2 - ENSAE (2025-2026)

## Technologies utilisees

<p>
  <img src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/SQLAlchemy-D71F00?logo=sqlalchemy&logoColor=white" alt="SQLAlchemy" />
  <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Material_UI-007FFF?logo=mui&logoColor=white" alt="Material UI" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Render-46E3B7?logo=render&logoColor=000000" alt="Render" />
  <img src="https://img.shields.io/badge/Azure_SQL-0078D4?logo=microsoftazure&logoColor=white" alt="Azure SQL" />
  <img src="https://img.shields.io/badge/SQL_Server-CC2927?logo=microsoftsqlserver&logoColor=white" alt="SQL Server" />
  <img src="https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white" alt="Git" />
  <img src="https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white" alt="GitHub" />
</p>

## Equipe

- Mamady I BERETE
- Aissatou Sega DIALLO
- Cheikh Oumar DIALLO
- Hildegrade Biyenda EDIMA
- Nihaviana Albert Paulinah RASAMOELINA

Encadrement: M. Saliou THIAW

## Contexte

Le projet vise a centraliser les donnees academiques d'un etablissement (etudiants, enseignants, filieres, classes, matieres, inscriptions, evaluations, notes) afin de remplacer une gestion manuelle fragilisee par les erreurs et les difficultes d'acces a l'information.

## Problematique

Concevoir et implementer une base de donnees relationnelle permettant de gerer efficacement:

- les etudiants
- les enseignants
- les programmes d'enseignement
- les inscriptions
- les evaluations et notes

## Objectifs fonctionnels

- Gestion des etudiants et enseignants (CRUD selon role)
- Gestion academique (filieres, classes, matieres)
- Gestion des notes avec moyenne et mention
- Gestion emploi du temps
- Import CSV
- Generation de bulletin PDF
- Authentification JWT et gestion des roles (`admin`, `enseignant`)

## Architecture technique

- `backend/` : API Flask REST (SQLAlchemy, JWT, pyodbc, reportlab)
- `frontend/` : React + Vite (MUI, Axios, Recharts)
- `Azure SQL` : base de donnees principale
- `Render` : deploiement (backend + frontend)

## Structure du depot

```text
.
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── docs/
│   ├── sql_server_schema.sql
│   └── DEPLOY_RENDER.md
├── render.yaml
└── Projet_G5_ISE2_2025_2026.pdf
```

## Lancement local

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
python app.py
```

### Frontend

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Deploiement (Render + Azure SQL)

- Configuration Docker + Blueprint deja versionnee dans `render.yaml`
- Guide complet: `docs/DEPLOY_RENDER.md`

Variables critiques backend:

- `DB_SERVER` (Azure SQL, ex: `xxx.database.windows.net,1433`)
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_DRIVER=ODBC Driver 18 for SQL Server`
- `DB_ENCRYPT=yes`
- `DB_TRUST_SERVER_CERT=no`
## Application en ligne
Le lien : https://portail-scolaire-web-h3xw.onrender.com/
## Endpoints API principaux

- `POST /login`
- `POST /register`
- `GET /students`
- `POST /students`
- `PUT /students/{id}`
- `DELETE /students/{id}`
- `POST /grades`
- `GET /grades/student/{id}`
- `GET /report/student/{id}`
- `GET /health`

## Gouvernance Git recommandee

- Branches:
  - `main` (stable)
  - `develop` (integration)
  - `feature/*` (fonctionnalites)
  - `fix/*` (correctifs)
- Commits atomiques et explicites
- Pull Request avec description des changements, impact DB, et captures UI
- Protection de `main` (review obligatoire)

Details proposes: `docs/REPO_GOVERNANCE.md`
