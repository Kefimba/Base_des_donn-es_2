from __future__ import annotations

from flask import jsonify, request
from sqlalchemy import text

from database.db import db
from utils.auth import current_login, current_role
from utils.validators import require_fields


def get_filiere_list():
    rows = db.session.execute(
        text(
            """
            SELECT id_filiere, nom_filiere, description, est_actif
            FROM filiere
            ORDER BY id_filiere DESC
            """
        )
    ).mappings().all()
    return jsonify([dict(row) for row in rows]), 200


def create_filiere():
    payload = request.get_json() or {}
    missing = require_fields(payload, ["nom_filiere"])
    if missing:
        return jsonify({"message": f"Champs obligatoires: {', '.join(missing)}"}), 400

    params = {
        "nom_filiere": payload["nom_filiere"].strip(),
        "description": (payload.get("description") or "").strip() or None,
    }
    db.session.execute(
        text(
            """
            INSERT INTO filiere (nom_filiere, description, est_actif)
            VALUES (:nom_filiere, :description, 1)
            """
        ),
        params,
    )
    db.session.commit()
    return jsonify({"message": "Filiere creee"}), 201


def get_classe_list():
    role = current_role()
    login = current_login()
    scope_clause = "1=1"
    if role == "enseignant":
        scope_clause = """
            EXISTS (
                SELECT 1
                FROM enseignement ensg
                JOIN enseignant e ON e.id_enseignant = ensg.enseignant_id
                JOIN utilisateur u ON u.id_utilisateur = e.utilisateur_id
                WHERE ensg.classe_id = c.id_classe
                  AND u.login = :teacher_login
            )
        """

    rows = db.session.execute(
        text(
            f"""
            SELECT id_classe, filiere_id, nom_classe, est_actif
            FROM classe c
            WHERE {scope_clause}
            ORDER BY id_classe DESC
            """
        ),
        {"teacher_login": login},
    ).mappings().all()
    return jsonify([dict(row) for row in rows]), 200


def create_classe():
    payload = request.get_json() or {}
    missing = require_fields(payload, ["nom_classe", "filiere_id"])
    if missing:
        return jsonify({"message": f"Champs obligatoires: {', '.join(missing)}"}), 400

    params = {
        "nom_classe": payload["nom_classe"].strip(),
        "filiere_id": int(payload["filiere_id"]),
    }
    db.session.execute(
        text(
            """
            INSERT INTO classe (filiere_id, nom_classe, est_actif)
            VALUES (:filiere_id, :nom_classe, 1)
            """
        ),
        params,
    )
    db.session.commit()
    return jsonify({"message": "Classe creee"}), 201


def get_matiere_list():
    rows = db.session.execute(
        text(
            """
            SELECT id_matiere, ue_id, libelle, coefficient, volume_horaire
            FROM matiere
            ORDER BY id_matiere DESC
            """
        )
    ).mappings().all()
    return jsonify([dict(row) for row in rows]), 200


def create_matiere():
    payload = request.get_json() or {}
    missing = require_fields(payload, ["ue_id", "libelle", "coefficient", "volume_horaire"])
    if missing:
        return jsonify({"message": f"Champs obligatoires: {', '.join(missing)}"}), 400

    params = {
        "ue_id": int(payload["ue_id"]),
        "libelle": payload["libelle"].strip(),
        "coefficient": float(payload["coefficient"]),
        "volume_horaire": int(payload["volume_horaire"]),
    }
    db.session.execute(
        text(
            """
            INSERT INTO matiere (ue_id, libelle, coefficient, volume_horaire)
            VALUES (:ue_id, :libelle, :coefficient, :volume_horaire)
            """
        ),
        params,
    )
    db.session.commit()
    return jsonify({"message": "Matiere creee"}), 201
