from flask import Blueprint
from flask_jwt_extended import jwt_required

from controllers.academic_controller import (
    create_classe,
    create_filiere,
    create_matiere,
    get_classe_list,
    get_filiere_list,
    get_matiere_list,
)
from utils.auth import role_required


academic_bp = Blueprint("academic", __name__)


academic_bp.get("/filieres")(jwt_required()(get_filiere_list))
academic_bp.post("/filieres")(role_required("admin")(create_filiere))
academic_bp.get("/classes")(jwt_required()(get_classe_list))
academic_bp.post("/classes")(role_required("admin")(create_classe))
academic_bp.get("/matieres")(jwt_required()(get_matiere_list))
academic_bp.post("/matieres")(role_required("admin")(create_matiere))
