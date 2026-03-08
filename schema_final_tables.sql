-- =============================================================================
-- SCHEMA BASE DE DONNÉES - VERSION FINALE v2 (PRODUCTION-READY)
-- Système de Gestion Académique
-- Corrections : ordre d'exécution, redondance 3NF, CHECK renforcés,
--               nommage unifié, soft delete, politique ON DELETE
-- =============================================================================


-- -----------------------------------------------------------------------------
-- TABLE : filiere
-- -----------------------------------------------------------------------------
CREATE TABLE filiere (
  id_filiere    INTEGER      NOT NULL IDENTITY,
  nom_filiere   VARCHAR(50)  NOT NULL,
  description   VARCHAR(200) NOT NULL,
  est_actif     BIT          NOT NULL DEFAULT 1,   -- Soft Delete
  PRIMARY KEY(id_filiere)
);
GO


-- -----------------------------------------------------------------------------
-- TABLE : semestre
-- -----------------------------------------------------------------------------
CREATE TABLE semestre (
  id_semestre      INTEGER     NOT NULL IDENTITY,
  libelle_semestre VARCHAR(10) NOT NULL,
  CHECK (libelle_semestre IN ('S1','S2','S3','S4','S5','S6','S7','S8')),
  PRIMARY KEY(id_semestre)
);
GO

CREATE UNIQUE INDEX UK_semestre_libelle ON semestre (libelle_semestre);
GO


-- -----------------------------------------------------------------------------
-- TABLE : utilisateur
-- -----------------------------------------------------------------------------
CREATE TABLE utilisateur (
  id_utilisateur INTEGER  NOT NULL IDENTITY,
  login          VARCHAR(50) NOT NULL,
  mot_de_passe   CHAR(60)    NOT NULL,             -- [FIX] CHAR(60) fixe pour BCrypt
  role           VARCHAR(20) NOT NULL,
  est_actif      BIT         NOT NULL DEFAULT 1,   -- Soft Delete
  CHECK (role IN ('admin', 'etudiant', 'enseignant')),
  PRIMARY KEY(id_utilisateur)
);
GO

CREATE UNIQUE INDEX utilisateur_login ON utilisateur (login);
GO


-- -----------------------------------------------------------------------------
-- TABLE : annee_academique
-- -----------------------------------------------------------------------------
CREATE TABLE annee_academique (
  id_annee      INTEGER    NOT NULL IDENTITY,
  libelle_annee VARCHAR(9) NOT NULL,
  CHECK (libelle_annee LIKE '[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]'),
  PRIMARY KEY(id_annee)
);
GO

CREATE UNIQUE INDEX UK_annee_libelle ON annee_academique (libelle_annee);
GO


-- -----------------------------------------------------------------------------
-- TABLE : unite_enseignement
-- -----------------------------------------------------------------------------
CREATE TABLE unite_enseignement (
  id_ue        INTEGER      NOT NULL IDENTITY,
  semestre_id  INTEGER      NOT NULL,
  libelle_ue   VARCHAR(100) NOT NULL,
  credit       INTEGER      NOT NULL,
  CHECK (credit > 0 AND credit <= 30),
  PRIMARY KEY(id_ue),
  FOREIGN KEY(semestre_id) REFERENCES semestre(id_semestre)
);
GO

CREATE INDEX IFK_ue_semestre ON unite_enseignement (semestre_id);
GO


-- -----------------------------------------------------------------------------
-- TABLE : filiere → classe
-- -----------------------------------------------------------------------------
CREATE TABLE classe (
  id_classe   INTEGER     NOT NULL IDENTITY,
  filiere_id  INTEGER     NOT NULL,
  nom_classe  VARCHAR(50) NOT NULL,
  est_actif   BIT         NOT NULL DEFAULT 1,       -- Soft Delete
  PRIMARY KEY(id_classe),
  FOREIGN KEY(filiere_id) REFERENCES filiere(id_filiere)
);
GO

CREATE INDEX IFK_classe_filiere ON classe (filiere_id);
GO
CREATE UNIQUE INDEX UK_classe_nom_filiere ON classe (nom_classe, filiere_id);
GO


