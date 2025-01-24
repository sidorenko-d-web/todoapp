import React from 'react';
import subscribersIcon from '../../assets/icons/subscribers.svg';
import coinIcon from '../../assets/icons/coin.svg';

import s from './TasksPage.module.scss';
import { DailyTasks, SocialTasks, TopTasks } from '../../components';

const TasksPage: React.FC = () => {
  return (
    <main className={s.page}>
      <section className={s.topSection}>
        <h1 className={s.pageTitle}>Задания</h1>
        <div className={s.badges}>
          <span className={s.badge}>+100 <img src={coinIcon} height={14} width={14} alt={'income'} />/сек.</span>
          <span className={s.badge}>+150 <img src={subscribersIcon} height={14} width={14}
                                              alt={'subscribers'} />/сек.</span>
        </div>
      </section>

      <DailyTasks/>
      <TopTasks/>
      <SocialTasks/>
    </main>
  );
};

export default TasksPage;