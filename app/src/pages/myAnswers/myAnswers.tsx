import { type FC, useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { Page } from 'widgets';
import { getAnswers } from 'shared/api/answersApi';
import { MathText } from 'shared/components';
import { BlockMath } from 'react-katex';
import { type Answer, type TaskAnswer } from './types';
import styles from './myAnswers.module.scss';

export const MyAnswersPage: FC = () => {
  const [answers, setAnswers] = useState<Answer[]>([]); // Список ответов
  const [taskAnswers, setTaskAnswers] = useState<TaskAnswer[]>([]); // Ответы на задания выбранного ответа

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

  const handleAnswerClick = (taskAnswers: TaskAnswer[]) => {
    setTaskAnswers(taskAnswers); // Устанавливаем ответы на задания выбранного ответа
  };

  return (
    <Page className={styles.wrapper}>
      <h1 className={styles.title}>Мои решения</h1>
      <Carousel className={styles.carousel} dots={false} slidesToShow={4}>
        {answers.map((answer) => (
          <div
            key={answer.id}
            className={styles.card}
            role="button"
            tabIndex={0}
            onClick={() => {
              handleAnswerClick(answer.task_answers);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleAnswerClick(answer.task_answers);
              }
            }}
          >
            <div className={styles.cart__title}>
              <h3>
                Вариант №
                {answer?.generated_task?.hash_code}
              </h3>
              <p>
                {answer?.generated_task?.topic?.name || 'Без темы'}
              </p>
            </div>
          </div>
        ))}
      </Carousel>
      <div className={styles.divider} />
      <div className={styles.tasksCarousel}>
        {answers.map((answer) => (
          <div key={answer.id} className={styles.taskCard}>
            {answer.task_answers.map((taskAnswer) => (
              <div key={taskAnswer.id}>
                <p>
                  <MathText type="secondary">{taskAnswer.task.title || 'Название отсутствует'}</MathText>
                </p>
                <BlockMath>{taskAnswer.task.view || 'Содержание отсутствует'}</BlockMath>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Page>
  );
};
