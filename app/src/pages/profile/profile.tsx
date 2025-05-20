import { type FC, useState, useEffect } from 'react';
import { Page } from 'widgets';
import { Input, Button, Form, List, Typography, message as antdMessage } from 'antd';
import { useAuth } from 'shared/context/authContext';
import { api } from 'shared/api/authApi';
import { type User, type UpdateProfileData, type Notification } from './types';

import styles from './profile.module.scss';

const { Text } = Typography;

export const ProfilePage: FC = () => {
  const { user, setUser } = useAuth(); // Получаем текущего пользователя из контекста
  const [fullName, setFullName] = useState<string>(user?.full_name ?? '');
  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]); // Список уведомлений

  // Получение уведомлений с бэкенда
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get<Notification[]>('/notifications/');
        setNotifications(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке уведомлений:', err);
      }
    };

    void fetchNotifications();
  }, []);

  // Обновление профиля
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
      void antdMessage.success('Профиль успешно обновлен');
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      setError('Не удалось обновить профиль');
    }
  };

  // Пометка уведомления как прочитанного
  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/mark-as-read/`); // Эндпоинт для пометки уведомления
      // eslint-disable-next-line no-confusing-arrow
      setNotifications((prev) => prev.map((notification) => notification.id === id ? { ...notification, is_read: true } : notification));
    } catch (err) {
      console.error('Ошибка при обновлении статуса уведомления:', err);
    }
  };

  return (
    <Page className={styles.wrapper}>
      <h1>Настройки профиля</h1>
      <div className={styles.wrapper__form}>
        <Form layout="vertical" className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <Form.Item className={styles.form__items} label="ФИО">
            <Input
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              placeholder="Введите ваше ФИО"
            />
          </Form.Item>
          <Form.Item className={styles.form__items} label="Email">
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Введите ваш email"
            />
          </Form.Item>
          <Form.Item className={styles.form__items} label="Новый пароль">
            <Input.Password
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Введите новый пароль"
            />
          </Form.Item>
          <Form.Item className={styles.form__items} label="Подтвердите пароль">
            <Input.Password
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              placeholder="Подтвердите новый пароль"
            />
          </Form.Item>
          <Button
            className={styles.buttonPrimary}
            onClick={() => {
              void handleSave();
            }}
          >
            Сохранить изменения
          </Button>
        </Form>

        <div className={styles.notifications}>
          <h2>Уведомления</h2>
          <List
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item
                className={`${styles.notificationCard} ${
                  notification.is_read ? styles.read : styles.unread
                }`}
                onClick={() => {
                  if (!notification.is_read) {
                    void markAsRead(notification.id);
                  }
                }}
              >
                <div>
                  <Text strong>{notification.sender ?? 'Система'}</Text>
                  <p>{notification.message}</p>
                  <Text type="secondary" className={styles.timestamp}>
                    {new Date(notification.created_at).toLocaleString()}
                  </Text>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </Page>
  );
};
