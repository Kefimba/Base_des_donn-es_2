import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AcademicPage from "./pages/AcademicPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CsvImportPage from "./pages/CsvImportPage";
import GradesPage from "./pages/GradesPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import StudentGradesPage from "./pages/StudentGradesPage";
import StudentsPage from "./pages/StudentsPage";
import TeacherClassesPage from "./pages/TeacherClassesPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import TeacherGradesPage from "./pages/TeacherGradesPage";
import TeachersPage from "./pages/TeachersPage";
import TimetablePage from "./pages/TimetablePage";
import TrashPage from "./pages/TrashPage";
import { useAuth } from "./context/AuthContext";
import { roleToDefaultRoute } from "./utils/roles";

function RoleRedirect() {
  const { user } = useAuth();
  return <Navigate to={roleToDefaultRoute[user?.role] || "/login"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["admin", "enseignant", "etudiant"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<RoleRedirect />} />

        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute allowedRoles={["admin"]}><StudentsPage /></ProtectedRoute>} />
        <Route path="/admin/teachers" element={<ProtectedRoute allowedRoles={["admin"]}><TeachersPage /></ProtectedRoute>} />
        <Route path="/admin/grades" element={<ProtectedRoute allowedRoles={["admin"]}><GradesPage /></ProtectedRoute>} />
        <Route path="/admin/academic" element={<ProtectedRoute allowedRoles={["admin"]}><AcademicPage /></ProtectedRoute>} />
        <Route path="/admin/timetable" element={<ProtectedRoute allowedRoles={["admin"]}><TimetablePage /></ProtectedRoute>} />
        <Route path="/admin/import" element={<ProtectedRoute allowedRoles={["admin"]}><CsvImportPage /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["admin"]}><ReportsPage /></ProtectedRoute>} />
        <Route path="/admin/trash" element={<ProtectedRoute allowedRoles={["admin"]}><TrashPage /></ProtectedRoute>} />

        <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={["enseignant"]}><TeacherDashboardPage /></ProtectedRoute>} />
        <Route path="/teacher/classes" element={<ProtectedRoute allowedRoles={["enseignant"]}><TeacherClassesPage /></ProtectedRoute>} />
        <Route path="/teacher/students" element={<ProtectedRoute allowedRoles={["enseignant"]}><StudentsPage /></ProtectedRoute>} />
        <Route path="/teacher/grades" element={<ProtectedRoute allowedRoles={["enseignant"]}><TeacherGradesPage /></ProtectedRoute>} />
        <Route path="/teacher/timetable" element={<ProtectedRoute allowedRoles={["enseignant"]}><TimetablePage /></ProtectedRoute>} />

        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={["etudiant"]}><StudentDashboardPage /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={["etudiant"]}><ProfilePage /></ProtectedRoute>} />
        <Route path="/student/grades" element={<ProtectedRoute allowedRoles={["etudiant"]}><StudentGradesPage /></ProtectedRoute>} />
        <Route path="/student/reports" element={<ProtectedRoute allowedRoles={["etudiant"]}><ReportsPage /></ProtectedRoute>} />
        <Route path="/student/timetable" element={<ProtectedRoute allowedRoles={["etudiant"]}><TimetablePage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
