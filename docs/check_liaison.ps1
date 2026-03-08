param(
  [string]$ProjectRoot = "."
)

Set-Location $ProjectRoot
Write-Host "== Prerequis =="

if (Get-Command node -ErrorAction SilentlyContinue) {
  node -v
} else {
  Write-Host "node: MISSING"
}

if (Get-Command npm -ErrorAction SilentlyContinue) {
  npm -v
} else {
  Write-Host "npm: MISSING"
}

if (Test-Path ".\.venv\Scripts\python.exe") {
  .\.venv\Scripts\python.exe -c "import flask, flask_jwt_extended, flask_sqlalchemy, flask_cors, flask_migrate, pyodbc; print('python deps: OK')"
} else {
  Write-Host ".venv python: MISSING"
}

Write-Host "== Backend health (test client) =="
@"
import sys
from pathlib import Path
sys.path.insert(0, str(Path('backend').resolve()))
from app import create_app
app = create_app()
c = app.test_client()
r = c.get('/health')
print('health', r.status_code, r.get_json())
"@ | .\.venv\Scripts\python.exe -

Write-Host "== Frontend env =="
if (Test-Path "frontend\.env") {
  Get-Content "frontend\.env"
} else {
  Write-Host "frontend/.env manquant (copier frontend/.env.example)"
}
