import { FC } from 'react';

import { Link } from 'react-router-dom';
import { IntegrationCreation } from '../components';
import { InviteFriend } from '../components';

import s from './MainPage.module.scss';

const MainPage: FC = () => {
  return (
    <main className={s.page}>
      <Link to={'/tasks'}>Tasks</Link>
      <Link to={'/promotion'}>Promotion</Link>
      <IntegrationCreation/>
      <InviteFriend/>
    </main>
  );
};

export default MainPage;