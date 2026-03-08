from flask import Blueprint

from controllers.timetable_controller import create_timetable_entry, get_timetable
from utils.auth import role_required


timetable_bp = Blueprint("timetable", __name__)


timetable_bp.get("/timetable")(role_required("admin", "enseignant", "etudiant")(get_timetable))
timetable_bp.post("/timetable")(role_required("admin")(create_timetable_entry))
