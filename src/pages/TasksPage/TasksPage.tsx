import React from 'react';
import subscribersIcon from '../../assets/icons/subscribers.png';
import coinIcon from '../../assets/icons/coin.png';

import s from './TasksPage.module.scss';
import { DailyTasks, SocialTasks, TopTasks } from '../../components';
import { formatAbbreviation } from '../../helpers';

export const TasksPage: React.FC = () => {
  return (
    <main className={s.page}>
      <section className={s.topSection}>
        <h1 className={s.pageTitle}>Задания</h1>
        <div className={s.badges}>
          <span className={s.badge}>+{formatAbbreviation(100)} <img src={subscribersIcon} height={14} width={14}
                                              alt={'subscribers'} /></span>
          <span className={s.badge}>+{formatAbbreviation(150)} <img src={coinIcon} height={14} width={14} alt={'income'} /></span>
          <span className={s.badge}>+{formatAbbreviation(1)} <img src={coinIcon} height={14} width={14} alt={'income'} />/сек.</span>
        </div>
      </section>

      <DailyTasks />
      <TopTasks />
      <SocialTasks />
    </main>
  );
};