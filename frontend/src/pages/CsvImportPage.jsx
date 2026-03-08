import { Alert, Button, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { csvService } from "../services/csvService";

function UploadBlock({ title, onUpload }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!file) return;
    const res = await onUpload(file);
    setMessage(`Import termine: ${res.created} lignes, ${res.errors.length} erreurs`);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <Button variant="contained" onClick={submit}>Importer</Button>
      </Stack>
      {message && <Alert sx={{ mt: 2 }}>{message}</Alert>}
    </Paper>
  );
}

export default function CsvImportPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>Import CSV</Typography>
      <UploadBlock title="Import etudiants" onUpload={csvService.importStudents} />
      <UploadBlock title="Import enseignants" onUpload={csvService.importTeachers} />
      <UploadBlock title="Import notes" onUpload={csvService.importGrades} />
    </Stack>
  );
}
