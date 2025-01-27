import { FC } from 'react';
import { Link } from 'react-router-dom';
import { IntegrationCreation } from '../components';

import s from './MainPage.module.scss';

const MainPage: FC = () => {
  return (
    <main className={s.page}>
      <Link to={'/tasks'}>Tasks</Link>
      <IntegrationCreation/>
    </main>
  );
};

export default MainPage;