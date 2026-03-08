from __future__ import annotations

from sqlalchemy import text

from database.db import db


class StudentService:
    @staticmethod
    def list_students(
        page: int,
        per_page: int,
        search: str | None,
        status: str = "actif",
        role: str | None = None,
        login: str | None = None,
    ) -> dict:
        term = f"%{search}%" if search else None
        offset = (page - 1) * per_page
        if status == "inactif":
            status_clause = "e.est_actif = 0"
        elif status == "tous":
            status_clause = "1=1"
        else:
            status_clause = "e.est_actif = 1"

        teacher_scope_clause = "1=1"
        if role == "enseignant":
            teacher_scope_clause = """
                EXISTS (
                    SELECT 1
                    FROM inscription i
                    JOIN enseignement ensg ON ensg.classe_id = i.classe_id
                    JOIN enseignant ens ON ens.id_enseignant = ensg.enseignant_id
                    JOIN utilisateur u2 ON u2.id_utilisateur = ens.utilisateur_id
                    WHERE i.etudiant_id = e.id_etudiant
                      AND u2.login = :teacher_login
                )
            """

        total = db.session.execute(
            text(
                f"""
                SELECT COUNT(1)
                FROM etudiant e
                WHERE {status_clause}
                  AND {teacher_scope_clause}
                  AND (:term IS NULL OR e.nom LIKE :term OR e.prenom LIKE :term OR e.matricule LIKE :term)
                """
            ),
            {"term": term, "teacher_login": login},
        ).scalar() or 0

        rows = db.session.execute(
            text(
                f"""
                SELECT
                    e.id_etudiant,
                    e.utilisateur_id,
                    e.matricule,
                    e.nom,
                    e.prenom,
                    e.telephone,
                    e.email,
                    e.est_actif,
                    u.login AS username
                FROM etudiant e
                LEFT JOIN utilisateur u ON u.id_utilisateur = e.utilisateur_id
                WHERE {status_clause}
                  AND {teacher_scope_clause}
                  AND (:term IS NULL OR e.nom LIKE :term OR e.prenom LIKE :term OR e.matricule LIKE :term)
                ORDER BY e.id_etudiant DESC
                OFFSET :offset ROWS FETCH NEXT :per_page ROWS ONLY
                """
            ),
            {"term": term, "offset": offset, "per_page": per_page, "teacher_login": login},
        ).mappings().all()

        pages = (int(total) + per_page - 1) // per_page if per_page else 1
        return {
            "items": [dict(row) for row in rows],
            "total": int(total),
            "page": page,
            "per_page": per_page,
            "pages": max(pages, 1),
        }

    @staticmethod
    def create_student(payload: dict) -> dict:
        user_id = db.session.execute(
            text(
                """
                INSERT INTO utilisateur (login, mot_de_passe, role, est_actif)
                OUTPUT INSERTED.id_utilisateur
                VALUES (:login, :mot_de_passe, 'etudiant', 1)
                """
            ),
            {"login": payload["username"], "mot_de_passe": payload["password_hash"]},
        ).scalar()

        student_id = db.session.execute(
            text(
                """
                INSERT INTO etudiant (utilisateur_id, matricule, nom, prenom, telephone, email, est_actif)
                OUTPUT INSERTED.id_etudiant
                VALUES (:utilisateur_id, :matricule, :nom, :prenom, :telephone, :email, 1)
                """
            ),
            {
                "utilisateur_id": user_id,
                "matricule": payload["matricule"],
                "nom": payload["nom"],
                "prenom": payload["prenom"],
                "telephone": payload.get("telephone"),
                "email": payload["email"],
            },
        ).scalar()

        db.session.commit()
        return {"id_etudiant": int(student_id), "message": "Etudiant cree"}

    @staticmethod
    def update_student(student_id: int, payload: dict) -> dict:
        db.session.execute(
            text(
                """
                UPDATE etudiant
                SET
                    nom = COALESCE(:nom, nom),
                    prenom = COALESCE(:prenom, prenom),
                    telephone = COALESCE(:telephone, telephone),
                    email = COALESCE(:email, email)
                WHERE id_etudiant = :id_etudiant
                """
            ),
            {
                "id_etudiant": student_id,
                "nom": payload.get("nom"),
                "prenom": payload.get("prenom"),
                "telephone": payload.get("telephone"),
                "email": payload.get("email"),
            },
        )
        db.session.commit()
        return {"id_etudiant": student_id, "message": "Etudiant mis a jour"}

    @staticmethod
    def delete_student(student_id: int) -> dict:
        user_id = db.session.execute(
            text("SELECT utilisateur_id FROM etudiant WHERE id_etudiant = :id_etudiant"),
            {"id_etudiant": student_id},
        ).scalar()

        db.session.execute(
            text("UPDATE etudiant SET est_actif = 0 WHERE id_etudiant = :id_etudiant"),
            {"id_etudiant": student_id},
        )
        if user_id is not None:
            db.session.execute(
                text("UPDATE utilisateur SET est_actif = 0 WHERE id_utilisateur = :uid"),
                {"uid": user_id},
            )
        db.session.commit()
        return {"message": "Etudiant desactive"}

    @staticmethod
    def restore_student(student_id: int) -> dict:
        user_id = db.session.execute(
            text("SELECT utilisateur_id FROM etudiant WHERE id_etudiant = :id_etudiant"),
            {"id_etudiant": student_id},
        ).scalar()

        db.session.execute(
            text("UPDATE etudiant SET est_actif = 1 WHERE id_etudiant = :id_etudiant"),
            {"id_etudiant": student_id},
        )
        if user_id is not None:
            db.session.execute(
                text("UPDATE utilisateur SET est_actif = 1 WHERE id_utilisateur = :uid"),
                {"uid": user_id},
            )
        db.session.commit()
        return {"message": "Etudiant reactive"}
