
import { Task } from '../types/types';

// Note: This interface doesn't match the actual Task interface
// It's simplified for use with the mock data adapter in apiService.ts
interface SimplifiedTask {
  id: string;
  title: string;
  description: string;
  status: 'Завершена' | 'В процессе' | 'Ожидает';
  priority: 'Высокий' | 'Средний' | 'Низкий';
  assignee: string;
  dueDate: string;
}

export const tasks: SimplifiedTask[] = [
  {
    id: '1',
    title: 'Обновление документации',
    description: 'Обновить документацию API с учетом последних изменений',
    status: 'Завершена',
    priority: 'Низкий',
    assignee: 'Иванов Иван',
    dueDate: '2025-03-06',
  },
  {
    id: '2',
    title: 'Завершить проектное предложение',
    description: 'Составить и утвердить проектное предложение для клиента',
    status: 'В процессе',
    priority: 'Высокий',
    assignee: 'Петров Петр',
    dueDate: '2025-03-09',
  },
  {
    id: '3',
    title: 'Проверить изменения кода',
    description: 'Проверить и одобрить ожидающие pull-запросы',
    status: 'Ожидает',
    priority: 'Средний',
    assignee: 'Сидорова Анна',
    dueDate: '2025-03-12',
  },
];
