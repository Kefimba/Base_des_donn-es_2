CREATE TABLE Matiere (
  id_matiere INTEGER   NOT NULL ,
  libelle_matiere CHAR(100)      ,
PRIMARY KEY(id_matiere));



CREATE TABLE Classe (
  id_classe INTEGER   NOT NULL ,
  nom_classe CHAR(50)   NOT NULL   ,
PRIMARY KEY(id_classe));



CREATE TABLE Etudiant (
  matricule INTEGER   NOT NULL ,
  Classe_id_classe INTEGER   NOT NULL ,
  prenom CHAR(100)   NOT NULL ,
  nom CHAR(50)   NOT NULL   ,
PRIMARY KEY(matricule)  ,
  FOREIGN KEY(Classe_id_classe)
    REFERENCES Classe(id_classe));


CREATE INDEX Etudiant_FKIndex1 ON Etudiant (Classe_id_classe);


CREATE INDEX IFK_Rel_02 ON Etudiant (Classe_id_classe);


CREATE TABLE Notes (
  Matiere_id_matiere INTEGER   NOT NULL ,
  Etudiant_matricule INTEGER   NOT NULL ,
  note INTEGER        ,
  FOREIGN KEY(Etudiant_matricule)
    REFERENCES Etudiant(matricule),
  FOREIGN KEY(Matiere_id_matiere)
    REFERENCES Matiere(id_matiere));


CREATE INDEX Notes_FKIndex1 ON Notes (Etudiant_matricule);
CREATE INDEX Notes_FKIndex2 ON Notes (Matiere_id_matiere);


CREATE INDEX IFK_Rel_06 ON Notes (Etudiant_matricule);
CREATE INDEX IFK_Rel_07 ON Notes (Matiere_id_matiere);


CREATE TABLE ClasseMatiere (
  Matiere_id_matiere INTEGER   NOT NULL ,
  Classe_id_classe INTEGER   NOT NULL   ,
PRIMARY KEY(Matiere_id_matiere, Classe_id_classe)    ,
  FOREIGN KEY(Matiere_id_matiere)
    REFERENCES Matiere(id_matiere),
  FOREIGN KEY(Classe_id_classe)
    REFERENCES Classe(id_classe));


CREATE INDEX Matiere_has_Classe_FKIndex1 ON ClasseMatiere (Matiere_id_matiere);
CREATE INDEX Matiere_has_Classe_FKIndex2 ON ClasseMatiere (Classe_id_classe);


CREATE INDEX IFK_Rel_03 ON ClasseMatiere (Matiere_id_matiere);
CREATE INDEX IFK_Rel_04 ON ClasseMatiere (Classe_id_classe);
