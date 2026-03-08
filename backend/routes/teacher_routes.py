from flask import Blueprint

from controllers.teacher_controller import create_teacher, delete_teacher, get_teachers, restore_teacher
from utils.auth import role_required


teachers_bp = Blueprint("teachers", __name__)


teachers_bp.get("/teachers")(role_required("admin", "enseignant")(get_teachers))
teachers_bp.post("/teachers")(role_required("admin")(create_teacher))
teachers_bp.delete("/teachers/<int:teacher_id>")(role_required("admin")(delete_teacher))
teachers_bp.patch("/teachers/<int:teacher_id>/restore")(role_required("admin")(restore_teacher))
