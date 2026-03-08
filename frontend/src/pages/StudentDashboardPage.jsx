import { Grid, Typography } from "@mui/material";

import StatCard from "../components/StatCard";

export default function StudentDashboardPage() {
  return (
    <>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Dashboard Etudiant
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}><StatCard title="Moyenne generale" value="14.2" /></Grid>
        <Grid item xs={12} md={4}><StatCard title="Mention" value="Bien" /></Grid>
        <Grid item xs={12} md={4}><StatCard title="Absences" value="2" /></Grid>
      </Grid>
    </>
  );
}
