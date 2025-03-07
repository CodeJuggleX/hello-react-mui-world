
import { Task } from '../types/types';

const API_BASE_URL = 'http://192.168.38.236:8000/api/v1';

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/todo/todos/`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: Task[] = await response.json();
    
    // Добавляем id для совместимости с текущей структурой, если его нет
    return data.map((task) => ({
      ...task,
      id: task.id || String(Math.random())
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Возвращаем пустой массив вместо выброса ошибки для улучшения UX
    return [];
  }
};

export const fetchTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    // В реальном API этот эндпоинт должен возвращать задачу вместе с подзадачами
    // Сейчас имитируем получение всех задач и фильтрацию
    const tasks = await fetchTasks();
    return tasks.find(task => String(task.id) === taskId) || null;
  } catch (error) {
    console.error('Error fetching task by id:', error);
    return null;
  }
};
