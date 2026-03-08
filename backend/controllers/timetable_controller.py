from __future__ import annotations

from flask import jsonify, request
from sqlalchemy import text

from database.db import db
from utils.auth import current_login, current_role


def get_timetable():
    classe_id = request.args.get("classe_id")
    role = current_role()
    login = current_login()

    teacher_scope_clause = "1=1"
    if role == "enseignant":
        teacher_scope_clause = "u.login = :teacher_login"

    query = f"""
        SELECT
            ROW_NUMBER() OVER (ORDER BY s.date_heure_debut ASC, ensg.classe_id ASC) AS id,
            ensg.classe_id,
            ensg.matiere_id,
            ensg.enseignant_id,
            DATENAME(WEEKDAY, s.date_heure_debut) AS jour,
            CONVERT(VARCHAR(5), s.date_heure_debut, 108) AS heure_debut,
            CONVERT(VARCHAR(5), s.date_heure_fin, 108) AS heure_fin,
            s.salle,
            c.nom_classe AS classe,
            m.libelle AS matiere,
            CONCAT(e.prenom, ' ', e.nom) AS enseignant
        FROM seance_cours s
        JOIN enseignement ensg ON ensg.id_enseignement = s.enseignement_id
        LEFT JOIN classe c ON c.id_classe = ensg.classe_id
        LEFT JOIN matiere m ON m.id_matiere = ensg.matiere_id
        LEFT JOIN enseignant e ON e.id_enseignant = ensg.enseignant_id
        LEFT JOIN utilisateur u ON u.id_utilisateur = e.utilisateur_id
        WHERE {teacher_scope_clause}
          AND (:classe_id IS NULL OR ensg.classe_id = :classe_id)
        ORDER BY s.date_heure_debut ASC
    """
    items = db.session.execute(
        text(query),
        {"classe_id": classe_id, "teacher_login": login},
    ).mappings().all()
    return jsonify([dict(row) for row in items]), 200


def create_timetable_entry():
    payload = request.get_json() or {}
    required = ["classe_id", "matiere_id", "enseignant_id", "jour", "heure_debut", "heure_fin"]
    missing = [f for f in required if payload.get(f) in (None, "")]
    if missing:
        return jsonify({"message": f"Champs obligatoires: {', '.join(missing)}"}), 400

    enseignement_id = db.session.execute(
        text(
            """
            SELECT TOP 1 id_enseignement
            FROM enseignement
            WHERE classe_id = :classe_id
              AND matiere_id = :matiere_id
              AND enseignant_id = :enseignant_id
            """
        ),
        {
            "classe_id": int(payload["classe_id"]),
            "matiere_id": int(payload["matiere_id"]),
            "enseignant_id": int(payload["enseignant_id"]),
        },
    ).scalar()
    if enseignement_id is None:
        return jsonify({"message": "Affectation enseignement introuvable pour ce cours"}), 400

    db.session.execute(
        text(
            """
            INSERT INTO seance_cours (enseignement_id, date_heure_debut, date_heure_fin, salle)
            VALUES (
                :enseignement_id,
                CAST(CONVERT(date, GETDATE()) AS datetime) + CAST(:heure_debut AS datetime),
                CAST(CONVERT(date, GETDATE()) AS datetime) + CAST(:heure_fin AS datetime),
                :salle
            )
            """
        ),
        {
            "enseignement_id": int(enseignement_id),
            "heure_debut": payload["heure_debut"],
            "heure_fin": payload["heure_fin"],
            "salle": payload.get("salle"),
        },
    )
    db.session.commit()
    return jsonify({"message": "Cours planifie"}), 201
