import {
  Alert,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { gradeService } from "../services/gradeService";

export default function GradesPage() {
  const { user } = useAuth();
  const isTeacher = user?.role === "enseignant";
  const [form, setForm] = useState({ etudiant_id: "", evaluation_id: "", note: "" });
  const [studentId, setStudentId] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);

  const loadReferences = async () => {
    try {
      const data = await gradeService.references();
      setStudents(data.students || []);
      setEvaluations(data.evaluations || []);
    } catch (err) {
      setMessage("Erreur chargement references: " + (err?.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    loadReferences();
  }, []);

  const submit = async () => {
    setSubmitting(true);
    try {
      await gradeService.create({ ...form, note: Number(form.note) });
      setMessage("Note enregistree");
      setForm({ etudiant_id: "", evaluation_id: "", note: "" });
      if (studentId) {
        const data = await gradeService.byStudent(studentId);
        setResult(data);
      }
    } catch (err) {
      setMessage("Erreur lors de l'enregistrement: " + (err?.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const fetchByStudent = async () => {
    if (!studentId) return;
    setFetching(true);
    try {
      const data = await gradeService.byStudent(studentId);
      setResult(data);
    } catch (err) {
      setMessage("Erreur lors du chargement: " + (err?.response?.data?.message || err.message));
    } finally {
      setFetching(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>Gestion des notes</Typography>
      {message && <Alert severity={message.toLowerCase().includes("erreur") ? "error" : "success"}>{message}</Alert>}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {isTeacher ? "Saisie note (ajout uniquement)" : "Saisie / mise a jour note (table obtenir_note)"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Etudiant</InputLabel>
              <Select
                value={form.etudiant_id}
                label="Etudiant"
                onChange={(e) => setForm({ ...form, etudiant_id: e.target.value })}
              >
                {students.map((stu) => (
                  <MenuItem key={stu.id_etudiant} value={stu.id_etudiant}>
                    {stu.nom} {stu.prenom} ({stu.matricule})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Evaluation</InputLabel>
              <Select
                value={form.evaluation_id}
                label="Evaluation"
                onChange={(e) => setForm({ ...form, evaluation_id: e.target.value })}
              >
                {evaluations.map((ev) => (
                  <MenuItem key={ev.id_evaluation} value={ev.id_evaluation}>
                    {ev.libelle_matiere} - {ev.type_evaluation} ({String(ev.date_evaluation).slice(0, 10)})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Note"
              type="number"
              inputProps={{ min: 0, max: 20, step: 0.5 }}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </Grid>
        </Grid>
        <Button sx={{ mt: 2 }} variant="contained" onClick={submit} disabled={submitting}>
          {submitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Consulter notes par etudiant</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <FormControl sx={{ minWidth: 320 }}>
            <InputLabel>Etudiant</InputLabel>
            <Select label="Etudiant" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
              {students.map((stu) => (
                <MenuItem key={stu.id_etudiant} value={stu.id_etudiant}>
                  {stu.nom} {stu.prenom} ({stu.matricule})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={fetchByStudent} disabled={fetching}>
            {fetching ? "Chargement..." : "Charger"}
          </Button>
        </Stack>

        {result && (
          <>
            <Typography sx={{ mb: 1 }}>
              Moyenne (ponderee): {result.moyenne} | Mention: {result.mention} | Somme coeffs: {result.total_coefficients}
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Evaluation ID</TableCell>
                  <TableCell>Matiere</TableCell>
                  <TableCell>Coefficient</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.grades.map((g) => (
                  <TableRow key={`${g.evaluation_id}-${g.etudiant_id}`}>
                    <TableCell>{g.evaluation_id}</TableCell>
                    <TableCell>{g.matiere}</TableCell>
                    <TableCell>{g.coefficient}</TableCell>
                    <TableCell>{g.type_evaluation}</TableCell>
                    <TableCell>{String(g.date_evaluation).slice(0, 10)}</TableCell>
                    <TableCell>{g.valeur}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </Paper>
    </Stack>
  );
}

