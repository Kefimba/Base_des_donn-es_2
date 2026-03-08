from __future__ import annotations

from io import BytesIO

from flask import Response

from services.report_service import ReportService


def get_student_report(student_ref: str):
    pdf_data, filename = ReportService.student_report_pdf(student_ref)
    return Response(
        BytesIO(pdf_data).getvalue(),
        mimetype="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
