import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GetRewardChestModal from '../DevModals/GetRewardChestModal/GetRewardChestModal';
import styles from './ProfilePage.module.scss';
import { ProfileInfo, ProfileStats, ProfileStatsMini, StreakCard } from '../../components/profile';
import {
  useClaimChestRewardMutation,
  useGetInventoryAchievementsQuery,
  useGetProfileMeQuery,
  useGetPushLineQuery,
  useGetTopProfilesQuery,
} from '../../redux';
import RewardsList from '../../components/profile/RewardsCard/RewardsList';
import { getWeekData } from '../../utils';
import { useModal } from '../../hooks';
import { MODALS } from '../../constants';
import ChangeNicknameModal from '../../components/profile/ChangeNicknameModal/ChangeNicknameModal';
import { Loader } from '../../components';

export const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation('profile');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { closeModal, openModal } = useModal();
  const { data } = useGetPushLineQuery();

  const [ claimChestReward ] = useClaimChestRewardMutation();

  const {
    data: userProfileData,
    error: userError,
    isLoading: isUserLoading,
    refetch: refetchCurrentProfile,
  } = useGetProfileMeQuery();

  useEffect(() => {
    if (!userProfileData) return;
    const refetchInterval = setInterval(() => {
      refetchCurrentProfile();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refetchInterval);
  }, [ userProfileData, refetchCurrentProfile ]);


  const {
    data: topProfilesData,
    error: topProfilesError,
    isLoading: isTopProfilesLoading,
  } = useGetTopProfilesQuery();

  const [ , setIsModalShown ] = useState(false);

  const streaks = data?.week_information.filter(
    day => day.push_line_data?.status === 'passed',
  ).length;


  useEffect(() => {
    if (!sessionStorage.getItem('daysInARowModalShown')) {
      openModal(MODALS.DAYS_IN_A_ROW);
      sessionStorage.setItem('daysInARowModalShown', 'true');
      setIsModalShown(true);
    }
  }, [ openModal ]);

  useEffect(() => {
    if (streaks === 30 || streaks === 60 || streaks === 120) {
      claimChestReward({ chest_reward_reason: 'push_line' }).unwrap()
        .then(result => {
          console.log('Reward claimed:', result);
          openModal(MODALS.TASK_CHEST, {
            points: result.reward.points,
            subscribers: result.reward.subscribers,
            freezes: result.reward.freezes,
          });
        })
        .catch(err => console.error('Error claiming reward:', err));
    }
  }, [ streaks, claimChestReward, openModal ]);


  const userPosition =
    userProfileData && topProfilesData?.profiles
      ? topProfilesData.profiles.findIndex(
        (profile: { id: string }) => profile.id === userProfileData.id,
      )
      : -1;

  const position =
    userPosition !== -1 ? userPosition + 1 : topProfilesData?.profiles.length!;

  const weekInformation = data?.week_information || [];

  const streakDays = weekInformation
    .filter(day => day.push_line_data?.status === 'passed')
    .map(day => new Date(day.creation_date).getDate());

  const freezeDays = weekInformation
    .filter(day => day.push_line_data?.status === 'frozen')
    .map(day => new Date(day.creation_date).getDate());

  const weekData = getWeekData(streakDays, freezeDays);

  const { isLoading: isAwardsLoading } = useGetInventoryAchievementsQuery();

  const isLoading = (
    isUserLoading ||
    isTopProfilesLoading ||
    isAwardsLoading
  );

  if (isLoading) {
    return <Loader />;
  }

  console.log(location.pathname);

  return (
    <>

      <GetRewardChestModal onClose={() => closeModal(MODALS.TASK_CHEST)} />

      {(isUserLoading || isTopProfilesLoading) && <p>{t('p3')}</p>}

      {(userError || topProfilesError) && <p>{t('p17')}</p>}

      {userProfileData && topProfilesData && (
        <div className={styles.wrp}>
          <div>
            <h1 className={styles.pageTitle}>{t('p1')}</h1>

            <ProfileStatsMini
              position={position}
              daysInARow={streaks !== undefined ? streaks : 0}
            />
          </div>

          <ChangeNicknameModal
            modalId={MODALS.CHANGING_NICKNAME}
            onClose={() => closeModal(MODALS.CHANGING_NICKNAME)}
            currentNickname={userProfileData.username}
            currentBlogName={userProfileData.blog_name}
          />

          <div className={styles.info}>
            <ProfileInfo
              nickname={userProfileData.username}
              blogName={userProfileData.blog_name}
              subscriptionIntegrationsLeft={
                userProfileData.subscription_integrations_left
              }
              position={position}
              isVip={false}
            />
            <StreakCard
              streakDays={streaks !== undefined ? streaks : 0}
              frozenDays={userProfileData.available_freezes}
              days={weekData}
              status={locale === 'ru' ? data?.push_line_profile_status.status_name : data?.push_line_profile_status.status_name_eng}
              chest={locale === 'ru' ? data?.next_chest.chest_name : data?.next_chest.chest_name_eng}
              weekData={data?.week_information}
            />
          </div>

          <div>
            <p className={styles.statsTitle}>{t('p4')}</p>
            <ProfileStats
              favoriteCompany={'Favourite company'}
              comments={userProfileData.comments_answered_correctly}
              rewards={userProfileData.achievements_collected}
            />
          </div>

          <div>
            <p className={styles.statsTitle}>{t('p5')}</p>
            <RewardsList />
          </div>
        </div>
      )}
    </>
  );
};
