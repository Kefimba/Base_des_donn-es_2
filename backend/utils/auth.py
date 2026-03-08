from __future__ import annotations

from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, verify_jwt_in_request


def role_required(*roles: str):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get("role")
            if role not in roles:
                return jsonify({"message": "Acces refuse"}), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def current_role() -> str | None:
    claims = get_jwt()
    return claims.get("role")


def current_login() -> str | None:
    return get_jwt_identity()
