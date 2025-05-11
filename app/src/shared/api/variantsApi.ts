import { type Task, type Variant } from 'pages/variants/types';
import { api } from './authApi';

export const getVariants = async (): Promise<Variant[]> => {
  const response = await api.get('/generated/');
  return response.data;
};

export const getTasksByVariant = async (variantId: number): Promise<Task[]> => {
  const response = await api.get(`/generated/${variantId}/`);
  return response.data.tasks; // Предполагается, что API возвращает задания в поле "tasks"
};
