import { AuthResponse, LoginCredentials, RefreshTokenRequest } from '../types/types';

// API URL configuration
const API_BASE_URL = 'http://192.168.38.236:8000/api/v1';

// Local storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

// Helper functions for localStorage
const getLocalStorage = (key: string) => localStorage.getItem(key);
const setLocalStorage = (key: string, value: string) => localStorage.setItem(key, value);
const removeLocalStorage = (key: string) => localStorage.removeItem(key);

// Mock data for development fallback
const MOCK_DEV_USER = {
  username: 'dev',
  password: 'dev',
  access: 'mock-access-token',
  refresh: 'mock-refresh-token',
  account: {
    id: 1,
    username: 'dev',
    email: 'dev@example.com',
    ppp: [],
    permission: {
      catalog: { add: true, view: true, change: true, delete: true },
      techsupport: { add: true, view: true, change: true, delete: true },
      hall_booking: { add: true, view: true, change: true, delete: true }
    },
    groups: []
  },
  employee: {
    id: 1,
    surname: "Разработчик",
    name: "Тестовый",
    last_name: "Аккаунт",
    image: "",
    full_path_image: "",
    work_phone_num: "123-456",
    personal_phone_num: null,
    email: "dev@example.com",
    position: {
      id: 1,
      title: "Разработчик"
    },
    department: {
      id: 1,
      title: "IT"
    },
    room_number: "101",
    full_name: "Разработчик Тестовый Аккаунт",
    order: 1
  }
};

// Login the user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('Отправка запроса на авторизацию:', credentials.username);
    
    // Dev mode fallback for the 'dev' user
    if (credentials.username === 'dev' && credentials.password === 'dev') {
      console.log('Используем тестовую авторизацию для разработчика');
      
      // Store mock tokens and user data
      setLocalStorage(ACCESS_TOKEN_KEY, MOCK_DEV_USER.access);
      setLocalStorage(REFRESH_TOKEN_KEY, MOCK_DEV_USER.refresh);
      setLocalStorage(USER_KEY, JSON.stringify(MOCK_DEV_USER.account));
      
      return {
        access: MOCK_DEV_USER.access,
        refresh: MOCK_DEV_USER.refresh,
        account: MOCK_DEV_USER.account,
        employee: MOCK_DEV_USER.employee
      };
    }
    
    // Normal API authentication flow
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('Получен ответ авторизации, статус:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Ошибка авторизации:', errorData);
      throw new Error(`Ошибка авторизации: ${response.status}`);
    }

    const data: AuthResponse = await response.json();
    console.log('Успешная авторизация, сохранение токенов');
    
    // Store tokens and user data in local storage
    setLocalStorage(ACCESS_TOKEN_KEY, data.access);
    setLocalStorage(REFRESH_TOKEN_KEY, data.refresh);
    setLocalStorage(USER_KEY, JSON.stringify(data.account));
    
    return data;
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    throw error;
  }
};

// Logout the user
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
    console.error('Ошибка выхода:', error);
  } finally {
    // Clear local storage regardless of API success
    removeLocalStorage(ACCESS_TOKEN_KEY);
    removeLocalStorage(REFRESH_TOKEN_KEY);
    removeLocalStorage(USER_KEY);
  }
};

// Refresh the access token
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
      logout(); // Если не удалось обновить токен, выходим из системы
      return null;
    }

    const data = await response.json();
    setLocalStorage(ACCESS_TOKEN_KEY, data.access);
    
    return data.access;
  } catch (error) {
    console.error('Ошибка обновления токена:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getLocalStorage(ACCESS_TOKEN_KEY);
};

// Get current access token
export const getAccessToken = (): string | null => {
  return getLocalStorage(ACCESS_TOKEN_KEY);
};

// Get current user data
export const getCurrentUser = () => {
  const userData = getLocalStorage(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Автоматическое обновление токена каждые 4 минуты
setInterval(async () => {
  if (isAuthenticated()) {
    await refreshToken();
  }
}, 4 * 60 * 1000);
