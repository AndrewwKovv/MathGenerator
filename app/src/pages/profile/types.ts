export interface User {
  id: number;
  full_name: string;
  email: string;
  role: string; // Например, 'student' или 'teacher'
  group?: Group; // Группа может быть необязательной
}

export interface UpdateProfileData {
  full_name: string;
  email: string;
  password?: string; // Пароль необязателен
}

export interface Group {
  id: number;
  name: string;
}
