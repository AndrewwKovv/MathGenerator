import { type FC, useState } from 'react';
import { Slider, Typography, message, Select, Input } from 'antd';

import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

import { type AppStateType } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import { taskActions } from 'store/task';
import { selectedTasksSelector, taskSelector } from 'store/task/selectors';

import { Page } from 'widgets';
import { PATHS, TASKS_CONFIGURATION } from 'config';
import { Button, MathText } from 'shared/components';

import { generateHash } from 'store/utils';
import { useAuth } from 'shared/context/authContext';
import { api } from 'shared/api/authApi';

import styles from './professor.module.scss';
import { type ITemplateProps } from './types';

const { Title, Text } = Typography;

export const ProfessorPage: FC = () => {
  const { user } = useAuth(); // Получаем текущего пользователя
  const tasksSelector = useSelector(selectedTasksSelector); // Получаем выбранные задания из стора
  const hash = generateHash(); // Генерируем хэш-код варианта

  const [selectedSection, setSelectedSection] = useState<string>(TASKS_CONFIGURATION[0]?.section || ''); // Выбранный раздел
  const [variantName, setVariantName] = useState<string>(''); // Название варианта

  const section = TASKS_CONFIGURATION.find((sectionItem) => sectionItem.section === selectedSection); // Найти текущий раздел
  const isTasksPicked = !tasksSelector.length;

  const handleGenerateVariant = async () => {
    if (isTasksPicked) {
      void message.error('Выберите хотя бы одно задание для генерации варианта.');
      return;
    }

    if (!variantName.trim()) {
      void message.error('Введите название варианта.');
      return;
    }

    try {
      // Отправляем данные на сервер
      await api.post('/generated/', {
        hash_code: hash, // Хэш-код варианта
        creator: user?.id, // ID пользователя, который создает вариант
        title: variantName, // Название варианта
        topic: selectedSection, // Тема варианта
        tasks: tasksSelector.map((task) => ({
          id: task.id,
          amount: task.amount
        }))
      });

      void message.success('Вариант успешно сгенерирован!');
    } catch (error) {
      console.error('Ошибка при генерации варианта:', error);
      void message.error('Не удалось сгенерировать вариант.');
    }
  };

  return (
    <Page className={styles.wrapper}>
      <Title level={2} className={styles.pageTitle}>
        Генерация заданий
      </Title>
      <div className={styles.controls}>
        <Input
          className={styles.input}
          placeholder="Введите название варианта"
          value={variantName}
          onChange={(e) => {
            setVariantName(e.target.value);
          }}
        />
        <Select
          className={styles.select}
          value={selectedSection}
          onChange={(value) => {
            setSelectedSection(value);
          }}
          options={TASKS_CONFIGURATION.map((section) => ({
            value: section.section,
            label: section.section_name
          }))}
        />
      </div>
      <div className={styles.section}>
        {section?.tasks.map((template) => (
          <Template key={template.id} template={template} />
        ))}
      </div>
      <Button
        className={styles.buttonPrimary}
        onClick={() => {
          void handleGenerateVariant();
        }}
        href={PATHS.QR}
        disabled={isTasksPicked}
      >
        Сгенерировать код варианта
      </Button>
    </Page>
  );
};

const Template: FC<ITemplateProps> = ({ template, ...props }) => {
  const dispatch = useDispatch();
  const state = useSelector((appState: AppStateType) => appState);
  const task = taskSelector(state, template.id);

  const handleChange = (newValue: number) => {
    if (newValue === 0) {
      dispatch(taskActions.removeTask({ id: template.id }));
      return;
    }
    dispatch(taskActions.editSelectedTask({
      id: template.id,
      amount: newValue
    }));
  };

  return (
    <div className={styles.template} {...props}>
      <MathText type="secondary">{template.name}</MathText>
      <div className={styles.templateContainer}>
        <BlockMath>{template.view}</BlockMath>
        <div className={styles.slider}>
          <Text className={styles.templateAmount}>{task?.amount ?? 0}</Text>
          <Slider
            className={styles.templateSlider}
            value={task?.amount}
            onChange={(newValue) => {
              handleChange(newValue);
            }}
            max={10}
          />
        </div>
      </div>
    </div>
  );
};
