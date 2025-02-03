import { FC } from 'react';
import { IntegrationCreation } from '../../components';

import s from './MainPage.module.scss';
import { InitialGuide } from '../../components/guide/InitialGuide/InitialGuide';

export const MainPage: FC = () => {

  const showGuide = true;


  return (
    <main className={s.page}>
      <IntegrationCreation />

      {showGuide && <InitialGuide/>}
      
    </main>
  );
};
