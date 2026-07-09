import apiClient from '../api-client';
import { AuthResponse, LoginCredentials, SignupCredentials } from '../types/auth';

export const authApi = {
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/signup', credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async (): Promise<any> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
};