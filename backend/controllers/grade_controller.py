from __future__ import annotations

from flask import jsonify, request

from services.grade_service import GradeService
from utils.auth import current_login, current_role
from utils.validators import require_fields


def get_grade_references():
    try:
        return jsonify(GradeService.list_references(current_role(), current_login())), 200
    except Exception as exc:
        return jsonify({"message": str(exc)}), 400


def create_grade():
    payload = request.get_json() or {}
    missing = require_fields(payload, ["evaluation_id", "etudiant_id", "note"])
    if missing:
        return jsonify({"message": f"Champs obligatoires: {', '.join(missing)}"}), 400
    try:
        return jsonify(GradeService.upsert_grade(payload, current_role(), current_login())), 201
    except Exception as exc:
        return jsonify({"message": str(exc)}), 400


def get_grades_by_student(student_id: int):
    try:
        return jsonify(GradeService.get_student_grades(student_id, current_role(), current_login())), 200
    except Exception as exc:
        return jsonify({"message": str(exc)}), 400
