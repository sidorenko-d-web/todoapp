import { FC, useEffect, useMemo } from 'react';
import subscribersIcon from '../../assets/icons/subscribers.png';
import coinIcon from '../../assets/icons/coin.png';

import s from './TasksPage.module.scss';
import { DailyTasks, SocialTasks, TopTasks } from '../../components';
import { formatAbbreviation } from '../../helpers';
import { useGetTasksQuery } from '../../redux/api/tasks';
import { useGetBoostQuery } from '../../redux/api/tasks/api';

export const TasksPage: FC = () => {
  const { data, error, isLoading } = useGetTasksQuery({ is_actual: true });
  const { data: boostData } = useGetBoostQuery();

  const dailyTask = useMemo(() => {
    if (!data?.assignments) return null;
    const dailyTasks = data.assignments.filter(task => task.category === 'daily');
    return dailyTasks[dailyTasks.length - 1];
  }, [data]);

  const topTask = useMemo(() => {
    if (!data?.assignments) return null;
    return data.assignments.find(task => task.category === 'create_channel');
  }, [data]);

  const socialTasks = useMemo(() => {
    if (!data?.assignments) return [];
    return data.assignments.filter(task => task.category === 'subscribe');
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
          <span className={s.badge}>
            +{formatAbbreviation(boostData?.subscribers || 0)} 
            <img src={subscribersIcon} height={14} width={14} alt={'subscribers'} />
          </span>
          <span className={s.badge}>
            +{formatAbbreviation(Number(boostData?.views) || 0)} 
            <img src={coinIcon} height={14} width={14} alt={'income'} />
          </span>
          <span className={s.badge}>
            +{formatAbbreviation(Number(boostData?.income_per_second) || 0)} 
            <img src={coinIcon} height={14} width={14} alt={'income'} />/сек.
          </span>
        </div>
      </section>

      {dailyTask && <DailyTasks task={dailyTask} />}
      {topTask && <TopTasks task={topTask} />}
      {socialTasks.length > 0 && <SocialTasks tasks={socialTasks} />}
    </main>
  );
};