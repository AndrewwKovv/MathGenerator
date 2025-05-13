import { type FC } from 'react';
import { Page } from 'widgets';
import { Button } from 'antd';
import { PATHS } from 'config';
import { useNavigate } from 'react-router-dom';

import styles from './task.module.scss';

export const TaskPage: FC = () => {
  const navigate = useNavigate();

  const handleAddTaskClick = () => {
    navigate(PATHS.ADD_TASK);
  };

  return (
    <Page className={styles.wrapper}>
      <h1>Задания</h1>
      <p>Здесь будет отображаться список заданий.</p>
      <Button type="primary" onClick={handleAddTaskClick}>
        Добавить задание
      </Button>
    </Page>
  );
};
