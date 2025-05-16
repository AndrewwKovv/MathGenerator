import { Input } from 'antd';
import { type FC, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SHA512 } from 'crypto-js';

import { decodeTasks } from 'store/utils';
import { studentActions } from 'store/student';
import { useAuth } from 'shared/context/authContext';
import { Button } from 'shared/components';
import { PATHS } from 'config';
import { Page } from 'widgets/page';

import styles from './getVariant.module.scss';

export const GetVariantPage: FC = () => {
  const { user } = useAuth(); // Получаем данные пользователя из сессии
  const [hash, setHash] = useState('');
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Формируем строку ФИО + группа
      const fullNameWithGroup = `${user.full_name} ${String(user.group?.name)}`.trim();
      setName(fullNameWithGroup);
    }
  }, [user]);

  const handleClick = () => {
    const hashedName = SHA512(name).toString(); // Генерируем userHash
    const decodedTasks = decodeTasks(hash); // Декодируем задания из кода варианта
    if (decodedTasks.length > 0) {
      dispatch(
        studentActions.addInfo({
          hash,
          name,
          userHash: hashedName,
          tasks: decodedTasks
        })
      );
      navigate(PATHS.OPTION); // Переход на страницу с вариантом
    } else {
      alert('Неверный код варианта');
    }
  };

  const isButtonDisabled = !hash;

  return (
    <Page className={styles.wrapper}>
      <h1 className={styles.title}>Получить вариант</h1>
      <p className={styles.description}>
        Введите код варианта, полученный от преподавателя.
      </p>
      <div className={styles.inputContainer}>
        <Input
          className={styles.input}
          type="text"
          value={hash}
          onChange={(e) => {
            setHash(e.target.value);
          }}
          placeholder="Введите код варианта"
        />
        <Button
          type="primary"
          onClick={handleClick}
          disabled={isButtonDisabled}
          className={styles.button}
        >
          Получить вариант
        </Button>
      </div>
    </Page>
  );
};
