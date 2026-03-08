import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Container sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Box textAlign="center">
        <Typography variant="h2" fontWeight={800}>404</Typography>
        <Typography sx={{ mb: 3 }}>Page introuvable</Typography>
        <Button component={Link} to="/login" variant="contained">Retour</Button>
      </Box>
    </Container>
  );
}
