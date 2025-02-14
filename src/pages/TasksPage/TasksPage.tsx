import { FC, useEffect } from 'react';
import subscribersIcon from '../../assets/icons/subscribers.png';
import coinIcon from '../../assets/icons/coin.png';

import s from './TasksPage.module.scss';
import { DailyTasks, SocialTasks, TopTasks } from '../../components';
import { formatAbbreviation } from '../../helpers';
import { useGetTasksQuery } from '../../redux/api/tasks';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../hooks';
import { MODALS } from '../../constants';
import { EnterEmailModal } from '../../components/promotion/Modal/ConfirmEmail/EnterEmailModal';
import { ConfirmationCodeModal } from '../../components/promotion/Modal/ConfirmEmail/ConfirmationCodeModal/ConfirmationCodeModal';


export const TasksPage: FC = () => {
  const { t, i18n } = useTranslation('quests');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  const {openModal, closeModal} = useModal();

  useEffect(() => {
    console.log('aaa')
    openModal(MODALS.EMAIL_CONFIRMATION_CODE);
  }, [])

  const { data, error, isLoading } = useGetTasksQuery();
  
  console.log('Состояние запроса:', {
    data,
    error,
    isLoading
  });

  if (isLoading) {
    return <div>{t('q16')}...</div>;
  }

  if (error) {
    return <div>{t('q17')}</div>;
  }

  return (
    <>
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
    <EnterEmailModal onClose={() => closeModal(MODALS.ENTER_EMAIL)}/>
    <ConfirmationCodeModal onClose={() => closeModal(MODALS.EMAIL_CONFIRMATION_CODE)} email='email@examole.com'/>
    </>
  );
};