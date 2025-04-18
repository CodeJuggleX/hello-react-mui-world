
import { Task } from '../types/types';
import { tasks as mockTasks } from '../data/mockTasks';
import { getAccessToken, refreshToken } from './authService';

const API_BASE_URL = 'http://192.168.38.236:8000/api/v1';

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleApiResponse = async (response: Response) => {
  if (response.ok) {
    return response;
  }
  
  if (response.status === 401) {
    const newToken = await refreshToken();
    
    if (newToken) {
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

// Функция для адаптации моковых данных к новому формату API
const adaptMockDataToApiFormat = (): Task[] => {
  return mockTasks.map((task, index) => ({
    id: task.id,
    parent_task: null,
    task_name: task.title,
    description: task.description,
    task_status: task.status as 'Завершена' | 'В процессе' | 'Ожидает',
    task_priority: task.priority as 'Высокий' | 'Средний' | 'Низкий',
    deadline: task.dueDate,
    comment: '',
    employee_info: {
      id: index + 1,
      surname: task.assignee.split(' ')[0] || '',
      name: task.assignee.split(' ')[1] || '',
      last_name: '',
      image: '',
      full_path_image: '',
      work_phone_num: '',
      personal_phone_num: null,
      email: null,
      position: {
        id: index + 1,
        title: 'Разработчик'
      },
      department: {
        id: index + 1,
        title: 'IT отдел'
      },
      room_number: '101',
      full_name: task.assignee,
      order: index + 1
    }
  }));
};

export const fetchTasks = async (): Promise<Task[]> => {
  console.log('Fetching tasks from API...');
  try {
    const response = await fetch(`${API_BASE_URL}/todo/todos/`, {
      signal: AbortSignal.timeout(5000),
      headers: getAuthHeaders()
    });
    
    const validResponse = await handleApiResponse(response);
    
    const data: Task[] = await validResponse.json();
    console.log('API data received:', data);
    
    return data.map((task) => ({
      ...task,
      id: task.id ? String(task.id) : String(Math.random())
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    console.log('Falling back to mock data...');
    
    // Возвращаем моковые данные при ошибке API
    return adaptMockDataToApiFormat();
  }
};

export const fetchTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    console.log(`Fetching task with ID: ${taskId}`);
    // Пытаемся получить данные из API
    try {
      const response = await fetch(`${API_BASE_URL}/todo/todos/${taskId}/`, {
        signal: AbortSignal.timeout(3000),
        headers: getAuthHeaders()
      });
      
      const validResponse = await handleApiResponse(response);
      
      const task: Task = await validResponse.json();
      console.log('Task data from API:', task);
      
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
    } catch (apiError) {
      console.error('Error fetching task from API:', apiError);
    }
    
    // Если API не вернул данные, пробуем получить из общего списка
    const tasks = await fetchTasks();
    const task = tasks.find(task => task.id === taskId);
    console.log('Task found in list:', task);
    return task || null;
  } catch (error) {
    console.error('Error fetching task by id:', error);
    return null;
  }
};
