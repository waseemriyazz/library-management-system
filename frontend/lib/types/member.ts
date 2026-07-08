export interface Member {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  membershipDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberDto {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  membershipDate?: string;
}

export interface UpdateMemberDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  membershipDate?: string;
}