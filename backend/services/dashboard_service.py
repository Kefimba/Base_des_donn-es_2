from __future__ import annotations

from sqlalchemy import text

from database.db import db


class DashboardService:
    @staticmethod
    def admin_stats() -> dict:
        by_filiere_rows = db.session.execute(
            text(
                """
                SELECT f.nom_filiere AS name, COUNT(i.id_inscription) AS value
                FROM filiere f
                LEFT JOIN classe c ON c.filiere_id = f.id_filiere
                LEFT JOIN inscription i ON i.classe_id = c.id_classe AND i.statut = 'Actif'
                GROUP BY f.nom_filiere
                ORDER BY f.nom_filiere
                """
            )
        ).mappings().all()

        avg_by_matiere_rows = db.session.execute(
            text(
                """
                SELECT m.libelle AS name, AVG(CAST(n.note AS FLOAT)) AS value
                FROM matiere m
                LEFT JOIN evaluation e ON e.matiere_id = m.id_matiere
                LEFT JOIN obtenir_note n ON n.evaluation_id = e.id_evaluation
                GROUP BY m.libelle
                ORDER BY m.libelle
                """
            )
        ).mappings().all()

        success_rate_row = db.session.execute(
            text(
                """
                SELECT
                    COUNT(1) AS total,
                    SUM(CASE WHEN n.note >= 10 THEN 1 ELSE 0 END) AS ok_count
                FROM obtenir_note n
                """
            )
        ).mappings().first()

        evolution_rows = db.session.execute(
            text(
                """
                SELECT s.libelle_semestre AS semestre, AVG(CAST(n.note AS FLOAT)) AS moyenne
                FROM obtenir_note n
                JOIN evaluation e ON e.id_evaluation = n.evaluation_id
                JOIN matiere m ON m.id_matiere = e.matiere_id
                JOIN unite_enseignement ue ON ue.id_ue = m.ue_id
                JOIN semestre s ON s.id_semestre = ue.semestre_id
                GROUP BY s.libelle_semestre
                ORDER BY s.libelle_semestre
                """
            )
        ).mappings().all()

        total = int((success_rate_row or {}).get("total") or 0)
        ok = int((success_rate_row or {}).get("ok_count") or 0)

        return {
            "students_by_filiere": [
                {"name": row["name"], "value": int(row["value"] or 0)}
                for row in by_filiere_rows
            ],
            "avg_by_matiere": [
                {"name": row["name"], "value": round(float(row["value"] or 0), 2)}
                for row in avg_by_matiere_rows
            ],
            "success_rate": round((ok / total) * 100, 2) if total else 0,
            "results_evolution": [
                {"semestre": row["semestre"], "moyenne": round(float(row["moyenne"] or 0), 2)}
                for row in evolution_rows
            ],
        }
