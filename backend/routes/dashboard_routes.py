from flask import Blueprint

from controllers.dashboard_controller import get_admin_dashboard
from utils.auth import role_required


dashboard_bp = Blueprint("dashboard", __name__)


dashboard_bp.get("/dashboard/admin")(role_required("admin")(get_admin_dashboard))
