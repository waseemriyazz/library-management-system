export interface Book {
  id: number;
  title: string;
  isbn: string;
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  available: boolean;
  authorId: number;
  categoryId: number;
  author?: { id: number; name: string };
  category?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookDto {
  title: string;
  isbn: string;
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  available?: boolean;
  authorId: number;
  categoryId: number;
}

export interface UpdateBookDto {
  title?: string;
  isbn?: string;
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  available?: boolean;
  authorId?: number;
  categoryId?: number;
}