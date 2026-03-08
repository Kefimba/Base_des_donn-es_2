from __future__ import annotations

import csv
from io import StringIO

from database.db import db
from models.entities import Enseignant, Etudiant, Note, Utilisateur


class CsvImportService:
    @staticmethod
    def _read_csv(file_storage) -> list[dict]:
        content = file_storage.read().decode("utf-8")
        reader = csv.DictReader(StringIO(content))
        return list(reader)

    @staticmethod
    def import_students(file_storage) -> dict:
        rows = CsvImportService._read_csv(file_storage)
        errors = []
        created = 0

        required = {"username", "email", "password_hash", "matricule", "nom", "prenom"}
        for idx, row in enumerate(rows, start=2):
            if not required.issubset(set(row.keys())):
                errors.append(f"Ligne {idx}: colonnes manquantes")
                continue
            try:
                user = Utilisateur(
                    username=row["username"],
                    email=row["email"],
                    password_hash=row["password_hash"],
                    role="etudiant",
                )
                db.session.add(user)
                db.session.flush()

                student = Etudiant(
                    utilisateur_id=user.id,
                    matricule=row["matricule"],
                    nom=row["nom"],
                    prenom=row["prenom"],
                )
                db.session.add(student)
                created += 1
            except Exception as exc:
                db.session.rollback()
                errors.append(f"Ligne {idx}: {exc}")

        if created:
            db.session.commit()

        return {"created": created, "errors": errors}

    @staticmethod
    def import_teachers(file_storage) -> dict:
        rows = CsvImportService._read_csv(file_storage)
        errors = []
        created = 0
        required = {"username", "email", "password_hash", "matricule", "nom", "prenom"}

        for idx, row in enumerate(rows, start=2):
            if not required.issubset(set(row.keys())):
                errors.append(f"Ligne {idx}: colonnes manquantes")
                continue
            try:
                user = Utilisateur(
                    username=row["username"],
                    email=row["email"],
                    password_hash=row["password_hash"],
                    role="enseignant",
                )
                db.session.add(user)
                db.session.flush()

                teacher = Enseignant(
                    utilisateur_id=user.id,
                    matricule=row["matricule"],
                    nom=row["nom"],
                    prenom=row["prenom"],
                    specialite=row.get("specialite"),
                )
                db.session.add(teacher)
                created += 1
            except Exception as exc:
                db.session.rollback()
                errors.append(f"Ligne {idx}: {exc}")

        if created:
            db.session.commit()

        return {"created": created, "errors": errors}

    @staticmethod
    def import_grades(file_storage) -> dict:
        rows = CsvImportService._read_csv(file_storage)
        errors = []
        created = 0
        required = {"etudiant_id", "matiere_id", "enseignant_id", "valeur"}

        for idx, row in enumerate(rows, start=2):
            if not required.issubset(set(row.keys())):
                errors.append(f"Ligne {idx}: colonnes manquantes")
                continue
            try:
                value = float(row["valeur"])
                if value < 0 or value > 20:
                    raise ValueError("note invalide")
                note = Note(
                    etudiant_id=int(row["etudiant_id"]),
                    matiere_id=int(row["matiere_id"]),
                    enseignant_id=int(row["enseignant_id"]),
                    valeur=value,
                    type_evaluation=row.get("type_evaluation", "controle"),
                )
                db.session.add(note)
                created += 1
            except Exception as exc:
                db.session.rollback()
                errors.append(f"Ligne {idx}: {exc}")

        if created:
            db.session.commit()

        return {"created": created, "errors": errors}
