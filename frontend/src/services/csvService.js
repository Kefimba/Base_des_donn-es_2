import api from "./api";

export const csvService = {
  importStudents: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return (await api.post("/import/students", formData)).data;
  },
  importTeachers: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return (await api.post("/import/teachers", formData)).data;
  },
  importGrades: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return (await api.post("/import/grades", formData)).data;
  },
};
