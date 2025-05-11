import { type Answer } from 'pages/myAnswers/types';
import { api } from './authApi';

export const getAnswers = async (): Promise<Answer[]> => {
  const response = await api.get('/answer/');
  return response.data;
};
