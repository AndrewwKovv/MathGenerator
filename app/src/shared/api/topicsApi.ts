import { type Topic } from 'pages/themes/types';
import { api } from './authApi';

// Получение списка тем
export const getTopics = async (): Promise<Topic[]> => {
  const response = await api.get('/topic/');
  return response.data;
};

// Получение заданий для конкретной темы
export const getTasksByTopic = async (topicId: number): Promise<Topic> => {
  const response = await api.get(`/topic/${topicId}/`);
  return response.data;
};

export const addTopic = async (newTopic: { name: string, section_name: string }): Promise<Topic> => {
  const response = await api.post('/topic/', newTopic);
  return response.data;
};
