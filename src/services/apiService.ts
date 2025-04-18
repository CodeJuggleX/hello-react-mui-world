
import { Task } from '../types/types';
import { tasks as mockTasks } from '../data/mockTasks';

const API_BASE_URL = 'http://192.168.38.236:8000/api/v1';

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
  try {
    const response = await fetch(`${API_BASE_URL}/todo/todos/`, {
      // Добавляем таймаут, чтобы не ждать долго при недоступности API
      signal: AbortSignal.timeout(3000)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: Task[] = await response.json();
    
    // Добавляем id для совместимости с текущей структурой
    return data.map((task, index) => ({
      ...task,
      id: task.id || String(index + 1)
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
    const tasks = await fetchTasks();
    return tasks.find(task => task.id === taskId) || null;
  } catch (error) {
    console.error('Error fetching task by id:', error);
    throw error;
  }
};
