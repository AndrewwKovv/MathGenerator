import { type Answer } from 'pages/myAnswers/types';
import { api } from './authApi';

// Получение списка ответов
export const getAnswers = async (): Promise<Answer[]> => {
  const response = await api.get('/answers/');
  return response.data;
};

// Получение конкретного ответа по ID
export const getAnswerById = async (answerId: number): Promise<Answer> => {
  const response = await api.get(`/answers/${answerId}/`);
  return response.data;
};
