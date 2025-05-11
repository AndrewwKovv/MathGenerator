import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const login = async (email: string, password: string) => {
  const response = await api.post('auth/login/', { email, password }); // Отправляем email вместо username
  return response.data;
};

export const getUser = async (token: string) => {
  const response = await api.get('auth/', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const logout = async (token: string) => {
  const response = await api.post(
    'auth/logout/',
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

export const apiRegister = async (data: { email: string, password: string, full_name: string }) => {
  const response = await api.post('auth/registration/', data); // Эндпоинт для регистрации
  return response.data;
};
