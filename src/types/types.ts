
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Завершена' | 'В процессе' | 'Ожидает';
  priority: 'Высокий' | 'Средний' | 'Низкий';
  assignee: string;
  dueDate: string;
}

export type SortOption = 'По сроку' | 'По приоритету' | 'По названию';
export type StatusFilter = 'Все статусы' | 'Завершена' | 'В процессе' | 'Ожидает';
