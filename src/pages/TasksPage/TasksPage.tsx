import { FC } from 'react';
import subscribersIcon from '../../assets/icons/subscribers.png';
import coinIcon from '../../assets/icons/coin.png';

import s from './TasksPage.module.scss';
import { DailyTasks, SocialTasks, TopTasks } from '../../components';
import { formatAbbreviation } from '../../helpers';
import { useGetTasksQuery } from '../../redux/api/tasks';
import { useTranslation } from 'react-i18next';

export const TasksPage: FC = () => {
  const { t, i18n } = useTranslation('quests');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  const { data, error, isLoading } = useGetTasksQuery();
  
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
        <h1 className={s.pageTitle}>{t('q1')}</h1>
        <div className={s.badges}>
          <span className={s.badge}>+{formatAbbreviation(100, 'number', {locale: locale})} <img src={subscribersIcon} height={14} width={14}
                                              alt={'subscribers'} /></span>
          <span className={s.badge}>+{formatAbbreviation(150, 'number', {locale: locale})} <img src={coinIcon} height={14} width={14} alt={'income'} /></span>
          <span className={s.badge}>+{formatAbbreviation(1, 'number', {locale: locale})} <img src={coinIcon} height={14} width={14} alt={'income'} />/{t('q9')}</span>
        </div>
      </section>

      <DailyTasks />
      <TopTasks />
      <SocialTasks />
    </main>
  );
};