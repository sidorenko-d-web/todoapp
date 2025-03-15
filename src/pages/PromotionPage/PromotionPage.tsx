import React, { useEffect } from 'react';
import subscribersIcon from '../../assets/icons/subscribers.png';
import { DevelopmentPlan, IncreaseIncome, Loader, TopInfluencers } from '../../components';

import s from './PromotionPage.module.scss';
import {
  setActiveFooterItemId,
  useGetCurrentUsersReferralsQuery,
  useGetProfileMeQuery,
  useGetTopProfilesQuery,
  useGetUserQuery,
  useGetUsersCountQuery,
} from '../../redux';
import { formatAbbreviation } from '../../helpers';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

export const PromotionPage: React.FC = () => {
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation('promotion');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { data: userProfileData, error: userError, isLoading: isCurrentUserProfileLoading } = useGetProfileMeQuery();

  const {
    data: topProfilesData,
    error: topProfilesError,
    isLoading: isTopProfilesLoading,
  } = useGetTopProfilesQuery({});
  const { data: usersCountData, isLoading: isUsersCountLoading } = useGetUsersCountQuery();
  // const userPosition = userProfileData && topProfilesData?.profiles
  //   ? topProfilesData.profiles.findIndex((profile: { id: string; }) => profile.id === userProfileData.id)
  //   : -1;

  useEffect(() => {
    dispatch(setActiveFooterItemId(3));
  }, []);

  const { isLoading: isCurrentUsersReferralsLoading } = useGetCurrentUsersReferralsQuery();
  const { isLoading: isUserLoading } = useGetUserQuery();

  const isLoading =
    isCurrentUserProfileLoading ||
    isTopProfilesLoading ||
    isUsersCountLoading ||
    isCurrentUsersReferralsLoading ||
    isUserLoading;

  if (isLoading) return <Loader />;

  return (
    <>
      {(isTopProfilesLoading || isCurrentUserProfileLoading) && <p>Загрузка...</p>}

      {(userError || topProfilesError) && <p>Ошибка при загрузке страницы</p>}

      {userProfileData && topProfilesData && (
        <main className={s.page}>
          <section className={s.topSection}>
            <h1 className={s.pageTitle}>{t('p1')}</h1>
            <div className={s.badges}>
              {/*<span className={s.badge}>{`#${position}`} <img src={clanRed} alt={'income'} /></span>*/}
              <span className={s.badge}>
                +{formatAbbreviation(userProfileData.subscribers, 'number', { locale: locale })}{' '}
                <img src={subscribersIcon} alt={'subscribers'} />
              </span>
            </div>

            <IncreaseIncome />
            <TopInfluencers />
            {usersCountData && <DevelopmentPlan usersCount={usersCountData.players} />}
          </section>
        </main>
      )}
    </>
  );
};
