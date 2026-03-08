import api from "./api";

const normalizeAuthPayload = (data) => {
  if (!data) return data;
  if (!data.token && data.access_token) {
    return { ...data, token: data.access_token };
  }
  return data;
};

export const authService = {
  login: async (payload) => {
    try {
      const data = (await api.post("/login", payload)).data;
      return normalizeAuthPayload(data);
    } catch (firstError) {
      const status = firstError?.response?.status;
      if (status === 404 || status === 405) {
        const data = (await api.post("/auth/login", payload)).data;
        return normalizeAuthPayload(data);
      }
      throw firstError;
    }
  },
  register: async (payload) => (await api.post("/register", payload)).data,
};
