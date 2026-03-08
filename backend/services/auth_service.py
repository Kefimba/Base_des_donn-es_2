from __future__ import annotations

import bcrypt
from flask_jwt_extended import create_access_token
from sqlalchemy import text

from database.db import db


class AuthService:
    @staticmethod
    def _verify_password(raw_password: str, stored_password: str) -> bool:
        if not stored_password:
            return False
        candidate = raw_password.encode("utf-8")
        saved = stored_password.encode("utf-8")

        # BCrypt hash
        if stored_password.startswith("$2"):
            try:
                return bcrypt.checkpw(candidate, saved)
            except ValueError:
                return False

        # Fallback for legacy plain-text passwords in DB
        return raw_password == stored_password

    @staticmethod
    def register(payload: dict) -> dict:
        username = payload["username"].strip()
        password = payload["password"]
        role = payload.get("role", "etudiant").strip().lower()
        if role not in {"admin", "enseignant", "etudiant"}:
            raise ValueError("Role invalide")

        exists = db.session.execute(
            text("SELECT COUNT(1) FROM utilisateur WHERE login = :login"),
            {"login": username},
        ).scalar() or 0
        if int(exists) > 0:
            raise ValueError("Utilisateur deja existant")

        password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        user_id = db.session.execute(
            text(
                """
                INSERT INTO utilisateur (login, mot_de_passe, role, est_actif)
                OUTPUT INSERTED.id_utilisateur
                VALUES (:login, :mot_de_passe, :role, 1)
                """
            ),
            {"login": username, "mot_de_passe": password_hash, "role": role},
        ).scalar()
        db.session.commit()

        token = create_access_token(identity=username, additional_claims={"role": role})
        return {
            "id": int(user_id),
            "username": username,
            "email": None,
            "role": role,
            "student_id": None,
            "teacher_id": None,
            "token": token,
        }

    @staticmethod
    def login(payload: dict) -> dict:
        username = payload.get("username", "").strip()
        password = payload.get("password", "")
        if not username or not password:
            raise ValueError("Identifiants invalides")

        row = db.session.execute(
            text(
                """
                SELECT id_utilisateur, login, mot_de_passe, role, est_actif
                FROM utilisateur
                WHERE login = :login
                """
            ),
            {"login": username},
        ).mappings().first()

        if not row:
            raise ValueError("Identifiants invalides")
        if int(row.get("est_actif") or 0) != 1:
            raise ValueError("Compte inactif")
        if not AuthService._verify_password(password, row["mot_de_passe"] or ""):
            raise ValueError("Identifiants invalides")

        role = (row["role"] or "").strip().lower()
        student_id = db.session.execute(
            text("SELECT id_etudiant FROM etudiant WHERE utilisateur_id = :uid"),
            {"uid": row["id_utilisateur"]},
        ).scalar()
        teacher_id = db.session.execute(
            text("SELECT id_enseignant FROM enseignant WHERE utilisateur_id = :uid"),
            {"uid": row["id_utilisateur"]},
        ).scalar()

        token = create_access_token(identity=row["login"], additional_claims={"role": role})
        return {
            "id": int(row["id_utilisateur"]),
            "username": row["login"],
            "email": None,
            "role": role,
            "student_id": int(student_id) if student_id is not None else None,
            "teacher_id": int(teacher_id) if teacher_id is not None else None,
            "token": token,
        }
