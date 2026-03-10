# Deploiement Render (Docker) + Azure SQL

Ce projet est configure pour deploiement automatique via `render.yaml`.

## Prerequis

- Repo GitHub a jour.
- Base Azure SQL deja creee et accessible depuis Internet.
- Firewall Azure SQL autorise les connexions depuis Render.

## Variables backend

Configurer ces variables dans Render pour `portail-scolaire-api`:

- `DB_SERVER` (ex: `your-server.database.windows.net,1433`)
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

Ces variables sont deja prevues:

- `DB_DRIVER=ODBC Driver 18 for SQL Server`
- `DB_ENCRYPT=yes`
- `DB_TRUST_SERVER_CERT=no`

## Deployment via Blueprint

1. Ouvrir Render -> New -> Blueprint.
2. Selectionner ce repo GitHub.
3. Render detecte `render.yaml` et cree:
   - `portail-scolaire-api` (Flask + pyodbc + SQL Server driver)
   - `portail-scolaire-web` (React build + static server)
4. Renseigner les variables DB manquantes.
5. Lancer le deploy.

## Verification

- Backend: `https://<api-url>/health` doit retourner `{"status":"ok"}`.
- Frontend: ouvrir `https://<web-url>`, puis tester login et pages.

## Notes

- Le frontend lit l'URL backend au runtime via `VITE_API_BASE`.
- En local, le fallback reste `http://127.0.0.1:5000`.
