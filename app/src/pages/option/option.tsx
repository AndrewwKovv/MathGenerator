import { type FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import { useSelector } from 'react-redux';
import { Input, Button, Modal, Upload, message, List } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';

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
import {
  getGeneratedTaskIdByHash,
  submitTaskAnswers,
  uploadImage,
  getImagesByHash
} from 'shared/api/optionApi';
import { TASKS } from './constants';
import styles from './option.module.scss';

export const Option: FC = () => {
  const name = useSelector(studentNameSelector);
  const hash = useSelector(studentHashSelector);
  const userHash = useSelector(studentUserHashSelector);
  const tasks = useSelector(studentTasksSelector);

  const [generatedTaskId, setGeneratedTaskId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [userHashLocal, setUserHashLocal] = useState<string>(userHash ?? '');

  // Инициализация пустых ответов
  useEffect(() => {
    const initialAnswers: Record<string, string> = {};
    tasks?.forEach(({ id, amount }) => {
      for (let i = 0; i < amount; i++) {
        const key = `${id}-${i}`;
        initialAnswers[key] = '';
      }
    });
    setAnswers(initialAnswers);
  }, [tasks]);

  // Получение информации о варианте по hash
  useEffect(() => {
    const fetchGeneratedTaskInfo = async () => {
      if (!hash) return;
      try {
        const data = await getGeneratedTaskIdByHash(hash);
        if (data?.id) {
          setGeneratedTaskId(data.id);

          const isStudent = true; // при необходимости — проверь через auth
          const isCreator = data.creator?.full_name === name;

          if (isStudent && isCreator && data.training_key) {
            setUserHashLocal(String(userHash) + String(data.training_key));
          }
        } else {
          console.error('Вариант с указанным hash не найден.');
        }
      } catch (error) {
        console.error('Ошибка при получении информации о варианте:', error);
      }
    };

    void fetchGeneratedTaskInfo();
  }, [hash, userHash, name]);

  // Получение загруженных изображений
  useEffect(() => {
    const fetchUploadedImages = async () => {
      if (!hash) return;
      try {
        const images = await getImagesByHash(hash);
        setUploadedImages(images);
      } catch (error) {
        console.error('Ошибка при загрузке изображений:', error);
      }
    };
    void fetchUploadedImages();
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

    const taskAnswers = Object.entries(answers).map(([uniqueKey, answerText]) => {
      const [taskId] = uniqueKey.split('-');
      return {
        taskId: Number(taskId),
        answerText: answerText.trim() || '-'
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
          await submitTaskAnswers(generatedTaskId, name, taskAnswers);
          alert('Ответы успешно отправлены!');
        }
      });
    } else {
      await submitTaskAnswers(generatedTaskId, name, taskAnswers);
      alert('Ответы успешно отправлены!');
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!hash) {
      void message.error('Не удалось определить hash пользователя');
      return false;
    }
    try {
      await uploadImage(file, hash);
      void message.success(`${file.name} успешно загружен`);
      setUploadedImages((prev) => [...prev, file.name]);
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      void message.error(`Ошибка при загрузке ${file.name}`);
    }
    return false;
  };

  return (
    <Page className={styles.page}>
      <div className={styles.header}>
        <p className={styles.user}>{name}</p>
      </div>

      <ol className={styles.list}>
        {tasks.map(({ id, amount }, index) => {
          const taskVariants = new Array<ITask>(amount).fill(
            TASKS.find(({ id: taskId }) => taskId === id)!
          );

          return taskVariants.map((task, taskIndex) => {
            const uniqueKey = `${task.id}-${taskIndex}`;

            return (
              <li key={uniqueKey} className={styles.listItem}>
                {task ? (
                  <>
                    <MathText type="secondary">{task.name}</MathText>
                    <div className={styles.taskList}>
                      <BlockMath>
                        {Parser.parse(task.template, userHashLocal, index * 10 + taskIndex)}
                      </BlockMath>
                      <Input
                        className={styles.answerInput}
                        placeholder="Введите ваш ответ"
                        value={answers[uniqueKey] || ''}
                        onChange={(e) => {
                          handleAnswerChange(uniqueKey, e.target.value);
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

        <Upload
          beforeUpload={async (file) => {
            await handleImageUpload(file);
            return false;
          }}
          showUploadList={false}
          multiple={false}
        >
          <Button icon={<UploadOutlined />}>Загрузить изображение</Button>
        </Upload>
      </div>

      {uploadedImages.length > 0 && (
        <List
          header="Загруженные изображения"
          bordered
          dataSource={uploadedImages}
          renderItem={(item) => <List.Item>{item}</List.Item>}
          className={styles.uploadedImageList}
        />
      )}

      <p className={styles.hash}>
        Код варианта:
        <strong>{hash}</strong>
      </p>
    </Page>
  );
};
