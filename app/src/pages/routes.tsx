import { type FC } from 'react';
import { type RouteObject, useRoutes, Navigate } from 'react-router-dom';

import { PATHS } from 'config';
import { useAuth } from 'shared/context/authContext';

import { RegisterPage } from './register';
import { ProfessorPage } from './professor';
import { StudentPage } from './student';
import { Option } from './option';
import { QRPage } from './qr';
import { AboutPage } from './about';
import { LoginPage } from './login';
import { TasksPage } from './tasks';
import { VariantsPage } from './variants';
import { MyAnswersPage } from './myAnswers';
import { GetVariantPage } from './getVariant';
import { ThemesPage } from './themes';
import { AddTaksPage } from './addTask';
import { ProfilePage } from './profile';
import { TaskPage } from './taks';
import { TaskStatusPage } from './taskStatus';

export const AppRouter: FC = () => {
  const { user } = useAuth();

  const routes: RouteObject[] = [
    {
      path: PATHS.HOME,
      element: user ? <VariantsPage /> : <Navigate to={PATHS.STUDENT} replace />
    },
    {
      path: PATHS.STUDENT,
      element: user ? <Navigate to={PATHS.HOME} replace /> : <StudentPage />
    },
    {
      path: PATHS.LOGIN,
      element: user ? <Navigate to={PATHS.HOME} replace /> : <LoginPage />
    },
    {
      path: PATHS.REGISTER,
      element: user ? <Navigate to={PATHS.HOME} replace /> : <RegisterPage />
    },
    {
      path: PATHS.PROFESSOR_OPTION,
      element: user ? <ProfessorPage /> : <Navigate to={PATHS.LOGIN} replace />
    },
    {
      path: PATHS.STUDENT_OPTION,
      element: user ? <StudentPage /> : <Navigate to={PATHS.LOGIN} replace />
    },
    {
      path: PATHS.ABOUT,
      element: <AboutPage />
    },
    {
      path: PATHS.OPTION,
      element: <Option />
    },
    {
      path: PATHS.QR,
      element: user ? <QRPage /> : <Navigate to={PATHS.LOGIN} replace />
    },
    {
      path: PATHS.MY_ANSWERS,
      element: user ? <MyAnswersPage /> : <Navigate to={PATHS.LOGIN} replace />
    },
    {
      path: PATHS.GET_VARIANT,
      element: user ? <GetVariantPage /> : <Navigate to={PATHS.LOGIN} replace />
    },
    {
      path: PATHS.PROFILE,
      element: user ? <ProfilePage /> : <Navigate to={PATHS.LOGIN} replace />
    },
    {
      path: PATHS.TASKS,
      element: user ? <TasksPage /> : <Navigate to={PATHS.LOGIN} replace />
    },
    {
      path: PATHS.THEMES,
      element: user?.role === 'teacher' ? <ThemesPage /> : <Navigate to={PATHS.LOGIN} replace />
    },
    {
      path: PATHS.ADD_TASK,
      element: user?.role === 'teacher' ? <AddTaksPage /> : <Navigate to={PATHS.LOGIN} replace />
    },
    {
      path: PATHS.TASK_STATUS,
      element: user?.role === 'teacher' ? <TaskStatusPage /> : <Navigate to={PATHS.LOGIN} replace />
    },
    {
      path: PATHS.TASK,
      element: user?.role === 'teacher' ? <TaskPage /> : <Navigate to={PATHS.LOGIN} replace />
    }
  ];

  return useRoutes(routes);
};
