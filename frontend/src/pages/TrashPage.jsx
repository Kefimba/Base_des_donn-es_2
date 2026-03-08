import { Alert, Button, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import api from "../services/api";
import { studentService } from "../services/studentService";

export default function TrashPage() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const studentData = await studentService.getAll({ page: 1, perPage: 200, status: "inactif" });
      setStudents(studentData.items || []);
      const { data: teacherData } = await api.get("/teachers", { params: { status: "inactif" } });
      setTeachers(teacherData || []);
    } catch (err) {
      setMessage("Erreur chargement corbeille: " + (err?.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const restoreStudent = async (id) => {
    try {
      await studentService.restore(id);
      setMessage("Etudiant reactive");
      load();
    } catch (err) {
      setMessage("Erreur reactivation etudiant: " + (err?.response?.data?.message || err.message));
    }
  };

  const restoreTeacher = async (id) => {
    try {
      await api.patch(`/teachers/${id}/restore`);
      setMessage("Enseignant reactive");
      load();
    } catch (err) {
      setMessage("Erreur reactivation enseignant: " + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>Corbeille Admin</Typography>
      {message && <Alert severity={message.toLowerCase().includes("erreur") ? "error" : "success"}>{message}</Alert>}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Etudiants inactifs</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prenom</TableCell>
              <TableCell>Matricule</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((s) => (
              <TableRow key={s.id_etudiant}>
                <TableCell>{s.id_etudiant}</TableCell>
                <TableCell>{s.nom}</TableCell>
                <TableCell>{s.prenom}</TableCell>
                <TableCell>{s.matricule}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => restoreStudent(s.id_etudiant)}>Reactiver</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Enseignants inactifs</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prenom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((t) => (
              <TableRow key={t.id_enseignant}>
                <TableCell>{t.id_enseignant}</TableCell>
                <TableCell>{t.nom}</TableCell>
                <TableCell>{t.prenom}</TableCell>
                <TableCell>{t.email}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => restoreTeacher(t.id_enseignant)}>Reactiver</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
