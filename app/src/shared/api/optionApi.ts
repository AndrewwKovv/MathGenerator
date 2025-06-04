import { type Task, type Variant } from 'pages/variants/types';
import type { IGeneratedTaskData } from './types';
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

export const getGeneratedTaskIdByHash = async (hash: string): Promise<IGeneratedTaskData | null> => {
  const response = await api.get(`/generated/by-hash/?hash=${hash}`);
  return response.data ?? null;
};

export const submitTaskAnswers = async (
  generatedTaskId: number,
  fullName: string,
  taskAnswers: { taskId: number, answerText: string }[]
): Promise<void> => {
  await api.post('/answers/submit-solution/', {
    generatedTaskId,
    fullName,
    taskAnswers
  });
};

export const uploadImage = async (file: File, hash: string): Promise<void> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('hash', hash);

  await api.post('/answers/upload-image/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getImagesByHash = async (hash: string): Promise<string[]> => {
  const response = await api.get(`/answers/images/?hash=${hash}`);
  return response.data || [];
};
