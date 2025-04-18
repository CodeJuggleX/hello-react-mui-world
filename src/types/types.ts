export interface Position {
  id: number;
  title: string;
}

export interface EmployeeInfo {
  id: number;
  surname: string;
  name: string;
  last_name: string;
  image: string;
  full_path_image: string;
  work_phone_num: string;
  personal_phone_num: string | null;
  email: string | null;
  position: Position;
  department: string;
  room_number: string;
  full_name: string;
  order: number;
}

export interface Task {
  id: number;
  parent_task: number;
  employee_info: EmployeeInfo;
  task_name: string;
  description: string;
  task_status: 'Завершена' | 'В процессе' | 'Ожидает';
  task_priority: 'Высокий' | 'Средний' | 'Низкий';
  deadline: string;
  subtodo: string;
  comments: string;
}

export type SortOption = 'По сроку' | 'По приоритету' | 'По названию';
export type StatusFilter = 'Все статусы' | 'Завершена' | 'В процессе' | 'Ожидает';
