import { type FC, useState } from 'react';
import { useAuth } from 'shared/context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'shared/components';
import { PATHS } from 'config';
import { Header } from 'widgets/header';
import { message } from 'antd';

import styles from './login.module.scss';

export const LoginPage: FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      void message.error('Пожалуйста, заполните все поля');
      return;
    }

    try {
      await login(email, password);
      navigate('/'); // Перенаправление на главную страницу после успешного входа
    } catch {
      setError('Неверный email или пароль');
    }
  };

  return (
    <>
      <Header />
      <div className={styles.login}>
        <div className={styles.login__container}>
          <div className={styles.login__left}>
            <h2 className={styles.login__title}>Войти</h2>
            <form
              onSubmit={(e) => {
                void handleSubmit(e);
              }}
            >
              {error && <p className={styles.error}>{error}</p>}
              <input
                type="email"
                placeholder="Почта"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className={styles.login__input}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className={styles.login__input}
              />
              <button type="submit" className={styles.login__button}>
                Войти
              </button>
            </form>
          </div>
          <div className={styles.login__right}>
            <h2 className={styles.login__title}>Нет аккаунта?</h2>
            <button
              type="button"
              onClick={() => {
                navigate(PATHS.REGISTER);
              }}
              className={styles.login__registerButton}
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
