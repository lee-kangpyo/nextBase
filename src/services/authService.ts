import apiClient from '@/utils/apiClientServer';

const API_URL = '/auth';

export const authService = {
  login: async (userName: string, password: string) => {
    try {
      const response = await apiClient.post(`${API_URL}/login`, {
        userName,
        password,
      });
      return response.data;
    } catch (error) {
      // console.error('로그인 실패:', error);
      throw error;
    }
  },
};
