import DashboardIcon from "@mui/icons-material/Dashboard";
import GradeIcon from "@mui/icons-material/Grade";
import GroupIcon from "@mui/icons-material/Group";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ScheduleIcon from "@mui/icons-material/Schedule";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const drawerWidth = 260;

const navByRole = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
    { label: "Etudiants", path: "/admin/students", icon: <GroupIcon /> },
    { label: "Enseignants", path: "/admin/teachers", icon: <PersonIcon /> },
    { label: "Notes", path: "/admin/grades", icon: <GradeIcon /> },
    { label: "Academique", path: "/admin/academic", icon: <MenuBookIcon /> },
    { label: "Emploi du temps", path: "/admin/timetable", icon: <ScheduleIcon /> },
    { label: "Import CSV", path: "/admin/import", icon: <UploadFileIcon /> },
    { label: "Bulletins", path: "/admin/reports", icon: <PictureAsPdfIcon /> },
    { label: "Corbeille", path: "/admin/trash", icon: <RestoreFromTrashIcon /> },
  ],
  enseignant: [
    { label: "Dashboard", path: "/teacher/dashboard", icon: <DashboardIcon /> },
    { label: "Mes classes", path: "/teacher/classes", icon: <HomeWorkIcon /> },
    { label: "Mes etudiants", path: "/teacher/students", icon: <GroupIcon /> },
    { label: "Saisie notes", path: "/teacher/grades", icon: <GradeIcon /> },
    { label: "Planning", path: "/teacher/timetable", icon: <ScheduleIcon /> },
  ],
  etudiant: [
    { label: "Dashboard", path: "/student/dashboard", icon: <DashboardIcon /> },
    { label: "Profil", path: "/student/profile", icon: <PersonIcon /> },
    { label: "Mes notes", path: "/student/grades", icon: <GradeIcon /> },
    { label: "Bulletins", path: "/student/reports", icon: <PictureAsPdfIcon /> },
    { label: "Emploi du temps", path: "/student/timetable", icon: <ScheduleIcon /> },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);

  const items = useMemo(() => navByRole[user?.role] || [], [user?.role]);

  const sidebar = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Ecole Ingenieur
      </Typography>
      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={() => setOpen(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <ListItemButton onClick={logout} sx={{ mt: 2 }}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Se deconnecter" />
      </ListItemButton>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          ...(isMobile
            ? {}
            : {
                width: `calc(100% - ${drawerWidth}px)`,
                ml: `${drawerWidth}px`,
              }),
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Portail Scolaire
          </Typography>
          <Typography variant="body2">{user?.username} ({user?.role})</Typography>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" } }}
        >
          <Box sx={{ width: drawerWidth }}>{sidebar}</Box>
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              mt: "64px",
              height: "calc(100% - 64px)",
            },
          }}
        >
          {sidebar}
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, mt: "64px", minWidth: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
