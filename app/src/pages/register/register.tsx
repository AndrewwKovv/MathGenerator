import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'config';
import { apiRegister } from 'shared/api/authApi';
import { Header } from 'widgets/header';

import styles from './register.module.scss';

export const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      await apiRegister({ email, password, full_name: fullName });
      navigate(PATHS.LOGIN); // Перенаправление на страницу логина после успешной регистрации
    } catch {
      setError('Пользователь уже существует');
    }
  };

  return (
    <>
      <Header />
      <div className={styles.register}>
        <div className={styles.register__container}>
          <div className={styles.register__left}>
            <h2 className={styles.register__title}>Регистрация</h2>
            <form
              onSubmit={(e) => {
                void handleRegister(e);
              }}
              className={styles.form}
            >
              {error && <p className={styles.register__error}>{error}</p>}
              <input
                type="text"
                placeholder="ФИО"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
                className={styles.register__input}
              />
              <input
                type="email"
                placeholder="Почта"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className={styles.register__input}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className={styles.register__input}
              />
              <input
                type="password"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                className={styles.register__input}
              />
              <button type="submit" className={styles.register__button}>
                Зарегистрироваться
              </button>
            </form>
          </div>
          <div className={styles.register__right}>
            <h2 className={styles.register__title}>Уже есть аккаунт?</h2>
            <button
              type="button"
              onClick={() => {
                navigate(PATHS.LOGIN);
              }}
              className={styles.register__loginButton}
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
