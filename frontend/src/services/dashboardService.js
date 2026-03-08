import api from "./api";

export const dashboardService = {
  adminStats: async () => (await api.get("/dashboard/admin")).data,
};
