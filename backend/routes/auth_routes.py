from flask import Blueprint

from controllers.auth_controller import login_user, register_user


auth_bp = Blueprint("auth", __name__)


auth_bp.post("/register")(register_user)
auth_bp.post("/login")(login_user)
