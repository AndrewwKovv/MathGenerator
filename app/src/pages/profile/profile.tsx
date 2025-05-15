import { type FC, useState } from 'react';
import { Page } from 'widgets';
import { Input, Button, Form } from 'antd';
import { useAuth } from 'shared/context/authContext';
import { api } from 'shared/api/authApi';
import { type User, type UpdateProfileData } from './types';

import styles from './profile.module.scss';

export const ProfilePage: FC = () => {
  const { user, setUser } = useAuth(); // Получаем текущего пользователя из контекста
  const [fullName, setFullName] = useState<string>(user?.full_name ?? '');
  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (password && password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    const updateData: UpdateProfileData = {
      full_name: fullName,
      email,
      ...(password ? { password } : {})
    };

    try {
      const updatedUser: User = await api.put('/auth/update/', updateData);
      setUser(updatedUser); // Обновляем данные пользователя в контексте
      alert('Профиль успешно обновлен');
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      setError('Не удалось обновить профиль');
    }
  };

  return (
    <Page className={styles.wrapper}>
      <h1>Настройки профиля</h1>
      <Form layout="vertical" className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        <Form.Item label="ФИО">
          <Input
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            placeholder="Введите ваше ФИО"
          />
        </Form.Item>
        <Form.Item label="Email">
          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Введите ваш email"
          />
        </Form.Item>
        <Form.Item label="Новый пароль">
          <Input.Password
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Введите новый пароль"
          />
        </Form.Item>
        <Form.Item label="Подтвердите пароль">
          <Input.Password
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            placeholder="Подтвердите новый пароль"
          />
        </Form.Item>
        <Button
          type="primary"
          onClick={() => {
            void handleSave(); // Оборачиваем вызов в обычную функцию
          }}
        >
          Сохранить изменения
        </Button>
      </Form>
    </Page>
  );
};
