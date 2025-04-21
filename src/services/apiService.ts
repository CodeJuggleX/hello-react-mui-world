
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

// Функция для получения моковых данных при отсутствии соединения с API
const getMockTasks = (): Task[] => {
  console.info('Using mock task data');
  return [
    {
      id: "1",
      parent_task: null,
      employee_info: {
        id: 1,
        surname: "Иванов",
        name: "Иван",
        last_name: "Иванович",
        image: "",
        full_path_image: "",
        work_phone_num: "123-456",
        personal_phone_num: null,
        email: "ivanov@example.com",
        position: {
          id: 1,
          title: "Разработчик"
        },
        department: {
          id: 1,
          title: "IT"
        },
        room_number: "101",
        full_name: "Иванов Иван Иванович",
        order: 1
      },
      task_name: "Разработка интерфейса",
      description: "Создать пользовательский интерфейс для новой системы",
      task_status: "В процессе",
      task_priority: "Высокий",
      deadline: "2025-05-01T00:00:00.000Z",
      comment: "Используйте React и TypeScript",
      subtodo: []
    },
    {
      id: "2",
      parent_task: null,
      employee_info: {
        id: 2,
        surname: "Петров",
        name: "Петр",
        last_name: "Петрович",
        image: "",
        full_path_image: "",
        work_phone_num: "789-012",
        personal_phone_num: null,
        email: "petrov@example.com",
        position: {
          id: 2,
          title: "Менеджер"
        },
        department: {
          id: 1,
          title: "IT"
        },
        room_number: "202",
        full_name: "Петров Петр Петрович",
        order: 2
      },
      task_name: "Планирование спринта",
      description: "Подготовить план работ на следующий спринт",
      task_status: "Ожидает",
      task_priority: "Средний",
      deadline: "2025-04-25T00:00:00.000Z",
      comment: "Обратите внимание на приоритеты задач",
      subtodo: []
    }
  ];
};

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/todo/todos/`, {
      headers: getAuthHeaders()
    });
    
    const validResponse = await handleApiResponse(response);
    
    const data: any[] = await validResponse.json();
    
    // Ensure all tasks have an id as string
    return data.map((task) => ({
      ...task,
      id: String(task.id),
      // Если API возвращает subtodo в неправильном формате, исправляем
      subtodo: Array.isArray(task.subtodo) ? task.subtodo : [],
      // Проверяем наличие поля comments/comment
      comment: task.comment || task.comments || ""
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Return mock data instead of throwing an error for better UX
    return getMockTasks();
  }
};

export const fetchTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/todo/todos/${taskId}/`, {
      headers: getAuthHeaders()
    });
    
    const validResponse = await handleApiResponse(response);
    
    const task: any = await validResponse.json();
    
    // Ensure the task and all subtasks have string ids
    const processedTask: Task = {
      ...task,
      id: String(task.id),
      // Если API возвращает subtodo в неправильном формате, исправляем
      subtodo: Array.isArray(task.subtodo) ? 
        task.subtodo.map((subtask: any) => ({
          ...subtask,
          id: String(subtask.id)
        })) : [],
      // Проверяем наличие поля comments/comment
      comment: task.comment || task.comments || ""
    };
    
    return processedTask;
  } catch (error) {
    console.error('Error fetching task by id:', error);
    // Возвращаем null вместо ошибки для лучшего UX
    return null;
  }
};
