import api from "./api";

export const studentService = {
  getAll: async ({ page = 1, perPage = 10, search = "", status = "actif" } = {}) =>
    (await api.get("/students", { params: { page, per_page: perPage, search, status } })).data,
  create: async (payload) => (await api.post("/students", payload)).data,
  update: async (id, payload) => (await api.put(`/students/${id}`, payload)).data,
  remove: async (id) => (await api.delete(`/students/${id}`)).data,
  restore: async (id) => (await api.patch(`/students/${id}/restore`)).data,
};
