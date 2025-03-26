import { FC, useEffect, useMemo } from 'react';
import subscribersIcon from '../../assets/icons/subscribers.png';
import coinIcon from '../../assets/icons/coin.png';

import s from './TasksPage.module.scss';
import { DailyTasks, Loader, SocialTasks } from '../../components';
import { formatAbbreviation, getPlanStageByUsersCount } from '../../helpers';
import { useGetBoostQuery, useGetTasksQuery, TaskCategory } from '../../redux/api/tasks';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setActiveFooterItemId } from '../../redux';
import GetGiftDaily from '../DevModals/GetGiftDaily/GetGiftDaily';
import { total_users } from '../../constants';

export const TasksPage: FC = () => {
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation('quests');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  // Мемоизируем параметры запросов
  const tasksQueryParams = useMemo(() => ({
    offset: 0,
    limit: 100,
  }), []);

  const dailyTasksQueryParams = useMemo(() => ({
    ...tasksQueryParams,
    is_assigned: true,
    category: 'quiz' as TaskCategory,
  }), []);

  // Используем мемоизированные параметры
  const { data, error, isLoading: isTasksLoading } = useGetTasksQuery(tasksQueryParams);
  const { data: dataDaily, isLoading: isDailyLoading } = useGetTasksQuery(dailyTasksQueryParams);
  const { data: boostData, isLoading: isBoostLoading } = useGetBoostQuery();

  useEffect(() => {
    dispatch(setActiveFooterItemId(4));
  }, []);

  const dailyTask = useMemo(() => {
    if (!data?.assignments) return null;

    const dailyTasks = dataDaily?.assignments;
    // Модифицируем задание с учетом языка
    if (dailyTasks && dailyTasks[dailyTasks.length - 1]) {
      const task = dailyTasks[dailyTasks.length - 1];

      return {
        ...task,
        title: locale === 'en' ? task.title_eng : task.title,
        description: locale === 'en' ? task.description_eng : task.description,
        external_link: locale === 'en' ? task.external_link_eng || task.external_link : task.external_link,
      };
    }
    return null;
  }, [data, locale]);

  // const topTask = useMemo(() => {
  //   if (!data?.assignments) return null;
  //   const task = data.assignments.find(task => task.category === 'create_channel');
  //   if (task) {
  //     return {
  //       ...task,
  //       title: locale === 'en' ? task.title_eng : task.title,
  //       description: locale === 'en' ? task.description_eng : task.description,
  //       external_link: locale === 'en' ? task.external_link_eng || task.external_link : task.external_link,
  //     };
  //   }
  //   return null;
  // }, [data, locale]);

  const socialTasks = useMemo(() => {
    if (!data?.assignments) return [];
    return data.assignments
      .filter(task => task.category === 'subscribe')
      .map(task => ({
        ...task,
        title: locale === 'en' ? task.title_eng : task.title,
        description: locale === 'en' ? task.description_eng : task.description,
        external_link: locale === 'en' ? task.external_link_eng || task.external_link : task.external_link,
      }));
  }, [data, locale]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching boost data:', error);
    }
  }, [boostData, error]);

  const isLoading = isTasksLoading || isBoostLoading || isDailyLoading;

  if (isLoading) return <Loader />;

  if (error) {
    return <div>{t('q17')}</div>;
  }

  return (
    <main className={s.page}>
      <section className={s.topSection}>
        <h1 className={s.pageTitle}>{t('q1')}</h1>
        <div className={s.badges}>
          <span className={s.badge}>
            +{formatAbbreviation(boostData?.subscribers || 0, 'number', { locale: locale })}
            <img src={subscribersIcon} height={18} width={18} alt={'subscribers'} />
          </span>
          <span className={s.badge}>
            +{formatAbbreviation(Number(boostData?.views) || 0, 'number', { locale: locale })}
            <img src={coinIcon} height={18} width={18} alt={'income'} />
          </span>
          <span className={s.badge}>
            +{formatAbbreviation(Number(boostData?.income_per_second) || 0, 'number', { locale: locale })}
            <img src={coinIcon} height={18} width={18} alt={'income'} />/{t('q9')}
          </span>
        </div>
      </section>

      {dailyTask && getPlanStageByUsersCount(total_users) >= 4 && <DailyTasks task={dailyTask} />}
      {/*{topTask && <TopTasks task={topTask} />}*/}
      {socialTasks.length > 0 && <SocialTasks tasks={socialTasks} />}
      <GetGiftDaily />
    </main>
  );
};
