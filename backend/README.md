# Backend API (Flask)

## Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

## Run

```powershell
python app.py
```

## Key endpoints

- `POST /login`
- `POST /register`
- `GET /students`
- `POST /students`
- `PUT /students/{id}`
- `DELETE /students/{id}`
- `POST /grades`
- `GET /grades/student/{id}`
- `GET /report/student/{id}`
- `POST /import/students`
- `POST /import/teachers`
- `POST /import/grades`

Use `Authorization: Bearer <token>` for protected routes.
