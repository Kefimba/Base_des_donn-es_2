import api from "./api";

export const reportService = {
  downloadStudentReport: async (studentId) => {
    const response = await api.get(`/report/student/${studentId}`, { responseType: "blob" });
    return response.data;
  },
};
