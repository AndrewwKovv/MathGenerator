import { type FC, useState, useEffect } from 'react';
import { QRCode, Select, Button, Form, message } from 'antd';

import { Error, Page } from 'widgets';
import { PATHS } from 'config';
import { generateHash } from 'store/utils';
import { getFullHref } from 'shared/utils';
import { useAuth } from 'shared/context/authContext';
import { api } from 'shared/api/authApi';

import styles from './qr.module.scss';

export const QRPage: FC = () => {
  const hash = generateHash();
  const [groups, setGroups] = useState<{ id: number, name: string }[]>([]); // Список групп
  const [users, setUsers] = useState<{ id: number, full_name: string }[]>([]); // Список пользователей
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null); // Выбранная группа
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]); // Выбранные пользователи
  const [isSending, setIsSending] = useState<boolean>(false); // Состояние отправки
  const { user } = useAuth(); // Получаем данные авторизованного пользователя

  useEffect(() => {
    // Получение списка групп
    const fetchGroups = async () => {
      try {
        const response = await api.get('/group/');
        setGroups(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке групп:', error);
      }
    };

    void fetchGroups();
  }, []);

  useEffect(() => {
    // Получение списка пользователей для выбранной группы
    const fetchUsers = async () => {
      if (!selectedGroup) {
        setUsers([]);
        return;
      }

      try {
        const response = await api.get(`/group/${selectedGroup}/`);
        const group = response.data;
        setUsers(group.students.map((student: { id: number, full_name: string }) => ({
          id: student.id,
          full_name: student.full_name
        })));
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
      }
    };

    void fetchUsers();
  }, [selectedGroup]);

  const handleSendNotification = async () => {
    if (!selectedGroup) {
      void message.error('Выберите группу для отправки уведомления');
      return;
    }
    if (!hash) {
      void message.error('Хэш варианта отсутствует');
      return;
    }
    setIsSending(true);
    try {
      // Отправляем уведомление
      await api.post('/notifications/send/', {
        groupId: selectedGroup,
        userIds: selectedUsers.length > 0 ? selectedUsers : null, // Если пользователей не выбрано, отправляем всем
        message: `Вам назначен вариант ${hash}`
      });
      // Обновляем статус задания для пользователей
      await api.post('/status-task/', {
        userIds: selectedUsers.length > 0 ? selectedUsers : null, // Если пользователей не выбрано, обновляем статус для всех
        hashCode: hash, // Хэш варианта
        status: 'not_started', // Устанавливаем статус "не начато"
        groupId: selectedGroup // Передаем ID группы
      });
      void message.success('Уведомление успешно отправлено, статус заданий обновлен');
    } catch (error) {
      console.error('Ошибка при отправке уведомления или обновлении статуса:', error);
      void message.error('Не удалось отправить уведомление или обновить статус');
    } finally {
      setIsSending(false);
    }
  };

  const renderQR = () => {
    if (!hash) {
      return null;
    }

    const fullHref = getFullHref();
    const optionPath = `${PATHS.STUDENT}/${hash}`;
    const totalPath = `${fullHref}${optionPath}`;

    return (
      <div className={styles.qr}>
        <div>
          Код варианта:
          {hash}
        </div>
        <QRCode value={totalPath} size={250} />
        {user?.role === 'student' && ( // Доступ только для студентов
          <Button href={optionPath}>
            Перейти к варианту
          </Button>
        )}
        <div className={styles.pathButtons}>
          <Button href={PATHS.TASKS}>
            Вернуться к секциям
          </Button>
        </div>
      </div>
    );
  };

  const renderError = () => {
    if (hash) {
      return null;
    }

    return (
      <Error
        message="Кажется, что вы не выбрали ни одного примера"
        redirect={PATHS.PROFESSOR}
      />
    );
  };

  return (
    <Page className={styles.wrapper}>
      {renderQR()}
      {renderError()}

      {user?.role === 'teacher' && ( // Доступ только для преподавателей
        <div className={styles.notificationForm}>
          <h2>Отправить уведомление</h2>
          <Form layout="vertical">
            <Form.Item label="Выберите группу">
              <Select
                showSearch
                placeholder="Выберите группу"
                options={groups.map((group) => ({
                  value: group.id,
                  label: group.name
                }))}
                onChange={(value) => {
                  setSelectedGroup(value);
                  setSelectedUsers([]); // Сбрасываем выбранных пользователей при смене группы
                }}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            </Form.Item>
            <Form.Item label="Выберите пользователей (опционально)">
              <Select
                mode="multiple"
                showSearch
                placeholder="Выберите пользователей или оставьте пустым для отправки всем"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.full_name
                }))}
                value={selectedUsers}
                onChange={(value) => {
                  setSelectedUsers(value);
                }}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                disabled={!selectedGroup} // Блокируем, если группа не выбрана
              />
            </Form.Item>
            <Button
              className={styles.buttonPrimary}
              onClick={() => {
                void handleSendNotification();
              }}
              loading={isSending}
              disabled={!selectedGroup}
            >
              Отправить уведомление
            </Button>
          </Form>
        </div>
      )}
    </Page>
  );
};
