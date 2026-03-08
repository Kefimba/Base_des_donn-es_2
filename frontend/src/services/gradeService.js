import api from "./api";

export const gradeService = {
  references: async () => (await api.get("/grades/references")).data,
  create: async (payload) => (await api.post("/grades", payload)).data,
  byStudent: async (studentId) => (await api.get(`/grades/student/${studentId}`)).data,
};