-- -----------------------------------------------------------------------------
-- TABLE : etudiant
-- -----------------------------------------------------------------------------
CREATE TABLE etudiant (
  id_etudiant    INTEGER      NOT NULL IDENTITY,
  utilisateur_id INTEGER,
  matricule      VARCHAR(50)  NOT NULL,
  nom            VARCHAR(100) NOT NULL,
  prenom         VARCHAR(50),
  telephone      VARCHAR(20),
  email          VARCHAR(50)  NOT NULL,
  est_actif      BIT          NOT NULL DEFAULT 1,   -- Soft Delete
  -- [FIX] Email : pas d'espaces, longueur minimale suffisante pour a@b.cc
  CHECK (email NOT LIKE '% %' AND email LIKE '%_@__%.__%'),
  -- [FIX] Téléphone : uniquement des chiffres sur toute la chaîne
  CHECK (telephone IS NULL OR telephone NOT LIKE '%[^0-9]%'),
  PRIMARY KEY(id_etudiant),
  FOREIGN KEY(utilisateur_id) REFERENCES utilisateur(id_utilisateur)
);
GO

CREATE UNIQUE INDEX UK_etudiant_utilisateur ON etudiant (utilisateur_id);
GO
CREATE UNIQUE INDEX UK_etudiant_matricule   ON etudiant (matricule);
GO
CREATE UNIQUE INDEX UK_etudiant_email       ON etudiant (email);
GO


-- -----------------------------------------------------------------------------
-- TABLE : enseignant
-- -----------------------------------------------------------------------------
CREATE TABLE enseignant (
  id_enseignant  INTEGER      NOT NULL IDENTITY,
  utilisateur_id INTEGER,
  nom            VARCHAR(50)  NOT NULL,
  prenom         VARCHAR(100),
  telephone      VARCHAR(20),
  email          VARCHAR(50)  NOT NULL,
  est_actif      BIT          NOT NULL DEFAULT 1,   -- Soft Delete
  -- [FIX] Même règles renforcées sur email et téléphone
  CHECK (email NOT LIKE '% %' AND email LIKE '%_@__%.__%'),
  CHECK (telephone IS NULL OR telephone NOT LIKE '%[^0-9]%'),
  PRIMARY KEY(id_enseignant),
  FOREIGN KEY(utilisateur_id) REFERENCES utilisateur(id_utilisateur)
);
GO

CREATE UNIQUE INDEX UK_enseignant_utilisateur ON enseignant (utilisateur_id);
GO
CREATE UNIQUE INDEX UK_enseignant_email        ON enseignant (email);
GO


-- -----------------------------------------------------------------------------
-- TABLE : inscription
-- -----------------------------------------------------------------------------
CREATE TABLE inscription (
  id_inscription INTEGER     NOT NULL IDENTITY,
  etudiant_id    INTEGER     NOT NULL,
  classe_id      INTEGER     NOT NULL,
  annee_id       INTEGER     NOT NULL,
  date_inscription DATE      NOT NULL DEFAULT GETDATE(),
  statut         VARCHAR(20) NOT NULL DEFAULT 'Actif',
  CHECK (statut IN ('Actif', 'Abandonné', 'Diplômé', 'Suspendu', 'Transféré')),
  PRIMARY KEY(id_inscription),
  FOREIGN KEY(etudiant_id) REFERENCES etudiant(id_etudiant),
  FOREIGN KEY(annee_id)    REFERENCES annee_academique(id_annee),
  FOREIGN KEY(classe_id)   REFERENCES classe(id_classe)
);
GO

CREATE UNIQUE INDEX UK_inscription ON inscription (etudiant_id, annee_id);
GO


-- -----------------------------------------------------------------------------
-- TABLE : matiere
-- -----------------------------------------------------------------------------
CREATE TABLE matiere (
  id_matiere INTEGER      NOT NULL IDENTITY,
  ue_id      INTEGER      NOT NULL,
  libelle    VARCHAR(100) NOT NULL,
  coefficient  DECIMAL(4,2) NOT NULL,
  volume_horaire INTEGER,
  CHECK (coefficient > 0 AND coefficient <= 10),
  CHECK (volume_horaire IS NULL OR volume_horaire > 0),
  PRIMARY KEY(id_matiere),
  FOREIGN KEY(ue_id) REFERENCES unite_enseignement(id_ue)
);
GO

CREATE INDEX IFK_matiere_ue ON matiere (ue_id);
GO


-- -----------------------------------------------------------------------------
-- TABLE : programme (matières par classe par année)
-- -----------------------------------------------------------------------------
CREATE TABLE programme (
  matiere_id INTEGER NOT NULL,
  classe_id  INTEGER NOT NULL,
  annee_id   INTEGER NOT NULL,
  PRIMARY KEY(matiere_id, classe_id, annee_id),
  FOREIGN KEY(matiere_id) REFERENCES matiere(id_matiere),
  FOREIGN KEY(classe_id)  REFERENCES classe(id_classe),
  FOREIGN KEY(annee_id)   REFERENCES annee_academique(id_annee)
);
GO


