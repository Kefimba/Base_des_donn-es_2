from __future__ import annotations

import os
import sys

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from sqlalchemy import text

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from config import Config
from database.db import db
from routes.academic_routes import academic_bp
from routes.auth_routes import auth_bp
from routes.csv_routes import csv_bp
from routes.dashboard_routes import dashboard_bp
from routes.grade_routes import grades_bp
from routes.report_routes import report_bp
from routes.student_routes import students_bp
from routes.teacher_routes import teachers_bp
from routes.timetable_routes import timetable_bp

jwt = JWTManager()
migrate = Migrate()
ENV_PATH = os.path.join(CURRENT_DIR, ".env")
load_dotenv(ENV_PATH)


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(students_bp)
    app.register_blueprint(grades_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(academic_bp)
    app.register_blueprint(teachers_bp)
    app.register_blueprint(timetable_bp)
    app.register_blueprint(csv_bp)

    @app.after_request
    def add_response_headers(response):
        # Reduce browser/proxy content transformation (e.g. auto-translation)
        response.headers["Content-Language"] = "en"
        response.headers["Cache-Control"] = "no-transform"
        return response

    @app.get("/")
    def index() -> tuple[dict, int]:
        return {
            "message": "Backend API is running",
            "health": "/health",
            "auth": ["/login", "/register"],
        }, 200

    @app.get("/health")
    def health() -> tuple[dict, int]:
        return {"status": "ok"}, 200

    @app.get("/debug/db-status")
    def db_status() -> tuple[dict, int]:
        checks: dict[str, int | str | None] = {}
        try:
            checks["db_name"] = db.session.execute(text("SELECT DB_NAME()")).scalar()
            checks["etudiant_count"] = db.session.execute(text("SELECT COUNT(1) FROM etudiant")).scalar()
            checks["enseignant_count"] = db.session.execute(text("SELECT COUNT(1) FROM enseignant")).scalar()
            checks["classe_count"] = db.session.execute(text("SELECT COUNT(1) FROM classe")).scalar()
            return checks, 200
        except Exception as exc:
            return {"error": str(exc)}, 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
