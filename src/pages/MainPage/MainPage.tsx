import { FC } from 'react';
import { IntegrationCreation } from '../../components';

import s from './MainPage.module.scss';

export const MainPage: FC = () => {
  return (
    <main className={s.page}>
      <div style={{width: '100%', height: 200, backgroundColor: 'red'}}></div>
      <div style={{width: '100%', height: 200, backgroundColor: 'red'}}></div>
      <div style={{width: '100%', height: 200, backgroundColor: 'red'}}></div>
      <IntegrationCreation />
    </main>
  );
};
