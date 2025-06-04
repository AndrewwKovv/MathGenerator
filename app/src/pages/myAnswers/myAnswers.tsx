import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import { Button } from 'antd';
import { Page } from 'widgets';
import { MathText } from 'shared/components';
import { Parser } from 'core';
import { getAnswerByHashAndUser } from 'shared/api/answersApi';
import styles from './myAnswers.module.scss';
import { type Answer, type TaskAnswer, type Task } from './types';

export const MyAnswersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [taskAnswers, setTaskAnswers] = useState<TaskAnswer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const hashCode = 'MU4yfDROM3w1TjE=';
  const userId = '3';

  useEffect(() => {
    console.log('useEffect ran');
    const queryParams = new URLSearchParams(location.search);
    if (!hashCode || !userId) {
      console.log('Missing hashCode or userId');
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const answer = await getAnswerByHashAndUser(hashCode, userId);
        setTaskAnswers(answer.task_answers);
        setTasks(answer.generated_task.tasks);
      } catch (error) {
        console.error('Ошибка при загрузке ответа:', error);
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [location.search]);

  if (loading) return <Page className={styles.wrapper}>Загрузка...</Page>;

  if (taskAnswers.length === 0) {
    return (
      <Page className={styles.wrapper}>
        <h1 className={styles.title}>Мои решения</h1>
        <p className={styles.noAnswers}>У вас пока нет решений.</p>
        <Button onClick={() => { navigate(-1); }}>Назад</Button>
      </Page>
    );
  }

  return (
    <Page className={styles.wrapper}>
      <h1 className={styles.title}>Решение</h1>
      <Button onClick={() => { navigate(-1); }} className={styles.backButton}>Назад</Button>
      <div className={styles.tasksCarousel}>
        {tasks.map((task) => {
          // Считаем сколько ответов есть на это задание
          const answersForTask = taskAnswers.filter((a) => a.taskId === task.id);
          // Если нет вариантов - создаём минимум 1 вариант
          const variantsCount = answersForTask.length || 1;

          return (
            <div key={task.id} className={styles.taskVariantsWrapper}>
              {[...Array(variantsCount)].map((_, variantIndex) => {
                const answer = answersForTask[variantIndex] ?? { answerText: '-' };
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={`${task.id}-${variantIndex}`} className={styles.taskCard}>
                    <div className={styles.taskHeader}>
                      <MathText type="secondary">{task.title}</MathText>
                    </div>
                    <div className={styles.taskTitle}>
                      <div className={styles.taskContent}>
                        <BlockMath>{Parser.parse(task.data_task, '', variantIndex)}</BlockMath>
                      </div>
                      <div className={styles.taskFooter}>
                        Ответ:
                        <p className={styles.answer}>{answer.answerText}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </Page>
  );
};
