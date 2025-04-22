
import { Task } from '../types/types';
import { getAccessToken, refreshToken } from './authService';

const API_BASE_URL = 'http://192.168.38.236:8000/api/v1';

// Mock data for demo purposes
const MOCK_TASKS: Task[] = [
  {
    id: "1",
    parent_task: null,
    subtodo: [
      {
        id: "2",
        parent_task: 1,
        subtodo: [],
        employee_info: {
          id: 45,
          surname: "Абдекиров",
          name: "Алмаз",
          last_name: "Тынчтыкбекович",
          image: "https://via.placeholder.com/150",
          full_path_image: "https://via.placeholder.com/150",
          work_phone_num: "+135",
          personal_phone_num: null,
          email: null,
          position: {
            id: 10,
            title: "Башкармалыктын начальниги"
          },
          department: {
            id: 69,
            title: "06 Макроэкономикалык саясат башкармалыгы"
          },
          room_number: "207-а",
          full_name: "Абдекиров Алмаз Тынчтыкбекович",
          order: 0
        },
        task_name: "Подзадача 1",
        description: "Описание подзадачи",
        task_status: "Ожидает",
        task_priority: "Средний",
        deadline: "2025-02-13T19:36:00+06:00",
        comment: "Комментарий к подзадаче"
      }
    ],
    employee_info: {
      id: 1,
      surname: "Сыдыков",
      name: "Бакыт",
      last_name: "Толомушевич",
      image: "https://via.placeholder.com/150",
      full_path_image: "https://via.placeholder.com/150",
      work_phone_num: "+106",
      personal_phone_num: null,
      email: null,
      position: {
        id: 1,
        title: "Министр"
      },
      department: {
        id: 1,
        title: "01 Руководство"
      },
      room_number: "306",
      full_name: "Сыдыков Бакыт Толомушевич",
      order: 0
    },
    task_name: "Основная задача 1",
    description: "Описание задачи",
    task_status: "Завершена",
    task_priority: "Низкий",
    deadline: "2025-03-04T16:31:03.221000+06:00",
    comment: "Комментарий к задаче"
  },
  {
    id: "3",
    parent_task: null,
    subtodo: [],
    employee_info: {
      id: 13,
      surname: "Маматова",
      name: "Махабат",
      last_name: "Дженалиевна",
      image: "https://via.placeholder.com/150",
      full_path_image: "https://via.placeholder.com/150",
      work_phone_num: "+133",
      personal_phone_num: "0550 900 130",
      email: null,
      position: {
        id: 9,
        title: "Жетектөөчү адис"
      },
      department: {
        id: 4,
        title: "05 Басма сөз кызматы"
      },
      room_number: "303",
      full_name: "Маматова Махабат Дженалиевна",
      order: 0
    },
    task_name: "Важная задача",
    description: "Описание важной задачи",
    task_status: "В процессе",
    task_priority: "Высокий",
    deadline: "2025-03-08T12:00:00+06:00",
    comment: "Срочно выполнить"
  }
];

// Helper function to get authorized headers
const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Helper to check if we're using mock data
const isUsingMockData = () => {
  const token = getAccessToken();
  return token === "mock-access-token";
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
    // If using mock data, return it directly
    if (isUsingMockData()) {
      console.log('Using mock task data');
      return MOCK_TASKS;
    }
    
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
    // If using mock data, find the task in mock data
    if (isUsingMockData()) {
      console.log('Using mock task data for task details');
      const task = MOCK_TASKS.find(task => task.id === taskId);
      if (!task) {
        return MOCK_TASKS[0]; // Return first task as fallback
      }
      return task;
    }
    
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
