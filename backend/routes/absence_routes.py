from flask import Blueprint

from controllers.absence_controller import create_absence, get_absence_by_student
from utils.auth import role_required


absence_bp = Blueprint("absence", __name__)


absence_bp.post("/absences")(role_required("admin", "enseignant")(create_absence))
absence_bp.get("/absences/student/<int:student_id>")(role_required("admin", "enseignant", "etudiant")(get_absence_by_student))
