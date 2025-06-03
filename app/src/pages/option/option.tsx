import { type FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import { useSelector } from 'react-redux';
import { Input, Button, Modal } from 'antd';

import { Page } from 'widgets';
import { Parser } from 'core';
import {
  studentHashSelector,
  studentNameSelector,
  studentTasksSelector,
  studentUserHashSelector
} from 'store/student';
import { MathText } from 'shared/components';
import { type ITask } from 'config';
import { api } from 'shared/api/authApi';

import { TASKS } from './constants';
import styles from './option.module.scss';

export const Option: FC = () => {
  const name = useSelector(studentNameSelector);
  const hash = useSelector(studentHashSelector);
  const userHash = useSelector(studentUserHashSelector);
  const tasks = useSelector(studentTasksSelector);
  const [generatedTaskId, setGeneratedTaskId] = useState<number | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({}); // Хранение ответов пользователя

  useEffect(() => {
    // Инициализируем пустые ответы для всех заданий
    const initialAnswers: Record<string, string> = {};
    tasks?.forEach(({ id, amount }) => {
      for (let i = 0; i < amount; i++) {
        initialAnswers[id] = ''; // Устанавливаем пустую строку для каждого задания
      }
    });
    setAnswers(initialAnswers);
  }, [tasks]);

  useEffect(() => {
    const fetchGeneratedTaskId = async () => {
      try {
        if (hash) { // Проверяем, что hash не null
          const response = await api.get(`/generated/by-hash/?hash=${hash}`);
          if (response.data?.id) { // Проверяем, что в ответе есть id
            setGeneratedTaskId(response.data.id); // Сохраняем ID варианта
          } else {
            console.error('Вариант с указанным hash не найден.');
          }
        }
      } catch (error) {
        console.error('Ошибка при получении ID варианта:', error);
      }
    };
    if (hash) {
      void fetchGeneratedTaskId();
    }
  }, [hash]);

  if (!name || !hash || !userHash || !tasks) {
    return (
      <Page className={styles.page}>
        Данные по формированию варианта отсутствуют. Перейдите
        <Link to="/" className={styles.link}> на главную страницу</Link>
      </Page>
    );
  }

  const handleAnswerChange = (uniqueKey: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [uniqueKey]: value }));
  };

  const handleSubmit = async () => {
    if (!generatedTaskId) {
      alert('Не удалось определить ID варианта. Попробуйте позже.');
      return;
    }

    // Преобразуем ответы: если ответ пустой, добавляем дефолтное значение "-"
    const taskAnswers = Object.entries(answers).map(([uniqueKey, answerText]) => {
      const [taskId] = uniqueKey.split('-'); // Извлекаем taskId из уникального ключа
      return {
        taskId: Number(taskId),
        answerText: answerText.trim() || '-' // Если ответ пустой, подставляем "-"
      };
    });

    const emptyAnswers = taskAnswers.filter(({ answerText }) => answerText === '-');
    if (emptyAnswers.length > 0) {
      Modal.confirm({
        title: 'Некоторые ответы пустые',
        content: 'Пустые поля будут автоматически заполнены значением "-". Вы уверены, что хотите продолжить?',
        okText: 'Отправить',
        cancelText: 'Отмена',
        onOk: async () => {
          await submitAnswers(taskAnswers); // Отправляем ответы с заполненными пустыми полями
        }
      });
    } else {
      // Если все ответы заполнены, отправляем их
      await submitAnswers(taskAnswers);
    }
  };

  const submitAnswers = async (taskAnswers: { taskId: number, answerText: string }[]) => {
    try {
      await api.post('/answers/submit-solution/', {
        generatedTaskId: generatedTaskId, // Передаем ID варианта
        fullName: name,
        taskAnswers: taskAnswers
      });
      alert('Ответы успешно отправлены!');
    } catch (error) {
      console.error('Ошибка при отправке ответов:', error);
      alert('Не удалось отправить ответы.');
    }
  };

  return (
    <Page className={styles.page}>
      <div className={styles.header}>
        <p className={styles.user}>
          {name}
        </p>
      </div>
      <ol className={styles.list}>
        {tasks.map(({ id, amount }, index) => {
          const taskVariants = new Array<ITask>(amount).fill(
            TASKS.find(({ id: taskId }) => taskId === id)!
          );

          return taskVariants.map((task, taskIndex) => {
            const uniqueKey = `${task.id}-${index}-${taskIndex}`; // Генерируем уникальный ключ

            return (
              <li key={uniqueKey} className={styles.listItem}>
                {task ? (
                  <>
                    <MathText type="secondary">{task.name}</MathText>
                    <div className={styles.taskList}>
                      <BlockMath>
                        {Parser.parse(task.template, userHash, index * 10 + taskIndex)}
                      </BlockMath>
                      <Input
                        className={styles.answerInput}
                        placeholder="Введите ваш ответ"
                        value={answers[uniqueKey] || ''} // Используем уникальный ключ
                        onChange={(e) => {
                          handleAnswerChange(uniqueKey, e.target.value); // Передаем уникальный ключ
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <p>
                    Задания с id =
                    {' '}
                    {id}
                    {' '}
                    не существует
                  </p>
                )}
              </li>
            );
          });
        })}
      </ol>
      <div className={styles.footer}>
        <Button
          className={styles.submitButton}
          onClick={() => {
            void handleSubmit();
          }}
        >
          Отправить ответы
        </Button>
        <Button className={styles.downloadButton}>
          Загрузить ответы
        </Button>
      </div>
      <p className={styles.hash}>
        Код варианта:
        {' '}
        <strong>{hash}</strong>
      </p>
    </Page>
  );
};
