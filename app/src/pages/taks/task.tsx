import { type FC, useEffect, useState } from 'react';
import { Page } from 'widgets';
import { Button, Input, List, Modal, Select } from 'antd';
import { PATHS } from 'config';
import { useNavigate } from 'react-router-dom';
import { getTasks, deleteTask, updateTask } from 'shared/api/tasksApi';
import { MathText } from 'shared/components';
import { BlockMath } from 'react-katex';
import { type Task } from './types';

import styles from './task.module.scss';

export const TaskPage: FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Ошибка при загрузке заданий:', error);
      }
    };

    void fetchTasks();
  }, []);

  const handleAddTaskClick = () => {
    navigate(PATHS.ADD_TASK);
  };

  const handleDeleteTask = (taskId: number) => {
    Modal.confirm({
      title: 'Вы уверены, что хотите удалить задание?',
      content: 'Это действие нельзя будет отменить.',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await deleteTask(taskId);
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        } catch (error) {
          console.error('Ошибка при удалении задания:', error);
        }
      }
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleSaveEdit = async () => {
    if (editingTask) {
      try {
        const updatedTask = await updateTask(editingTask.id, editingTask);
        setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
        setEditingTask(null);
      } catch (error) {
        console.error('Ошибка при сохранении задания:', error);
      }
    }
  };

  const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Page className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Список заданий</h1>
      <div className={styles.header}>
        <Button className={styles.buttonPrimary} onClick={handleAddTaskClick}>
          Добавить задание
        </Button>
        <Input
          placeholder="Поиск по названию"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          className={styles.search}
        />
      </div>
      <List
        className={styles.list}
        dataSource={filteredTasks}
        renderItem={(task) => (
          <List.Item className={styles.listItem}>
            <div className={styles.taskCard}>
              <MathText type="secondary">{task.title}</MathText>
              <div className={styles.taskTitle}>
                <BlockMath>{task.view}</BlockMath>
                <div className={styles.taskActions}>
                  <Button
                    onClick={() => {
                      handleEditTask(task);
                    }}
                    className={styles.buttonPrimary}
                  >
                    ↓
                  </Button>
                  <Button
                    className={styles.buttonDanger}
                    onClick={() => {
                      handleDeleteTask(task.id);
                    }}
                  >
                    ✕
                  </Button>
                </div>
              </div>
              {editingTask?.id === task.id && (
                <div className={styles.editForm}>
                  <div className={styles.editRow}>
                    <Input
                      className={styles.editInput}
                      value={editingTask.title}
                      onChange={(e) => {
                        setEditingTask({ ...editingTask, title: e.target.value });
                      }}
                      placeholder="Название задания"
                    />
                    <Select
                      className={styles.editSelect}
                      mode="multiple"
                      value={editingTask.topics.map((topic) => topic.id)}
                      onChange={(values) => {
                        setEditingTask({
                          ...editingTask,
                          topics: values.map((id) => ({
                            id,
                            name: '',
                            section_name: ''
                          }))
                        });
                      }}
                      options={Array.from(
                        new Map(
                          tasks
                            .flatMap((t) => t.topics)
                            .map((topic) => [topic.id, { value: topic.id, label: topic.section_name }])
                        ).values()
                      )}
                      placeholder="Выберите тему"
                    />
                  </div>
                  <Input.TextArea
                    className={styles.editTextarea}
                    value={editingTask.view}
                    onChange={(e) => {
                      setEditingTask({ ...editingTask, view: e.target.value });
                    }}
                    placeholder="Отображение задания"
                  />
                  <Input.TextArea
                    className={styles.editTextarea}
                    value={editingTask.view}
                    onChange={(e) => {
                      setEditingTask({ ...editingTask, view: e.target.value });
                    }}
                    placeholder="Математическое представление"
                  />
                  <div className={styles.editButtons}>
                    <Button
                      className={styles.buttonPrimary}
                      onClick={() => {
                        void handleSaveEdit();
                      }}
                    >
                      Сохранить
                    </Button>
                    <Button className={styles.buttonDanger} danger onClick={handleCancelEdit}>Отменить</Button>
                  </div>
                </div>
              )}
            </div>
          </List.Item>
        )}
      />
    </Page>
  );
};
