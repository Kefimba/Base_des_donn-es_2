from __future__ import annotations

from datetime import datetime

from flask import jsonify, request

from database.db import db
from models.entities import Absence


def create_absence():
    payload = request.get_json() or {}
    item = Absence(
        etudiant_id=payload["etudiant_id"],
        matiere_id=payload["matiere_id"],
        date_absence=datetime.strptime(payload["date_absence"], "%Y-%m-%d").date(),
        justifiee=payload.get("justifiee", False),
        commentaire=payload.get("commentaire"),
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({"id": item.id, "message": "Absence enregistree"}), 201


def get_absence_by_student(student_id: int):
    rows = Absence.query.filter_by(etudiant_id=student_id).order_by(Absence.date_absence.desc()).all()
    return jsonify([
        {
            "id": x.id,
            "matiere": x.matiere.nom,
            "date_absence": x.date_absence.isoformat(),
            "justifiee": x.justifiee,
            "commentaire": x.commentaire,
        }
        for x in rows
    ]), 200
