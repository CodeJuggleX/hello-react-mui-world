
import { AuthResponse, LoginCredentials, RefreshTokenRequest } from '../types/types';

const API_BASE_URL = 'http://192.168.38.236:8000/api/v1';

// Local storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

// Mock auth data for demo purposes
const MOCK_AUTH_DATA: AuthResponse = {
  refresh: "mock-refresh-token",
  access: "mock-access-token",
  account: {
    id: 1,
    username: "dev",
    email: "",
    ppp: [],
    permission: {
      catalog: {
        add: true,
        view: true,
        change: true,
        delete: true
      },
      techsupport: {
        add: true,
        view: true,
        change: true,
        delete: true
      },
      hall_booking: {
        add: true,
        view: true,
        change: true,
        delete: true
      }
    },
    groups: []
  },
  employee: null
};

// Login the user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // In a demo environment, allow dev/dev to work without needing the actual API
    if (credentials.username === 'dev' && credentials.password === 'dev') {
      console.log('Using mock authentication for dev user');
      
      // Store tokens and user data in local storage
      localStorage.setItem(ACCESS_TOKEN_KEY, MOCK_AUTH_DATA.access);
      localStorage.setItem(REFRESH_TOKEN_KEY, MOCK_AUTH_DATA.refresh);
      localStorage.setItem(USER_KEY, JSON.stringify(MOCK_AUTH_DATA.account));
      
      return MOCK_AUTH_DATA;
    }
    
    // For other credentials, try the actual API
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
    
    // Store tokens and user data in local storage
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(data.account));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout the user
export const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (refreshToken && refreshToken !== MOCK_AUTH_DATA.refresh) {
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
    // Clear local storage regardless of API success
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

// Refresh the access token
export const refreshToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  
  if (!refreshToken) {
    return null;
  }
  
  // For mock token, just return the mock access token
  if (refreshToken === MOCK_AUTH_DATA.refresh) {
    return MOCK_AUTH_DATA.access;
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
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
    
    return data.access;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Get current access token
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Get current user data
export const getCurrentUser = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};
