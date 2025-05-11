import { type FC, useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { Page } from 'widgets';
import { getAnswers } from 'shared/api/answersApi';
import { type Answer, type Task } from './types';

import styles from './myAnswers.module.scss';

export const MyAnswersPage: FC = () => {
  const [answers, setAnswers] = useState<Answer[]>([]); // Список ответов
  const [tasks, setTasks] = useState<Task[]>([]); // Список заданий выбранного ответа

  useEffect(() => {
    // Получение списка решенных вариантов
    const fetchAnswers = async () => {
      try {
        const data = await getAnswers();
        setAnswers(data); // Устанавливаем ответы
      } catch (error) {
        console.error('Ошибка при загрузке ответов:', error);
      }
    };
    void fetchAnswers();
  }, []);

  const handleAnswerClick = (tasks: Task[]) => {
    setTasks(tasks); // Устанавливаем задания выбранного ответа
  };

  return (
    <Page className={styles.wrapper}>
      <h1 className={styles.title}>Мои решения</h1>
      <Carousel className={styles.carousel} dots={false} slidesToShow={4}>
        {answers.map((answer) => (
          <div
            key={answer.id}
            className={styles.card}
            role="button" // Добавлено для доступности
            tabIndex={0} // Добавлено для доступности
            onClick={() => {
              handleAnswerClick(answer.tasks);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleAnswerClick(answer.tasks);
              }
            }}
          >
            <h3>
              Вариант №
              <br />
              {answer.variant_code}
            </h3>
            <p>
              {answer.variant_title}
            </p>
          </div>
        ))}
      </Carousel>
      <div className={styles.divider} />
      <Carousel className={styles.tasksCarousel} vertical dots={false}>
        {tasks.map((task) => (
          <div key={task.id} className={styles.taskCard}>
            <h3>
              {task.title}
            </h3>
            <p>
              {task.data_task}
            </p>
            <p className={styles.userAnswer}>
              Ответ:
              <br />
              {task.user_answer}
            </p>
          </div>
        ))}
      </Carousel>
    </Page>
  );
};
