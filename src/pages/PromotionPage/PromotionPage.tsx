import React from 'react';
import subscribersIcon from '../../assets/icons/subscribers.svg';
import clanRed from '../../assets/icons/clanRed.svg';
import coin from '../../assets/icons/coin.svg';
import { DevelopmentPlan, IncreaseIncome, TopInfluencers } from '../../components';

import s from './PromotionPage.module.scss';
import { useGetCurrentUserProfileInfoQuery, useGetTopProfilesQuery, useGetUsersCountQuery } from '../../redux';

export const PromotionPage: React.FC = () => {
  
  const { data: userProfileData, error: userError, isLoading: isUserLoading } = useGetCurrentUserProfileInfoQuery();

  const { data: topProfilesData, error: topProfilesError, isLoading: isTopProfilesLoading } = useGetTopProfilesQuery();

  const {data: usersCountData} = useGetUsersCountQuery();

  const userPosition = userProfileData && topProfilesData?.profiles
    ? topProfilesData.profiles.findIndex((profile: { id: string; }) => profile.id === userProfileData.id)
    : -1;


  const position = userPosition !== -1 ? userPosition + 1 : topProfilesData?.profiles.length!;

  return (
    <>
      {(isTopProfilesLoading || isUserLoading) && <p>Загрузка...</p>}

      {(userError || topProfilesError) && <p>Ошибка при загрузке страницы</p>}

      {(userProfileData && topProfilesData) &&
        <main className={s.page}>
          <section className={s.topSection}>
            <h1 className={s.pageTitle}>Продвижение</h1>
            <div className={s.badges}>
              <span className={s.badge}>{`#${position}`} <img src={clanRed} height={14} width={14} alt={'income'} /></span>
              <span className={s.badge}>+440 <img src={subscribersIcon} height={14} width={14}
                alt={'subscribers'} /></span>
              <span className={s.badge}>+1 <img src={coin} height={14} width={14}
                alt={'coin'} />/сек.</span>
            </div>
            <IncreaseIncome />
            <TopInfluencers />
            {usersCountData && <DevelopmentPlan usersCount={usersCountData.players} />}
          </section>
        </main>}
    </>
  );
};