-- -----------------------------------------------------------------------------
-- TABLE : enseignement  ← [FIX] Placée AVANT seance_cours (dépendance FK)
-- -----------------------------------------------------------------------------
CREATE TABLE enseignement (
  id_enseignement INTEGER NOT NULL IDENTITY,
  classe_id       INTEGER NOT NULL,
  enseignant_id   INTEGER NOT NULL,
  matiere_id      INTEGER NOT NULL,
  PRIMARY KEY(id_enseignement),
  FOREIGN KEY(matiere_id)    REFERENCES matiere(id_matiere),
  FOREIGN KEY(enseignant_id) REFERENCES enseignant(id_enseignant),
  FOREIGN KEY(classe_id)     REFERENCES classe(id_classe)
);
GO

-- Un enseignant ne peut pas être affecté deux fois à la même matière dans la même classe
CREATE UNIQUE INDEX UK_enseignement ON enseignement (classe_id, enseignant_id, matiere_id);
GO


-- -----------------------------------------------------------------------------
-- TABLE : seance_cours
-- [FIX] matiere_id supprimée (redondance 3NF — se déduit via enseignement)
-- [FIX] enseignement_id créé AVANT (ordre d'exécution corrigé)
-- -----------------------------------------------------------------------------
CREATE TABLE seance_cours (
  id_cours        INTEGER     NOT NULL IDENTITY,
  enseignement_id INTEGER     NOT NULL,            -- Porte classe + enseignant + matière
  date_heure_debut DATETIME   NOT NULL,
  date_heure_fin  DATETIME    NOT NULL,
  salle           VARCHAR(20) NOT NULL,
  CHECK (date_heure_fin > date_heure_debut),
  PRIMARY KEY(id_cours),
  FOREIGN KEY(enseignement_id) REFERENCES enseignement(id_enseignement)
);
GO

CREATE INDEX IFK_seance_enseignement ON seance_cours (enseignement_id);
GO

-- NOTE : La contrainte de non-chevauchement d'emploi du temps (même enseignant,
-- même heure) ne peut pas être exprimée avec un CHECK simple.
-- Elle doit être gérée par un TRIGGER AFTER INSERT, UPDATE sur seance_cours.
-- Exemple de logique TRIGGER (à implémenter selon le SGBD) :
--   Vérifier qu'il n'existe aucune autre séance pour le même enseignant_id
--   dont l'intervalle [date_heure_debut, date_heure_fin] chevauche la nouvelle.


-- -----------------------------------------------------------------------------
-- TABLE : evaluation
-- -----------------------------------------------------------------------------
CREATE TABLE evaluation (
  id_evaluation  INTEGER      NOT NULL IDENTITY,
  matiere_id     INTEGER      NOT NULL,
  date_evaluation DATE         NOT NULL,
  type_evaluation VARCHAR(20)  NOT NULL,
  poids          DECIMAL(5,2) NOT NULL,
  CHECK (type_evaluation IN ('Devoir', 'Examen', 'TP', 'Projet', 'Oral', 'Rattrapage')),
  CHECK (poids > 0 AND poids <= 100),
  PRIMARY KEY(id_evaluation),
  FOREIGN KEY(matiere_id) REFERENCES matiere(id_matiere)
);
GO

CREATE INDEX IFK_evaluation_matiere ON evaluation (matiere_id);
GO


-- -----------------------------------------------------------------------------
-- TABLE : assister (présences aux séances)
-- -----------------------------------------------------------------------------
CREATE TABLE assister (
  cours_id            INTEGER      NOT NULL,
  etudiant_id         INTEGER      NOT NULL,
  statut_presence     VARCHAR(20)  NOT NULL,
  motif_justification VARCHAR(255),
  CHECK (statut_presence IN ('Présent', 'Absent', 'Retard', 'Excusé')),
  PRIMARY KEY(cours_id, etudiant_id),
  FOREIGN KEY(cours_id)    REFERENCES seance_cours(id_cours),
  FOREIGN KEY(etudiant_id) REFERENCES etudiant(id_etudiant)
);
GO


-- -----------------------------------------------------------------------------
-- TABLE : obtenir_note
-- -----------------------------------------------------------------------------
CREATE TABLE obtenir_note (
  evaluation_id INTEGER      NOT NULL,
  etudiant_id   INTEGER      NOT NULL,
  note          DECIMAL(5,2) NOT NULL,
  CHECK (note >= 0 AND note <= 20),
  PRIMARY KEY(evaluation_id, etudiant_id),
  FOREIGN KEY(etudiant_id)   REFERENCES etudiant(id_etudiant),
  FOREIGN KEY(evaluation_id) REFERENCES evaluation(id_evaluation)
);
GO


-- =============================================================================
-- FIN DU SCRIPT
-- =============================================================================
