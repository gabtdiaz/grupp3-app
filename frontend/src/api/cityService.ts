import { api } from "./api";

interface City {
  id: number;
  name: string;
}

export const cityService = {
  /**
   * GET /api/cities - Hämta alla städer
   */
  getAllCities: async (): Promise<City[]> => {
    const response = await api.get<City[]>("/api/cities");
    return response.data;
  },
};
