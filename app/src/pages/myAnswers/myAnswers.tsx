import { type FC, useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { Page } from 'widgets';
import { getAnswers } from 'shared/api/answersApi';
import { MathText } from 'shared/components';
import { BlockMath } from 'react-katex';
import { SHA512 } from 'crypto-js';
import { Parser } from 'core';
import { useAuth } from 'shared/context/authContext'; // Импортируем контекст авторизации
import { type Answer } from './types';
import styles from './myAnswers.module.scss';

export const MyAnswersPage: FC = () => {
  const { user } = useAuth(); // Получаем данные авторизованного пользователя
  const [answers, setAnswers] = useState<Answer[]>([]); // Список ответов
  const [selectedTaskAnswers, setSelectedTaskAnswers] = useState<Answer['task_answers']>([]); // Ответы на задания выбранного ответа
  const [loading, setLoading] = useState<boolean>(true);
  const [userHash, setUserHash] = useState<string>(''); // Хэш пользователя

  useEffect(() => {
    // Генерация userHash на основе имени пользователя и группы
    if (user) {
      const nameWithGroup = `${user.full_name} ${String(user.group?.name)}`;
      const hashedName = SHA512(nameWithGroup).toString(); // Генерируем хэш
      setUserHash(hashedName);
    }
  }, [user]);

  useEffect(() => {
    // Получение списка решенных вариантов
    const fetchAnswers = async () => {
      try {
        const data = await getAnswers();
        setAnswers(data); // Устанавливаем ответы
        if (data.length > 0) {
          setSelectedTaskAnswers(data[0].task_answers); // По умолчанию выбираем первый вариант
        }
      } catch (error) {
        console.error('Ошибка при загрузке ответов:', error);
      } finally {
        setLoading(false);
      }
    };
    void fetchAnswers();
  }, []);

  const handleAnswerClick = (taskAnswers: Answer['task_answers']) => {
    setSelectedTaskAnswers(taskAnswers); // Устанавливаем ответы на задания выбранного ответа
  };

  if (loading) {
    return <Page className={styles.wrapper}>Загрузка...</Page>;
  }

  if (answers.length === 0) {
    return (
      <Page className={styles.wrapper}>
        <h1 className={styles.title}>Мои решения</h1>
        <p className={styles.noAnswers}>У вас пока нет решений.</p>
      </Page>
    );
  }

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
              </h3>
              <p>
                {answer.generated_task_hash}
              </p>
            </div>
          </div>
        ))}
      </Carousel>
      <div className={styles.divider} />
      <div className={styles.tasksCarousel}>
        {selectedTaskAnswers.map((taskAnswer, index) => {
          const task = answers
            .flatMap((answer) => answer.task_answers)
            .find((t) => t.taskId === taskAnswer.taskId);

          if (!task) {
            return null;
          }

          const parsedTask = Parser.parse(taskAnswer.answerText, userHash, index * 10);

          return (
            <div key={taskAnswer.taskId} className={styles.taskCard}>
              <p>
                <MathText type="secondary">{`Задание ${taskAnswer.taskId}`}</MathText>
              </p>
              <BlockMath>{parsedTask}</BlockMath>
            </div>
          );
        })}
      </div>
    </Page>
  );
};
