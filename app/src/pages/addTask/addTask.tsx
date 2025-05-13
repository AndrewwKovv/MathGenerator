import { type FC, useState } from 'react';
import { Input, Button, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'config';
import { api } from 'shared/api/authApi';
import { Page } from 'widgets/page';

import styles from './addTask.module.scss';

export const AddTaksPage: FC = () => {
  const [title, setTitle] = useState('');
  const [view, setView] = useState('');
  const [dataTask, setDataTask] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !view || !dataTask) {
      alert('Все поля обязательны для заполнения');
      return;
    }

    try {
      await api.post('/tasks/', { title, view, data_task: dataTask });
      alert('Задание успешно добавлено');
      navigate(PATHS.TASKS);
    } catch (error) {
      console.error('Ошибка при добавлении задания:', error);
      alert('Не удалось добавить задание');
    }
  };

  return (
    <Page className={styles.wrapper}>
      <h1>Добавить задание</h1>
      <Form layout="vertical" className={styles.form}>
        <Form.Item label="Название задания">
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="Введите название задания"
          />
        </Form.Item>
        <Form.Item label="Отображение задания">
          <Input
            value={view}
            onChange={(e) => {
              setView(e.target.value);
            }}
            placeholder="Введите отображение задания"
          />
        </Form.Item>
        <Form.Item label="Содержание задания">
          <Input.TextArea
            value={dataTask}
            onChange={(e) => {
              setDataTask(e.target.value);
            }}
            placeholder="Введите содержание задания"
            rows={4}
          />
        </Form.Item>
        <Button
          type="primary"
          onClick={() => {
            void handleSubmit(); // Оборачиваем вызов в синхронную функцию
          }}
        >
          Добавить
        </Button>
      </Form>
    </Page>
  );
};
