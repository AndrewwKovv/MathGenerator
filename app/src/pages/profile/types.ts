export interface User {
  id: number;
  full_name: string;
  email: string;
  role: string; // Например, 'student' или 'teacher'
}

export interface UpdateProfileData {
  full_name: string;
  email: string;
  password?: string; // Пароль необязателен
}
