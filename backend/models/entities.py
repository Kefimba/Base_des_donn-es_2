from __future__ import annotations

from database.db import db


class Matiere(db.Model):
    __tablename__ = "Matiere"

    id_matiere = db.Column(db.Integer, primary_key=True)
    libelle_matiere = db.Column(db.String(100), nullable=True)


class Classe(db.Model):
    __tablename__ = "Classe"

    id_classe = db.Column(db.Integer, primary_key=True)
    nom_classe = db.Column(db.String(50), nullable=False)


class Etudiant(db.Model):
    __tablename__ = "Etudiant"

    matricule = db.Column(db.Integer, primary_key=True)
    Classe_id_classe = db.Column(db.Integer, db.ForeignKey("Classe.id_classe"), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    nom = db.Column(db.String(50), nullable=False)

    classe = db.relationship("Classe", backref=db.backref("etudiants", lazy=True))


class Note(db.Model):
    __tablename__ = "Notes"

    Matiere_id_matiere = db.Column(db.Integer, db.ForeignKey("Matiere.id_matiere"), primary_key=True)
    Etudiant_matricule = db.Column(db.Integer, db.ForeignKey("Etudiant.matricule"), primary_key=True)
    note = db.Column(db.Integer, nullable=True)

    matiere = db.relationship("Matiere", backref=db.backref("notes", lazy=True))
    etudiant = db.relationship("Etudiant", backref=db.backref("notes", lazy=True))


class ClasseMatiere(db.Model):
    __tablename__ = "ClasseMatiere"

    Matiere_id_matiere = db.Column(db.Integer, db.ForeignKey("Matiere.id_matiere"), primary_key=True)
    Classe_id_classe = db.Column(db.Integer, db.ForeignKey("Classe.id_classe"), primary_key=True)

    matiere = db.relationship("Matiere", backref=db.backref("classes_assoc", lazy=True))
    classe = db.relationship("Classe", backref=db.backref("matieres_assoc", lazy=True))


class Utilisateur(db.Model):
    __tablename__ = "Utilisateur"

    username = db.Column(db.String(50), primary_key=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)


class Enseignant(db.Model):
    __tablename__ = "Enseignant"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    matricule = db.Column(db.Integer, nullable=False, unique=True)
    nom = db.Column(db.String(50), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    specialite = db.Column(db.String(100), nullable=True)

    utilisateur = db.relationship("Utilisateur", backref=db.backref("enseignant", uselist=False))


class EmploiTemps(db.Model):
    __tablename__ = "EmploiTemps"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    classe_id = db.Column(db.Integer, db.ForeignKey("Classe.id_classe"), nullable=False)
    matiere_id = db.Column(db.Integer, db.ForeignKey("Matiere.id_matiere"), nullable=False)
    enseignant_id = db.Column(db.Integer, db.ForeignKey("Enseignant.id"), nullable=False)
    jour = db.Column(db.String(10), nullable=False)  # e.g., "Lundi"
    heure_debut = db.Column(db.Time, nullable=False)
    heure_fin = db.Column(db.Time, nullable=False)
    salle = db.Column(db.String(50), nullable=True)

    classe = db.relationship("Classe", backref=db.backref("emplois", lazy=True))
    matiere = db.relationship("Matiere", backref=db.backref("emplois", lazy=True))
    enseignant = db.relationship("Enseignant", backref=db.backref("emplois", lazy=True))
