export interface Author {
  id: number;
  name: string;
  email?: string;
  bio?: string;
  books?: { id: number; title: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuthorDto {
  name: string;
  email?: string;
  bio?: string;
}

export interface UpdateAuthorDto {
  name?: string;
  email?: string;
  bio?: string;
}