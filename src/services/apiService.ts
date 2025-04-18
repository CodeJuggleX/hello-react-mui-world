
import { Task } from '../types/types';

const API_BASE_URL = 'http://192.168.38.236:8000/api/v1';

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/todo/todos/`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: Task[] = await response.json();
    
    // Добавляем id для совместимости с текущей структурой
    return data.map((task, index) => ({
      ...task,
      id: String(index + 1)
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
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
