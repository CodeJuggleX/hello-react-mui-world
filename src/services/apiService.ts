
import { Task } from '../types/types';

const API_BASE_URL = 'http://192.168.38.236:8000/api/v1';

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/todo/todos/`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: Task[] = await response.json();
    
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
    const response = await fetch(`${API_BASE_URL}/todo/todos/${taskId}/`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const task: Task = await response.json();
    
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
