import { useState, useEffect } from "react";
import { cityService } from "../api/cityService";

interface City {
  id: number;
  name: string;
}

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cityService
      .getAllCities()
      .then(setCities)
      .catch((err) => console.error("Failed to fetch cities:", err))
      .finally(() => setLoading(false));
  }, []);

  return { cities, loading };
}
