from __future__ import annotations

from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from sqlalchemy import text
from werkzeug.exceptions import NotFound

from database.db import db
from services.grade_service import GradeService


class ReportService:
    @staticmethod
    def _resolve_student(student_ref: str) -> dict:
        ref = (student_ref or "").strip()
        if not ref:
            raise NotFound("Etudiant introuvable")

        if ref.isdigit():
            row = db.session.execute(
                text(
                    """
                    SELECT id_etudiant, matricule, prenom, nom
                    FROM etudiant
                    WHERE id_etudiant = :value OR matricule = :matricule
                    """
                ),
                {"value": int(ref), "matricule": ref},
            ).mappings().first()
        else:
            row = db.session.execute(
                text(
                    """
                    SELECT id_etudiant, matricule, prenom, nom
                    FROM etudiant
                    WHERE matricule = :matricule
                    """
                ),
                {"matricule": ref},
            ).mappings().first()

        if not row:
            raise NotFound("Etudiant introuvable")
        return dict(row)

    @staticmethod
    def student_report_pdf(student_ref: str) -> tuple[bytes, str]:
        student = ReportService._resolve_student(student_ref)
        student_id = int(student["id_etudiant"])
        grade_data = GradeService.get_student_grades(student_id)

        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=A4)

        y = 800
        pdf.setFont("Helvetica-Bold", 16)
        pdf.drawString(50, y, "Bulletin de notes")
        y -= 30

        pdf.setFont("Helvetica", 11)
        pdf.drawString(50, y, f"Etudiant: {student['prenom']} {student['nom']}")
        y -= 18
        pdf.drawString(50, y, f"Matricule: {student['matricule']}")
        y -= 25

        pdf.setFont("Helvetica-Bold", 11)
        pdf.drawString(50, y, "Matiere")
        pdf.drawString(240, y, "Type")
        pdf.drawString(320, y, "Coef")
        pdf.drawString(380, y, "Note")
        y -= 12
        pdf.line(50, y, 540, y)
        y -= 18

        pdf.setFont("Helvetica", 10)
        for g in grade_data["grades"]:
            if y < 100:
                pdf.showPage()
                y = 800
            pdf.drawString(50, y, str(g.get("matiere", ""))[:32])
            pdf.drawString(240, y, str(g.get("type_evaluation", ""))[:12])
            pdf.drawString(320, y, str(g.get("coefficient", "")))
            pdf.drawString(380, y, str(g.get("valeur", "")))
            y -= 16

        y -= 10
        pdf.setFont("Helvetica-Bold", 11)
        pdf.drawString(50, y, f"Moyenne ponderee: {grade_data['moyenne']}")
        y -= 16
        pdf.drawString(50, y, f"Mention: {grade_data['mention']}")
        y -= 16
        pdf.drawString(50, y, f"Total coefficients: {grade_data.get('total_coefficients', 0)}")

        pdf.save()
        buffer.seek(0)

        filename = f"bulletin_{student['matricule']}.pdf"
        return buffer.read(), filename
