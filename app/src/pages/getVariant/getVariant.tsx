import { Input } from 'antd';
import { type FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { studentActions } from 'store/student';
import { useAuth } from 'shared/context/authContext';
import { PATHS } from 'config';

import { Button } from 'shared/components';
import { Header } from 'widgets/header';
import styles from './getVariant.module.scss';

export const GetVariantPage: FC = () => {
  const [variantCode, setVariantCode] = useState('');
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!variantCode) {
      alert('Введите код варианта');
      return;
    }

    // dispatch(
    //   studentActions.addInfo({
    //     hash: '', // Если требуется
    //     userHash: '', // Если требуется
    //     tasks: [] // Если требуется
    //   })
    // );

    navigate(`${PATHS.STUDENT}/${variantCode}`);
  };

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <h1>Получить вариант</h1>
        <p>Введите код варианта, чтобы получить доступ к заданиям.</p>
        <div className={styles.inputContainer}>
          <Input
            className={styles.input}
            type="text"
            value={variantCode}
            onChange={(e) => {
              setVariantCode(e.target.value);
            }}
            placeholder="Введите код варианта"
          />
          <Button
            type="primary"
            className={styles.button}
            onClick={handleClick}
          >
            Получить
          </Button>
        </div>
      </div>
    </>
  );
};
