import apiClient from '../api-client';
import { Author, CreateAuthorDto, UpdateAuthorDto } from '../types';

export async function fetchAuthors(search?: string): Promise<Author[]> {
  const params = search ? { search } : {};
  const response = await apiClient.get<Author[]>('/authors', { params });
  return response.data;
}

export async function fetchAuthor(id: number): Promise<Author> {
  const response = await apiClient.get<Author>(`/authors/${id}`);
  return response.data;
}

export async function createAuthor(data: CreateAuthorDto): Promise<Author> {
  const response = await apiClient.post<Author>('/authors', data);
  return response.data;
}

export async function updateAuthor(id: number, data: UpdateAuthorDto): Promise<Author> {
  const response = await apiClient.patch<Author>(`/authors/${id}`, data);
  return response.data;
}

export async function deleteAuthor(id: number): Promise<void> {
  await apiClient.delete(`/authors/${id}`);
}