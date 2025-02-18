import React, { useEffect } from 'react';
import subscribersIcon from '../../assets/icons/subscribers.png';
import { DevelopmentPlan, IncreaseIncome, TopInfluencers } from '../../components';

import s from './PromotionPage.module.scss';
import { useGetCurrentUserProfileInfoQuery, useGetTopProfilesQuery, useGetUsersCountQuery } from '../../redux';
import { formatAbbreviation } from '../../helpers';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setActiveFooterItemId } from '../../redux/slices/guideSlice';

export const PromotionPage: React.FC = () => {
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation('promotion');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { data: userProfileData, error: userError, isLoading: isUserLoading } = useGetCurrentUserProfileInfoQuery();

  const { data: topProfilesData, error: topProfilesError, isLoading: isTopProfilesLoading } = useGetTopProfilesQuery();
  const { data: usersCountData } = useGetUsersCountQuery();
  const userPosition = userProfileData && topProfilesData?.profiles
    ? topProfilesData.profiles.findIndex((profile: { id: string; }) => profile.id === userProfileData.id)
    : -1;

  useEffect(() => {
    dispatch(setActiveFooterItemId(3));
  }, []);

  return (
    <>
      {(isTopProfilesLoading || isUserLoading) && <p>Загрузка...</p>}

      {(userError || topProfilesError) && <p>Ошибка при загрузке страницы</p>}

      {(userProfileData && topProfilesData) &&
        <main className={s.page}>
          <section className={s.topSection}>
            <h1 className={s.pageTitle}>{t('p1')}</h1>
            <div className={s.badges}>
              {/*<span className={s.badge}>{`#${position}`} <img src={clanRed} alt={'income'} /></span>*/}
              <span className={s.badge}>+{formatAbbreviation(0, 'number', { locale: locale })} <img
                src={subscribersIcon}
                alt={'subscribers'} /></span>
            </div>
            <IncreaseIncome />
            <TopInfluencers />
            {usersCountData && <DevelopmentPlan usersCount={usersCountData.players} />}
          </section>
        </main>}
    </>
  );
};