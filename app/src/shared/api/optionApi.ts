import { type Task, type Variant } from 'pages/variants/types';
import { api } from './authApi';

// Получение списка вариантов
export const getVariants = async (): Promise<Variant[]> => {
  const response = await api.get('/generated/');
  return response.data;
};

// Получение заданий по варианту
export const getTasksByVariant = async (variantId: number): Promise<Task[]> => {
  const response = await api.get(`/generated/${variantId}/`);
  return response.data.tasks; // Предполагается, что API возвращает задания в поле "tasks"
};