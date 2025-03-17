
import { Task } from '../types/types';
import { getAccessToken, refreshToken } from './authService';

const API_BASE_URL = 'http://192.168.38.236:8000/api/v1';

// Helper function to get authorized headers
const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Handle API response with token refresh logic
const handleApiResponse = async (response: Response) => {
  if (response.ok) {
    return response;
  }
  
  // If unauthorized error, try to refresh token and retry once
  if (response.status === 401) {
    const newToken = await refreshToken();
    
    if (newToken) {
      // Retry with new token
      const originalRequest = response.url;
      const method = response.type;
      
      return fetch(originalRequest, {
        method,
        headers: getAuthHeaders()
      });
    }
  }
  
  throw new Error(`API error: ${response.status}`);
};

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/todo/todos/`, {
      headers: getAuthHeaders()
    });
    
    const validResponse = await handleApiResponse(response);
    
    const data: Task[] = await validResponse.json();
    
    // Ensure all tasks have an id as string
    return data.map((task) => ({
      ...task,
      id: task.id ? String(task.id) : String(Math.random())
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Return empty array instead of throwing an error for better UX
    return [];
  }
};

export const fetchTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/todo/todos/${taskId}/`, {
      headers: getAuthHeaders()
    });
    
    const validResponse = await handleApiResponse(response);
    
    const task: Task = await validResponse.json();
    
    // Ensure the task and all subtasks have string ids
    const processedTask = {
      ...task,
      id: String(task.id)
    };
    
    if (processedTask.subtodo && processedTask.subtodo.length > 0) {
      processedTask.subtodo = processedTask.subtodo.map(subtask => ({
        ...subtask,
        id: String(subtask.id)
      }));
    }
    
    return processedTask;
  } catch (error) {
    console.error('Error fetching task by id:', error);
    return null;
  }
};
