import { type FC, useState, useEffect } from 'react';
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
  const [isBurgerOpen, setIsBurgerOpen] = useState(false); // Состояние для бургер-меню
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate(PATHS.STUDENT); // После выхода перенаправляем на страницу студента
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleBurgerMenu = () => {
    setIsBurgerOpen((prev) => !prev);
  };

  return (
    <header className={clsx(styles.header)}>
      <Container className={styles.container}>
        <div className={styles.left}>
          <Logo />
          <div
            className={styles.burger}
            onClick={toggleBurgerMenu}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleBurgerMenu();
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span />
            <span />
            <span />
          </div>
          <nav className={clsx(styles.menu, { [styles.open]: isBurgerOpen })}>
            {user?.role === 'teacher' ? (
              <>
                <Link to={PATHS.THEMES}>
                  <Button>Темы</Button>
                </Link>
                <Link to={PATHS.TASK}>
                  <Button>Задания</Button>
                </Link>
              </>
            ) : (
              <Link to={PATHS.GET_VARIANT}>
                <Button>Получить вариант</Button>
              </Link>
            )}

            {user ? ( // eslint-disable-line no-nested-ternary
              windowWidth <= 755 ? (
                <>
                  {user.role !== 'teacher' && (
                    <Link to={PATHS.MY_ANSWERS}>
                      <Button>Мои решения</Button>
                    </Link>
                  )}
                  {user.role === 'teacher' && (
                    <Link to={PATHS.TASK_STATUS}>
                      <Button>Статус выполнения</Button>
                    </Link>
                  )}
                  <Link to={PATHS.PROFILE}>
                    <Button>Настройки</Button>
                  </Link>
                  <Button onClick={handleLogout}>Выход</Button>
                </>
              ) : null
            ) : (
              <div> </div>
            )}
          </nav>
        </div>
        <div className={styles.right}>
          {user ? ( // eslint-disable-line no-nested-ternary
            windowWidth > 755 ? (
              <div className={styles.account}>
                <Button onClick={toggleDropdown}>Аккаунт</Button>
                {isDropdownOpen && (
                  <div className={styles.dropdown}>
                    {user.role !== 'teacher' && (
                      <Link to={PATHS.MY_ANSWERS}>
                        <Button>Мои решения</Button>
                      </Link>
                    )}
                    {user.role === 'teacher' && (
                      <Link to={PATHS.TASK_STATUS}>
                        <Button>Статус выполнения</Button>
                      </Link>
                    )}
                    <Link to={PATHS.PROFILE}>
                      <Button>Настройки</Button>
                    </Link>
                    <Button onClick={handleLogout}>Выход</Button>
                  </div>
                )}
              </div>
            ) : null
          ) : (
            <Link to={PATHS.LOGIN}>
              <Button>Вход</Button>
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
};
