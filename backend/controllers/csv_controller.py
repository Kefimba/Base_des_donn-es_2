from __future__ import annotations

from flask import jsonify, request

from services.csv_import_service import CsvImportService


def import_students_csv():
    file = request.files.get("file")
    if not file:
        return jsonify({"message": "Fichier CSV requis"}), 400
    return jsonify(CsvImportService.import_students(file)), 200


def import_teachers_csv():
    file = request.files.get("file")
    if not file:
        return jsonify({"message": "Fichier CSV requis"}), 400
    return jsonify(CsvImportService.import_teachers(file)), 200


def import_grades_csv():
    file = request.files.get("file")
    if not file:
        return jsonify({"message": "Fichier CSV requis"}), 400
    return jsonify(CsvImportService.import_grades(file)), 200
