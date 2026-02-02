import axios from "axios";

const API_URL = "https://friendzone-app.azurewebsites.net/api";

interface City {
  id: number;
  name: string;
}

export const cityService = {
  getAllCities: async (): Promise<City[]> => {
    const response = await axios.get<City[]>(`${API_URL}/cities`);
    return response.data;
  },
};
