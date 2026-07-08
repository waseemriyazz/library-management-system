import apiClient from '../api-client';
import { Book, CreateBookDto, UpdateBookDto } from '../types';

export async function fetchBooks(search?: string): Promise<Book[]> {
  const params = search ? { search } : {};
  const response = await apiClient.get<Book[]>('/books', { params });
  return response.data;
}

export async function fetchBook(id: number): Promise<Book> {
  const response = await apiClient.get<Book>(`/books/${id}`);
  return response.data;
}

export async function createBook(data: CreateBookDto): Promise<Book> {
  const response = await apiClient.post<Book>('/books', data);
  return response.data;
}

export async function updateBook(id: number, data: UpdateBookDto): Promise<Book> {
  const response = await apiClient.patch<Book>(`/books/${id}`, data);
  return response.data;
}

export async function deleteBook(id: number): Promise<void> {
  await apiClient.delete(`/books/${id}`);
}