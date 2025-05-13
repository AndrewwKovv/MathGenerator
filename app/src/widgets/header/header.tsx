import { type FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

import { Container, Logo, Button } from 'shared/components';
import { PATHS } from 'config';
import { useAuth } from 'shared/context/authContext';

import styles from './header.module.scss';

export const Header: FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Состояние для выпадающего меню

  const handleLogout = () => {
    logout();
    navigate(PATHS.STUDENT); // После выхода перенаправляем на страницу студента
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header className={clsx(styles.header)}>
      <Container className={styles.container}>
        <div className={styles.left}>
          <Logo />
          {user?.role === 'teacher' ? (
            <>
              <Link to={PATHS.THEMES}>
                <Button className={styles.themesButton}>Темы</Button>
              </Link>
              <Link to={PATHS.TASK}>
                <Button className={styles.tasksButton}>Задания</Button>
              </Link>
            </>
          ) : (
            <Link to={PATHS.GET_VARIANT}>
              <Button className={styles.variantsButton}>Получить вариант</Button>
            </Link>
          )}
          <Link to={PATHS.ABOUT}>
            <Button className={styles.aboutButton}>О программе</Button>
          </Link>
        </div>
        <div className={styles.auth}>
          {user ? (
            <div className={styles.userMenu}>
              <Button onClick={toggleDropdown} className={styles.accountButton}>
                Аккаунт
              </Button>
              {isDropdownOpen && (
                <div className={styles.dropdown}>
                  <Link to={PATHS.HOME} className={styles.dropdownItem}>
                    Настройки
                  </Link>
                  {user.role !== 'teacher' && (
                    <Link to={PATHS.MY_ANSWERS} className={styles.dropdownItem}>
                      Мои решения
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={clsx(styles.dropdownItem, styles.logoutButton)}
                  >
                    Выход
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.guestMenu}>
              <Link to={PATHS.LOGIN}>
                <Button>Вход</Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
};
