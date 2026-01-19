import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true, // For HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
