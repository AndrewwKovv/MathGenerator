import { type FC } from 'react';
import { Page } from 'widgets';

import styles from './themes.module.scss';

export const ThemesPage: FC = () => {
  return (
    <Page className={styles.wrapper}>
      <h1>Темы</h1>
      <p>Здесь будет отображаться список тем.</p>
    </Page>
  );
};
