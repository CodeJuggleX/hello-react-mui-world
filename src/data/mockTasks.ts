
import { Task } from '../types/types';

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Update Documentation',
    description: 'Update the API documentation with recent changes',
    status: 'Завершена',
    priority: 'Низкий',
    assignee: 'Bob Johnson',
    dueDate: '06.03.2025',
  },
  {
    id: '2',
    title: 'Complete Project Proposal',
    description: 'Draft and finalize the project proposal for client review',
    status: 'В процессе',
    priority: 'Высокий',
    assignee: 'John Doe',
    dueDate: '09.03.2025',
  },
  {
    id: '3',
    title: 'Review Code Changes',
    description: 'Review and approve pending pull requests',
    status: 'Ожидает',
    priority: 'Средний',
    assignee: 'Jane Smith',
    dueDate: '12.03.2025',
  },
];
