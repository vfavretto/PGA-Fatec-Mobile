import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Configuração da URL da API - você pode mudar isso conforme necessário
const API_URL = __DEV__ ? 'http://localhost:3000' : 'https://your-production-api.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em todas as requisições autenticadas
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('userData');
        // Em React Native, você pode usar um event emitter ou navigation reset
        // para redirecionar para a tela de login
      } catch (storageError) {
        console.error('Erro ao limpar dados de autenticação:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
