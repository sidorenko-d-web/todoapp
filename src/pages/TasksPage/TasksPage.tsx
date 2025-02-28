import { FC, useEffect, useMemo } from 'react';
import subscribersIcon from '../../assets/icons/subscribers.png';
import coinIcon from '../../assets/icons/coin.png';

import s from './TasksPage.module.scss';
import { DailyTasks, Loader, SocialTasks, TopTasks } from '../../components';
import { formatAbbreviation } from '../../helpers';
import { useGetTasksQuery } from '../../redux/api/tasks';
import { useGetBoostQuery } from '../../redux/api/tasks/api';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setActiveFooterItemId } from '../../redux/slices/guideSlice';
import GetGift from '../DevModals/GetGift/GetGift';
import { useModal } from '../../hooks';
import { MODALS } from '../../constants';

export const TasksPage: FC = () => {
  const dispatch = useDispatch();


  const { t, i18n } = useTranslation('quests');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  const { data, error, isLoading: isTasksLoading, refetch } = useGetTasksQuery({ is_actual: true });
  const { data: boostData, isLoading: isBoostLoading } = useGetBoostQuery();

  useEffect(() => {
    dispatch(setActiveFooterItemId(4));
  }, []);

  const { getModalState } = useModal();

  const isGetGiftModalOpen = getModalState(MODALS.GET_GIFT).isOpen;

  useEffect(() => {
    if (isGetGiftModalOpen) {
      //needed to re-render header when gift modal closes to update the button text
      refetch();
    }
  }, [isGetGiftModalOpen]);


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

  const isLoading = (
    isTasksLoading ||
    isBoostLoading
  );

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
            <img src={coinIcon} height={18} width={18} alt={'income'} />/сек.
          </span>
        </div>
      </section>

      {dailyTask && <DailyTasks task={dailyTask} />}
      {topTask && <TopTasks task={topTask} />}
      {socialTasks.length > 0 && <SocialTasks tasks={socialTasks} />}
      <GetGift />
    </main>
  );
};