// src/services/categoryService.ts
import { api } from "./api";

export interface Category {
  id: number;
  name: string;
  displayName: string;
  iconUrl: string;
}

class CategoryService {
  /**
   * GET /api/categories - Hämta alla aktiva kategorier
   */
  async getAllCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>("/api/categories");
    return response.data;
  }

  /**
   * GET /api/categories/{id} - Hämta specifik kategori
   */
  async getCategoryById(id: number): Promise<Category> {
    const response = await api.get<Category>(`/api/categories/${id}`);
    return response.data;
  }
}

export default new CategoryService();
