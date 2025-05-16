import { type FC, useState, useEffect } from 'react';
import { Input, Button, Form, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'config';
import { api } from 'shared/api/authApi';
import { Page } from 'widgets/page';
import { getTopics } from 'shared/api/topicsApi'; // API для получения списка тем
import { type Topic } from 'pages/taks/types';

import styles from './addTask.module.scss';

export const AddTaksPage: FC = () => {
  const [title, setTitle] = useState('');
  const [view, setView] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]); // Список выбранных тем
  const [topics, setTopics] = useState<Topic[]>([]); // Список всех доступных тем
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTopics(); // Получение списка тем
        setTopics(data);
      } catch (error) {
        console.error('Ошибка при загрузке тем:', error);
      }
    };

    void fetchTopics();
  }, []);

  const handleSubmit = async () => {
    if (!title || !view || selectedTopics.length === 0) {
      alert('Все поля обязательны для заполнения');
      return;
    }

    try {
      await api.post('/task/', {
        title,
        view,
        topics: selectedTopics.map((id) => ({ id }))
      });
      alert('Задание успешно добавлено');
      navigate(PATHS.TASK);
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
        <Form.Item label="Темы задания">
          <Select
            mode="multiple"
            value={selectedTopics}
            onChange={(values) => {
              setSelectedTopics(values);
            }}
            options={topics.map((topic) => ({
              value: topic.id,
              label: topic.section_name
            }))}
            placeholder="Выберите одну или несколько тем"
          />
        </Form.Item>
        <div className={styles.buttons}>
          <Button
            className={styles.buttonPrimary}
            onClick={() => {
              void handleSubmit();
            }}
          >
            Добавить
          </Button>
          <Button
            onClick={() => {
              navigate(PATHS.TASK);
            }}
            className={styles.buttonDanger}
            danger
          >
            Назад
          </Button>
        </div>
      </Form>
    </Page>
  );
};
