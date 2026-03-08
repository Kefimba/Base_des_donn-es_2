from flask import Blueprint

from controllers.grade_controller import create_grade, get_grade_references, get_grades_by_student
from utils.auth import role_required


grades_bp = Blueprint("grades", __name__)


grades_bp.get("/grades/references")(role_required("admin", "enseignant")(get_grade_references))
grades_bp.post("/grades")(role_required("admin", "enseignant")(create_grade))
grades_bp.get("/grades/student/<int:student_id>")(role_required("admin", "enseignant", "etudiant")(get_grades_by_student))
