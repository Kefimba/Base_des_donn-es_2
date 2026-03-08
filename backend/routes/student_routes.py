from flask import Blueprint

from controllers.student_controller import create_student, delete_student, get_students, restore_student, update_student
from utils.auth import role_required


students_bp = Blueprint("students", __name__)


students_bp.get("/students")(role_required("admin", "enseignant")(get_students))
students_bp.post("/students")(role_required("admin")(create_student))
students_bp.put("/students/<int:student_id>")(role_required("admin")(update_student))
students_bp.delete("/students/<int:student_id>")(role_required("admin")(delete_student))
students_bp.patch("/students/<int:student_id>/restore")(role_required("admin")(restore_student))
