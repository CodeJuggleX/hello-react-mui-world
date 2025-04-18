
export interface Position {
  id: number;
  title: string;
}

export interface Department {
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
  department: Department;
  room_number: string;
  full_name: string;
  order: number;
}

export interface Task {
  id?: string;
  parent_task: number | null;
  employee_info: EmployeeInfo;
  task_name: string;
  description: string;
  task_status: 'Завершена' | 'В процессе' | 'Ожидает';
  task_priority: 'Высокий' | 'Средний' | 'Низкий';
  deadline: string;
  comment: string;
  subtodo?: Task[];
}

export type SortOption = 'По сроку' | 'По приоритету' | 'По названию';
export type StatusFilter = 'Все статусы' | 'Завершена' | 'В процессе' | 'Ожидает';

// Аутентификация
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface AccountInfo {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  full_name?: string;
  position?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  account: AccountInfo;
}
