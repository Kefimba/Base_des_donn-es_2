from flask import Blueprint

from controllers.report_controller import get_student_report
from utils.auth import role_required


report_bp = Blueprint("report", __name__)


report_bp.get("/report/student/<student_ref>")(role_required("admin", "etudiant", "enseignant")(get_student_report))
