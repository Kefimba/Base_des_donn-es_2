from __future__ import annotations

from sqlalchemy import text

from database.db import db


class GradeService:
    @staticmethod
    def _teacher_scope_clause(role: str | None) -> str:
        if role == "enseignant":
            return """
                EXISTS (
                    SELECT 1
                    FROM inscription i
                    JOIN enseignement ensg ON ensg.classe_id = i.classe_id
                    JOIN enseignant ens ON ens.id_enseignant = ensg.enseignant_id
                    JOIN utilisateur u ON u.id_utilisateur = ens.utilisateur_id
                    WHERE i.etudiant_id = e.id_etudiant
                      AND u.login = :teacher_login
                )
            """
        return "1=1"

    @staticmethod
    def _teacher_eval_scope_clause(role: str | None) -> str:
        if role == "enseignant":
            return """
                EXISTS (
                    SELECT 1
                    FROM enseignement ensg
                    JOIN enseignant ens ON ens.id_enseignant = ensg.enseignant_id
                    JOIN utilisateur u ON u.id_utilisateur = ens.utilisateur_id
                    WHERE ensg.matiere_id = e.matiere_id
                      AND u.login = :teacher_login
                )
            """
        return "1=1"

    @staticmethod
    def list_references(role: str | None = None, login: str | None = None) -> dict:
        student_scope = GradeService._teacher_scope_clause(role)
        eval_scope = GradeService._teacher_eval_scope_clause(role)

        students = db.session.execute(
            text(
                f"""
                SELECT e.id_etudiant, e.nom, e.prenom, e.matricule
                FROM etudiant e
                WHERE e.est_actif = 1
                  AND {student_scope}
                ORDER BY e.nom, e.prenom
                """
            ),
            {"teacher_login": login},
        ).mappings().all()

        evaluations = db.session.execute(
            text(
                f"""
                SELECT
                    e.id_evaluation,
                    e.type_evaluation,
                    e.date_evaluation,
                    m.id_matiere,
                    m.libelle AS libelle_matiere
                FROM evaluation e
                JOIN matiere m ON m.id_matiere = e.matiere_id
                WHERE {eval_scope}
                ORDER BY e.id_evaluation DESC
                """
            ),
            {"teacher_login": login},
        ).mappings().all()

        return {
            "students": [dict(row) for row in students],
            "evaluations": [dict(row) for row in evaluations],
        }

    @staticmethod
    def upsert_grade(payload: dict, role: str | None = None, login: str | None = None) -> dict:
        value = float(payload["note"])
        if value < 0 or value > 20:
            raise ValueError("La note doit etre comprise entre 0 et 20")

        evaluation_id = int(payload["evaluation_id"])
        etudiant_id = int(payload["etudiant_id"])

        if role == "enseignant":
            allowed = db.session.execute(
                text(
                    """
                    SELECT COUNT(1)
                    FROM evaluation e
                    JOIN inscription i ON i.etudiant_id = :etudiant_id
                    JOIN enseignement ensg ON ensg.classe_id = i.classe_id AND ensg.matiere_id = e.matiere_id
                    JOIN enseignant ens ON ens.id_enseignant = ensg.enseignant_id
                    JOIN utilisateur u ON u.id_utilisateur = ens.utilisateur_id
                    WHERE e.id_evaluation = :evaluation_id
                      AND u.login = :teacher_login
                    """
                ),
                {
                    "evaluation_id": evaluation_id,
                    "etudiant_id": etudiant_id,
                    "teacher_login": login,
                },
            ).scalar() or 0
            if int(allowed) == 0:
                raise ValueError("Vous ne pouvez noter que vos etudiants")

        exists = db.session.execute(
            text(
                """
                SELECT COUNT(1)
                FROM obtenir_note
                WHERE evaluation_id = :evaluation_id AND etudiant_id = :etudiant_id
                """
            ),
            {"evaluation_id": evaluation_id, "etudiant_id": etudiant_id},
        ).scalar() or 0

        if int(exists) > 0:
            if role == "enseignant":
                raise ValueError("Modification interdite pour l'enseignant")
            db.session.execute(
                text(
                    """
                    UPDATE obtenir_note
                    SET note = :note
                    WHERE evaluation_id = :evaluation_id AND etudiant_id = :etudiant_id
                    """
                ),
                {"note": value, "evaluation_id": evaluation_id, "etudiant_id": etudiant_id},
            )
            action = "mise a jour"
        else:
            db.session.execute(
                text(
                    """
                    INSERT INTO obtenir_note (evaluation_id, etudiant_id, note)
                    VALUES (:evaluation_id, :etudiant_id, :note)
                    """
                ),
                {"evaluation_id": evaluation_id, "etudiant_id": etudiant_id, "note": value},
            )
            action = "enregistree"

        db.session.commit()
        return {
            "evaluation_id": evaluation_id,
            "etudiant_id": etudiant_id,
            "note": value,
            "message": f"Note {action}",
        }

    @staticmethod
    def get_student_grades(student_id: int, role: str | None = None, login: str | None = None) -> dict:
        if role == "enseignant":
            allowed = db.session.execute(
                text(
                    """
                    SELECT COUNT(1)
                    FROM inscription i
                    JOIN enseignement ensg ON ensg.classe_id = i.classe_id
                    JOIN enseignant ens ON ens.id_enseignant = ensg.enseignant_id
                    JOIN utilisateur u ON u.id_utilisateur = ens.utilisateur_id
                    WHERE i.etudiant_id = :student_id
                      AND u.login = :teacher_login
                    """
                ),
                {"student_id": student_id, "teacher_login": login},
            ).scalar() or 0
            if int(allowed) == 0:
                raise ValueError("Acces refuse a ces notes")

        grades = db.session.execute(
            text(
                """
                SELECT
                    n.evaluation_id,
                    n.etudiant_id,
                    n.note AS valeur,
                    e.type_evaluation,
                    e.date_evaluation,
                    m.id_matiere AS matiere_id,
                    m.libelle AS matiere,
                    m.coefficient
                FROM obtenir_note n
                JOIN evaluation e ON e.id_evaluation = n.evaluation_id
                JOIN matiere m ON m.id_matiere = e.matiere_id
                WHERE n.etudiant_id = :student_id
                ORDER BY m.libelle ASC, e.date_evaluation DESC, n.evaluation_id DESC
                """
            ),
            {"student_id": student_id},
        ).mappings().all()

        grade_list = [dict(row) for row in grades]
        if not grade_list:
            return {"grades": [], "moyenne": 0, "mention": "Aucune", "total_coefficients": 0}

        total_coef = 0.0
        weighted_sum = 0.0
        for g in grade_list:
            coef = float(g["coefficient"] or 1)
            total_coef += coef
            weighted_sum += float(g["valeur"]) * coef

        avg = round((weighted_sum / total_coef), 2) if total_coef else 0
        mention = "Ajourne"
        if avg >= 16:
            mention = "Tres bien"
        elif avg >= 14:
            mention = "Bien"
        elif avg >= 12:
            mention = "Assez bien"
        elif avg >= 10:
            mention = "Passable"

        return {
            "grades": grade_list,
            "moyenne": avg,
            "mention": mention,
            "total_coefficients": round(total_coef, 2),
        }
