# Projet Gestion Ecole d'Ingenieur

## Structure

- `backend/` : API Flask REST (JWT, SQLAlchemy, CSV import, PDF reports)
- `frontend/` : Application React (routing, dashboards, CRUD)
- `docs/sql_server_schema.sql` : Schema SQL Server complet

## Lancement rapide

1. Configurer SQL Server puis executer `docs/sql_server_schema.sql`
2. Lancer le backend (`backend/README.md`)
3. Lancer le frontend (`frontend/README.md`)

## Endpoints principaux

- `POST /login`
- `POST /register`
- `GET /students`
- `POST /students`
- `PUT /students/{id}`
- `DELETE /students/{id}`
- `POST /grades`
- `GET /grades/student/{id}`
- `GET /report/student/{id}`
