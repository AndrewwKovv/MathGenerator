import { type FC, useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { Page } from 'widgets';
import { MathText } from 'shared/components';
import { BlockMath } from 'react-katex';
import { getTopics, getTasksByTopic, addTopic } from 'shared/api/topicsApi';
import { type Topic, type Task } from './types';

import styles from './themes.module.scss';

export const ThemesPage: FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]); // Список тем
  const [tasks, setTasks] = useState<Task[]>([]); // Список заданий выбранной темы
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null); // ID выбранной темы
  const [isAddingTopic, setIsAddingTopic] = useState(false); // Отображение формы добавления темы
  const [newTopic, setNewTopic] = useState({ name: '', section_name: '' }); // Данные новой темы

  useEffect(() => {
    // Получение списка тем
    const fetchTopics = async () => {
      try {
        const data = await getTopics();
        setTopics(data);
      } catch (error) {
        console.error('Ошибка при загрузке тем:', error);
      }
    };
    void fetchTopics();
  }, []);

  const handleTopicClick = async (topicId: number) => {
    setSelectedTopic(topicId); // Устанавливаем выбранную тему
    try {
      const data = await getTasksByTopic(topicId); // Получаем задания для выбранной темы
      setTasks(data.tasks); // Устанавливаем задания
    } catch (error) {
      console.error('Ошибка при загрузке заданий:', error);
    }
  };

  const handleAddTopic = async () => {
    try {
      const createdTopic = await addTopic(newTopic); // Используем API для добавления темы
      setTopics((prevTopics) => [...prevTopics, createdTopic]); // Добавляем новую тему в список
      setIsAddingTopic(false); // Скрываем форму
      setNewTopic({ name: '', section_name: '' }); // Сбрасываем данные формы
    } catch (error) {
      console.error('Ошибка при добавлении темы:', error);
    }
  };

  return (
    <Page className={styles.wrapper}>
      <h1 className={styles.title}>Темы заданий</h1>
      <Carousel className={styles.carousel} dots={false} slidesToShow={5}>
        <div
          className={styles.card}
          role="button"
          tabIndex={0}
          onClick={() => {
            setIsAddingTopic(true); // Отображаем форму добавления темы
            setSelectedTopic(null); // Сбрасываем выбранную тему
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsAddingTopic(true);
              setSelectedTopic(null);
            }
          }}
        >
          <button type="button" className={styles.addButton}>+</button>
        </div>
        {Array.isArray(topics) && topics.map((topic) => (
          <div
            key={topic.id}
            className={`${styles.card} ${selectedTopic === topic.id && !isAddingTopic ? styles.activeCard : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => {
              setIsAddingTopic(false); // Скрываем форму добавления темы
              void handleTopicClick(topic.id); // Загружаем задания для выбранной темы
            }}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !isAddingTopic) {
                setIsAddingTopic(false); // Скрываем форму добавления темы
                void handleTopicClick(topic.id); // Загружаем задания для выбранной темы
              }
            }}
          >
            <div className={styles.cart__title}>
              <h4>{topic.section_name || 'Без секции'}</h4>
            </div>
          </div>
        ))}
      </Carousel>
      <div className={styles.divider} />
      {!isAddingTopic ? (
        <div className={styles.tasksCarousel}>
          {Array.isArray(tasks) && tasks.map((task) => (
            <div key={task.id} className={styles.taskCard}>
              <p>
                <MathText type="secondary">{task.title || 'Название отсутствует'}</MathText>
              </p>
              <BlockMath>{task.view || 'Содержание отсутствует'}</BlockMath>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.addTopicForm}>
          <h2 className={styles.formTitle}>Добавить новую тему</h2>
          <div className={styles.inputRow}>
            <input
              type="text"
              placeholder="Название темы"
              value={newTopic.name}
              onChange={(e) => {
                const name = e.target.value;
                setNewTopic({ name, section_name: name }); // Устанавливаем одинаковое значение для name и section_name
              }}
            />
          </div>
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.saveButton}
              onClick={() => {
                handleAddTopic().catch((error) => {
                  console.error('Ошибка при добавлении темы:', error);
                });
              }}
            >
              Сохранить
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => {
                setIsAddingTopic(false);
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </Page>
  );
};
