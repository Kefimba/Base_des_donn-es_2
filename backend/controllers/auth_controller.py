from __future__ import annotations

from flask import jsonify, request

from services.auth_service import AuthService
from utils.validators import require_fields


def register_user():
    payload = request.get_json() or {}
    missing = require_fields(payload, ["username", "password", "role"])
    if missing:
        return jsonify({"message": f"Champs obligatoires: {', '.join(missing)}"}), 400
    try:
        result = AuthService.register(payload)
        return jsonify(result), 201
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400


def login_user():
    payload = request.get_json() or {}
    missing = require_fields(payload, ["username", "password"])
    if missing:
        return jsonify({"message": f"Champs obligatoires: {', '.join(missing)}"}), 400
    try:
        result = AuthService.login(payload)
        return jsonify(result), 200
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 401
