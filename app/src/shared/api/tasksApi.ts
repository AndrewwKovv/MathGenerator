import { type Task } from 'pages/taks/types';
import { api } from './authApi';

// Получение списка заданий
export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('/task/');
  return response.data;
};

// Получение задания по ID
export const getTaskById = async (taskId: number): Promise<Task> => {
  const response = await api.get(`/task/${taskId}/`);
  return response.data;
};

// Создание нового задания
export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const response = await api.post('/task/', task);
  return response.data;
};

// Обновление задания
export const updateTask = async (taskId: number, task: Partial<Task>): Promise<Task> => {
  const response = await api.put(`/task/${taskId}/`, task);
  return response.data;
};

// Удаление задания
export const deleteTask = async (taskId: number): Promise<void> => {
  await api.delete(`/task/${taskId}/`);
};
