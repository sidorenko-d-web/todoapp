import { FC } from 'react';
import { IntegrationCreation } from '../../components';

import s from './MainPage.module.scss';

export const MainPage: FC = () => {
  return (
    <main className={s.page}>
      <IntegrationCreation />
    </main>
  );
};
