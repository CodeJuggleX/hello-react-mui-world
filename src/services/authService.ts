
import { AuthResponse, LoginCredentials, RefreshTokenRequest } from '../types/types';

const API_BASE_URL = 'http://192.168.38.236:8000/api/v1';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

const getLocalStorage = (key: string) => localStorage.getItem(key);
const setLocalStorage = (key: string, value: string) => localStorage.setItem(key, value);
const removeLocalStorage = (key: string) => localStorage.removeItem(key);

// Вспомогательная функция для безопасного запроса с проверкой токена
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let token = getLocalStorage(ACCESS_TOKEN_KEY);
  if (!token) {
    token = await refreshToken();
  }

  if (!token) {
    throw new Error('Unauthorized');
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }

    const data: AuthResponse = await response.json();
    
    setLocalStorage(ACCESS_TOKEN_KEY, data.access);
    setLocalStorage(REFRESH_TOKEN_KEY, data.refresh);
    setLocalStorage(USER_KEY, JSON.stringify(data.account));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const refreshToken = getLocalStorage(REFRESH_TOKEN_KEY);
    
    if (refreshToken) {
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeLocalStorage(ACCESS_TOKEN_KEY);
    removeLocalStorage(REFRESH_TOKEN_KEY);
    removeLocalStorage(USER_KEY);
  }
};

// Обновление access-токена
export const refreshToken = async (): Promise<string | null> => {
  const refreshToken = getLocalStorage(REFRESH_TOKEN_KEY);
  
  if (!refreshToken) {
    return null;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken } as RefreshTokenRequest),
    });

    if (!response.ok) {
      logout(); // Выкидываем пользователя, если refresh не сработал
      return null;
    }

    const data = await response.json();
    setLocalStorage(ACCESS_TOKEN_KEY, data.access);
    
    return data.access;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getLocalStorage(ACCESS_TOKEN_KEY);
};

export const getAccessToken = (): string | null => {
  return getLocalStorage(ACCESS_TOKEN_KEY);
};

export const getCurrentUser = () => {
  const userData = getLocalStorage(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Автоматическое обновление токена каждые 4 минуты
setInterval(async () => {
  await refreshToken();
}, 4 * 60 * 1000);
