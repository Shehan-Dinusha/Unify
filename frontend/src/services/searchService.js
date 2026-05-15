import api from "./api";

export const searchProfiles = async (q) => {
  const response = await api.get("/search/profiles", { params: { q } });
  return response.data;
};
