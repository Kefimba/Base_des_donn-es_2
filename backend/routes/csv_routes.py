from flask import Blueprint

from controllers.csv_controller import import_grades_csv, import_students_csv, import_teachers_csv
from utils.auth import role_required


csv_bp = Blueprint("csv", __name__)


csv_bp.post("/import/students")(role_required("admin")(import_students_csv))
csv_bp.post("/import/teachers")(role_required("admin")(import_teachers_csv))
csv_bp.post("/import/grades")(role_required("admin")(import_grades_csv))
