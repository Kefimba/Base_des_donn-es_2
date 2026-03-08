from __future__ import annotations

from sqlalchemy import text

from database.db import db


class TeacherService:
    @staticmethod
    def list_teachers(status: str = "actif") -> list[dict]:
        if status == "inactif":
            status_clause = "e.est_actif = 0"
        elif status == "tous":
            status_clause = "1=1"
        else:
            status_clause = "e.est_actif = 1"

        rows = db.session.execute(
            text(
                f"""
                SELECT
                    e.id_enseignant,
                    e.nom,
                    e.prenom,
                    e.telephone,
                    e.email,
                    e.est_actif,
                    u.login AS username
                FROM enseignant e
                LEFT JOIN utilisateur u ON u.id_utilisateur = e.utilisateur_id
                WHERE {status_clause}
                ORDER BY e.id_enseignant DESC
                """
            )
        ).mappings().all()
        return [dict(row) for row in rows]

    @staticmethod
    def create_teacher(payload: dict) -> dict:
        user_id = db.session.execute(
            text(
                """
                INSERT INTO utilisateur (login, mot_de_passe, role, est_actif)
                OUTPUT INSERTED.id_utilisateur
                VALUES (:login, :mot_de_passe, 'enseignant', 1)
                """
            ),
            {"login": payload["username"], "mot_de_passe": payload["password_hash"]},
        ).scalar()

        teacher_id = db.session.execute(
            text(
                """
                INSERT INTO enseignant (utilisateur_id, nom, prenom, telephone, email, est_actif)
                OUTPUT INSERTED.id_enseignant
                VALUES (:utilisateur_id, :nom, :prenom, :telephone, :email, 1)
                """
            ),
            {
                "utilisateur_id": user_id,
                "nom": payload["nom"],
                "prenom": payload["prenom"],
                "telephone": payload.get("telephone"),
                "email": payload["email"],
            },
        ).scalar()

        db.session.commit()
        return {"id_enseignant": int(teacher_id), "message": "Enseignant cree"}

    @staticmethod
    def delete_teacher(teacher_id: int) -> dict:
        user_id = db.session.execute(
            text("SELECT utilisateur_id FROM enseignant WHERE id_enseignant = :id"),
            {"id": teacher_id},
        ).scalar()

        db.session.execute(
            text("UPDATE enseignant SET est_actif = 0 WHERE id_enseignant = :id"),
            {"id": teacher_id},
        )

        if user_id is not None:
            db.session.execute(
                text("UPDATE utilisateur SET est_actif = 0 WHERE id_utilisateur = :uid"),
                {"uid": user_id},
            )

        db.session.commit()
        return {"message": "Enseignant desactive"}

    @staticmethod
    def restore_teacher(teacher_id: int) -> dict:
        user_id = db.session.execute(
            text("SELECT utilisateur_id FROM enseignant WHERE id_enseignant = :id"),
            {"id": teacher_id},
        ).scalar()

        db.session.execute(
            text("UPDATE enseignant SET est_actif = 1 WHERE id_enseignant = :id"),
            {"id": teacher_id},
        )

        if user_id is not None:
            db.session.execute(
                text("UPDATE utilisateur SET est_actif = 1 WHERE id_utilisateur = :uid"),
                {"uid": user_id},
            )

        db.session.commit()
        return {"message": "Enseignant reactive"}
