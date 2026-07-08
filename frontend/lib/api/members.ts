import apiClient from '../api-client';
import { Member, CreateMemberDto, UpdateMemberDto } from '../types';

export async function fetchMembers(search?: string): Promise<Member[]> {
  const params = search ? { search } : {};
  const response = await apiClient.get<Member[]>('/members', { params });
  return response.data;
}

export async function fetchMember(id: number): Promise<Member> {
  const response = await apiClient.get<Member>(`/members/${id}`);
  return response.data;
}

export async function createMember(data: CreateMemberDto): Promise<Member> {
  const response = await apiClient.post<Member>('/members', data);
  return response.data;
}

export async function updateMember(id: number, data: UpdateMemberDto): Promise<Member> {
  const response = await apiClient.patch<Member>(`/members/${id}`, data);
  return response.data;
}

export async function deleteMember(id: number): Promise<void> {
  await apiClient.delete(`/members/${id}`);
}