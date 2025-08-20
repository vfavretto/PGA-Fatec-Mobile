import api from "./api";
import * as SecureStore from 'expo-secure-store';

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface UserData {
  pessoa_id: number;
  email: string;
  nome: string;
}

export interface LoginResponse {
  access_token: string;
  user: UserData;
}

// Configuração dos endpoints da API
const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  RESET_PASSWORD: '/auth/reset-password',
};

/** Função de autenticação */
export const authService = {
  /** Realiza o login do usuário
   * @param credentials - Objeto com email e senha
   * @returns Promise com os dados do usuário
   */
  async login(credentials: LoginCredentials): Promise<UserData> {
    try {
      const response = await api.post<LoginResponse>(
        API_ENDPOINTS.LOGIN,
        credentials
      );

      if (response.status !== 200) {
        throw new Error("Falha na autenticação");
      }

      const data: LoginResponse = response.data;
      const access_token: string = data.access_token;

      const userData = parseJwt(access_token);
      
      // Salvar no SecureStore ao invés do localStorage
      await SecureStore.setItemAsync("accessToken", access_token);
      await SecureStore.setItemAsync("userData", JSON.stringify(userData));

      return data.user;
    } catch (error) {
      console.error("Erro durante o login:", error);
      throw error;
    }
  },

  /** Logout do usuário
   * Remove o token de acesso e os dados do usuário do armazenamento seguro
   */
  async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("userData");
    } catch (error) {
      console.error("Erro durante o logout:", error);
    }
  },

  /** Verifica se o usuário está autenticado
   * @returns true se o usuário estiver autenticado, false caso contrário
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      return !!token;
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      return false;
    }
  },

  /** Retorna os dados do usuário atual
   * @returns Objeto com os dados do usuário ou null se não estiver autenticado
   */
  async getCurrentUser(): Promise<UserData | null> {
    try {
      const userData = await SecureStore.getItemAsync("userData");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Erro ao recuperar dados do usuário:", error);
      return null;
    }
  },
};

/** Função auxiliar para decodificar o token JWT
 * @param token - O token JWT a ser decodificado
 * @returns Objeto com os dados do usuário
 */
function parseJwt(token: string): UserData {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erro ao decodificar token JWT:", e);
    return { pessoa_id: 0, email: "", nome: "" };
  }
}
