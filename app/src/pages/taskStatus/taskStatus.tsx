import { type FC, useEffect, useState } from 'react';
import { Table, Select, Typography, Spin, Tag } from 'antd';
import { format } from 'date-fns';
import { api } from 'shared/api/authApi';
import { useAuth } from 'shared/context/authContext';
import { Page } from 'widgets';
import { useNavigate } from 'react-router-dom';

import styles from './taskStatus.module.scss';
import { type Group, type Student, type TaskStatus } from './types';

const { Title } = Typography;

export const TaskStatusPage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?.role !== 'teacher') {
      return;
    }

    const fetchGroups = async () => {
      try {
        const response = await api.get<Group[]>('/group/');
        setGroups(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке групп:', error);
      }
    };

    void fetchGroups();
  }, [user]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedGroup) {
        setStudents([]);
        setSelectedStudents([]);
        return;
      }

      try {
        const response = await api.get(`/group/${selectedGroup}/`);
        const groupStudents = response.data.students;
        setStudents(groupStudents);
        setSelectedStudents(groupStudents.map((student: Student) => student.id));
      } catch (error) {
        console.error('Ошибка при загрузке студентов:', error);
      }
    };

    void fetchStudents();
  }, [selectedGroup]);

  useEffect(() => {
    const fetchTaskStatuses = async () => {
      if (selectedStudents.length === 0) {
        setTaskStatuses([]);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get('/status-task/', {
          params: {
            studentIds: selectedStudents.join(',')
          }
        });
        setTaskStatuses(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке статусов заданий:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchTaskStatuses();
  }, [selectedStudents]);

  const statusTranslations: Record<string, string> = {
    completed: 'Выполнено',
    in_progress: 'В процессе',
    not_started: 'Не начато'
  };

  const columns = [
    {
      title: 'ФИО',
      dataIndex: ['user', 'full_name'],
      key: 'full_name',
      render: (fullName: string) => fullName || '-'
    },
    {
      title: 'Группа',
      dataIndex: ['user', 'group', 'name'],
      key: 'group',
      render: () => {
        if (!selectedGroup) return '-';
        const group = groups.find((g) => g.id === selectedGroup);
        return group ? group.name : '-';
      }
    },
    {
      title: 'Вариант',
      dataIndex: ['generated_task', 'hash_code'],
      key: 'variant_code',
      render: (hashCode: string, record: TaskStatus) => {
        if (record.status === 'completed') {
          return (
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => {
                if (record.user?.id) {
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  navigate(`/my-answers?hash_code=${hashCode}&user_id=${record.user.id}`);
                } else {
                  console.error('Пользователь не найден для записи:', record);
                }
              }}
            >
              {hashCode}
            </button>
          );
        }
        return hashCode || '-';
      }
    },
    {
      title: 'Время отправки/ выполнения',
      render: (record: TaskStatus) => {
        const completedAt = record.completed_at
          ? format(new Date(record.completed_at), 'dd.MM.yyyy HH:mm')
          : '-';
        const timeSpent = record.time_spent ?? '-';

        return (
          <>
            <Tag color="red">{completedAt}</Tag>
            <Tag color="blue">{timeSpent}</Tag>
          </>
        );
      },
      key: 'time'
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => statusTranslations[status] || '-'
    }
  ];

  return (
    <Page className={styles.wrapper}>
      <h1 className={styles.title}>Работы студентов</h1>
      <div className={styles.filters}>
        <Select
          className={styles.select}
          placeholder="Выберите группу"
          options={groups.map((group) => ({
            value: group.id,
            label: group.name
          }))}
          onChange={(value) => {
            setSelectedGroup(value);
          }}
        />
        <Select
          className={styles.select}
          mode="multiple"
          placeholder="Выберите пользователей или оставьте пустым"
          options={students.map((student) => ({
            value: student.id,
            label: student.full_name
          }))}
          value={selectedStudents}
          onChange={(value) => {
            setSelectedStudents(value);
          }}
          disabled={!selectedGroup}
        />
      </div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          className={styles.table}
          dataSource={taskStatuses.filter((status) => selectedStudents.includes(status.user?.id ?? 0))}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </Page>
  );
};
