from __future__ import annotations

import bcrypt
from flask import jsonify, request

from services.student_service import StudentService
from utils.auth import current_login, current_role
from utils.validators import require_fields


def get_students():
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))
    search = request.args.get("search")
    status = request.args.get("status", "actif")
    role = current_role()
    login = current_login()
    return jsonify(StudentService.list_students(page, per_page, search, status, role, login)), 200


def create_student():
    payload = request.get_json() or {}
    missing = require_fields(payload, ["username", "password", "matricule", "prenom", "nom", "email"])
    if missing:
        return jsonify({"message": f"Champs obligatoires: {', '.join(missing)}"}), 400
    payload["password_hash"] = bcrypt.hashpw(payload["password"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    try:
        result = StudentService.create_student(payload)
        return jsonify(result), 201
    except Exception as exc:
        return jsonify({"message": str(exc)}), 400


def update_student(student_id: int):
    payload = request.get_json() or {}
    try:
        return jsonify(StudentService.update_student(student_id, payload)), 200
    except Exception as exc:
        return jsonify({"message": str(exc)}), 400


def delete_student(student_id: int):
    try:
        return jsonify(StudentService.delete_student(student_id)), 200
    except Exception as exc:
        return jsonify({"message": str(exc)}), 400


def restore_student(student_id: int):
    try:
        return jsonify(StudentService.restore_student(student_id)), 200
    except Exception as exc:
        return jsonify({"message": str(exc)}), 400
