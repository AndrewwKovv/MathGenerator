import { type FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Carousel, Button } from 'antd';
import { Page } from 'widgets';
import { MathText } from 'shared/components';
import { BlockMath } from 'react-katex';
import { Parser } from 'core';
import styles from './myAnswers.module.scss';

interface TaskAnswer {
  taskId: number
  title: string
  data_task: string
  answerText: string
}

export const MyAnswersPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [taskAnswers, setTaskAnswers] = useState<TaskAnswer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const queryParams = new URLSearchParams(location.search);
  const hashCode = queryParams.get('hash_code');
  const userId = queryParams.get('user_id');

  useEffect(() => {
    const fetchTaskAnswers = async () => {
      setLoading(true);
      try {
        const data: TaskAnswer[] = [
          {
            taskId: 1,
            title: 'Метод замены переменной',
            data_task: '\\int{sin(4x)}dx',
            answerText: 'cos2x'
          },
          {
            taskId: 1,
            title: 'Метод замены переменной',
            data_task: '\\int{sin(10)}dx',
            answerText: '1'
          },
          {
            taskId: 4,
            title: 'Интегрирование рациональных дробей',
            data_task: '\\int\\frac{{(x + [@|even]})dx}{x^[2:10] + [@|even]x + [@|even]}',
            answerText: '2'
          },
          {
            taskId: 4,
            title: 'Интегрирование рациональных дробей',
            data_task: '\\int\\frac{{(x + [@|even]})dx}{x^[2:10] + [@|even]x + [@|even]}',
            answerText: '3'
          },
          {
            taskId: 4,
            title: 'Интегрирование рациональных дробей',
            data_task: '\\int\\frac{{(x + [@|even]})dx}{x^[2:10] + [@|even]x + [@|even]}',
            answerText: '4'
          },
          {
            taskId: 5,
            title: 'Универсальная Тригонометрическая подстановка',
            data_task: '\\int\\frac{dx}{[@|odd]sinx + [@|even]cosx + [@|aboveZero]}',
            answerText: '5'
          }
        ];
        setTaskAnswers(data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchTaskAnswers();
  }, [hashCode, userId]);

  if (loading) {
    return <Page className={styles.wrapper}>Загрузка...</Page>;
  }

  if (taskAnswers.length === 0) {
    return (
      <Page className={styles.wrapper}>
        <h1 className={styles.title}>Мои решения</h1>
        <p className={styles.noAnswers}>У вас пока нет решений.</p>
        {hashCode && userId && (
          <Button onClick={() => { navigate(-1); }}>Назад</Button>
        )}
      </Page>
    );
  }

  return (
    <Page className={styles.wrapper}>
      <h1 className={styles.title}>Решение</h1>
      {hashCode && userId && (
        <Button onClick={() => { navigate(-1); }} className={styles.backButton}>
          Назад
        </Button>
      )}
      <div className={styles.tasksCarousel}>
        {taskAnswers.map((taskAnswer) => (
          <div key={taskAnswer.taskId} className={styles.taskCard}>
            <div className={styles.taskHeader}>
              <MathText type="secondary">
                {`${taskAnswer.title}`}
              </MathText>
            </div>
            <div className={styles.taskTitle}>
              <div className={styles.taskContent}>
                <BlockMath>
                  {Parser.parse(taskAnswer.data_task, '', taskAnswer.taskId * 10)}
                </BlockMath>
              </div>
              <div className={styles.taskFooter}>
                <p className={styles.answer}>
                  {taskAnswer.answerText}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.downloadContainer}>
        <Button className={styles.downloadButton}>
          Скачать
        </Button>
      </div>
    </Page>
  );
};
