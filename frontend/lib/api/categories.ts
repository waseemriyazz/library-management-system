import apiClient from '../api-client';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../types';

export async function fetchCategories(search?: string): Promise<Category[]> {
  const params = search ? { search } : {};
  const response = await apiClient.get<Category[]>('/categories', { params });
  return response.data;
}

export async function fetchCategory(id: number): Promise<Category> {
  const response = await apiClient.get<Category>(`/categories/${id}`);
  return response.data;
}

export async function createCategory(data: CreateCategoryDto): Promise<Category> {
  const response = await apiClient.post<Category>('/categories', data);
  return response.data;
}

export async function updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
  const response = await apiClient.patch<Category>(`/categories/${id}`, data);
  return response.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}