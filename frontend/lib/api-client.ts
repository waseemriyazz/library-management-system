import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    const formattedError = new Error(
      Array.isArray(message) ? message.join(', ') : message
    );
    (formattedError as any).status = error.response?.status;
    return Promise.reject(formattedError);
  }
);

export default apiClient;