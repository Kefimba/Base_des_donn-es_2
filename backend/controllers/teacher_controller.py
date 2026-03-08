from __future__ import annotations

import bcrypt
from flask import jsonify, request

from services.teacher_service import TeacherService
from utils.validators import require_fields


def get_teachers():
    status = request.args.get("status", "actif")
    return jsonify(TeacherService.list_teachers(status)), 200


def create_teacher():
    payload = request.get_json() or {}
    missing = require_fields(payload, ["username", "password", "nom", "prenom", "email"])
    if missing:
        return jsonify({"message": f"Champs obligatoires: {', '.join(missing)}"}), 400

    payload["password_hash"] = bcrypt.hashpw(payload["password"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    try:
        return jsonify(TeacherService.create_teacher(payload)), 201
    except Exception as exc:
        return jsonify({"message": str(exc)}), 400


def delete_teacher(teacher_id: int):
    try:
        return jsonify(TeacherService.delete_teacher(teacher_id)), 200
    except Exception as exc:
        return jsonify({"message": str(exc)}), 400


def restore_teacher(teacher_id: int):
    try:
        return jsonify(TeacherService.restore_teacher(teacher_id)), 200
    except Exception as exc:
        return jsonify({"message": str(exc)}), 400
