import { FC, useEffect } from 'react';
import subscribersIcon from '../../assets/icons/subscribers.png';
import coinIcon from '../../assets/icons/coin.png';

import s from './TasksPage.module.scss';
import { DailyTasks, SocialTasks, TopTasks } from '../../components';
import { formatAbbreviation } from '../../helpers';
import { useGetTasksQuery } from '../../redux/api/tasks';
import { useGetBoostQuery } from '../../redux/api/tasks/api';

export const TasksPage: FC = () => {
  const { data, error, isLoading } = useGetTasksQuery();
  const { data: boostData } = useGetBoostQuery();
  
  useEffect(() => {
    const dailyTasks = data?.assignments.filter(task => task.category === 'daily');
    console.log('Все задания:', data?.assignments);
    console.log('Ежедневные задания:', dailyTasks);
  }, [data]);

  useEffect(() => {
    if (boostData) {
      console.log('Boost Data:', boostData);
    }
    if (error) {
      console.error('Error fetching boost data:', error);
    }
  }, [boostData, error]);

  console.log('Состояние запроса:', {
    data,
    error,
    isLoading
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Произошла ошибка при загрузке заданий</div>;
  }

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