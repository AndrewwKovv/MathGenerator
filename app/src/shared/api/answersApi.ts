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

export const getAnswerByHashAndUser = async (
  hashCode: string,
  userId: string
): Promise<Answer> => {
  const response = await api.get('/answers/solution-by-hash/', {
    params: {
      hash_code: hashCode,
      user_id: userId
    }
  });
  return response.data; // предполагаем, что приходит массив и берем первый
};
