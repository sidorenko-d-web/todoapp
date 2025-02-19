import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DaysInARowModal from '../DevModals/DaysInARowModal/DaysInARowModal';
import GetRewardChestModal from '../DevModals/GetRewardChestModal/GetRewardChestModal';
import styles from './ProfilePage.module.scss';
import { ProfileInfo, ProfileStats, ProfileStatsMini, StreakCard } from '../../components/profile';
import { useGetCurrentUserProfileInfoQuery, useGetTopProfilesQuery } from '../../redux';
import RewardsList from '../../components/profile/RewardsCard/RewardsList';
import { getWeekData } from '../../utils';
import { useModal } from '../../hooks';
import { MODALS } from '../../constants';
import ChangeNicknameModal from '../../components/profile/ChangeNicknameModal/ChangeNicknameModal';
import { useGetPushLineQuery } from '../../redux/api/pushLine/api';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation('profile');
  const { closeModal, openModal } = useModal();
  const { data } = useGetPushLineQuery();

  const {
    data: userProfileData,
    error: userError,
    isLoading: isUserLoading,
  } = useGetCurrentUserProfileInfoQuery();

  const {
    data: topProfilesData,
    error: topProfilesError,
    isLoading: isTopProfilesLoading,
  } = useGetTopProfilesQuery();

  const [, setIsModalShown] = useState(false);
  const frozen = data?.week_information.filter(
    day => day.status === 'unspecified',
  ).length;

  const streaks = data?.week_information.filter(
    day =>
      day.status === 'passed' &&
      (day.is_notified_at_morning ||
        day.is_notified_at_afternoon ||
        day.is_notified_at_evening ||
        day.is_notified_at_late_evening ||
        day.is_notified_at_late_night ||
        day.is_notified_at_night),
  ).length;

  useEffect(() => {
    const lastShownTimestamp = localStorage.getItem('daysInARowModalTimestamp');
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (!lastShownTimestamp || now - Number(lastShownTimestamp) > twentyFourHours) {
      openModal(MODALS.DAYS_IN_A_ROW);
      localStorage.setItem('daysInARowModalTimestamp', now.toString());
      setIsModalShown(true);
    }
  }, [ openModal ]);

  useEffect(() => {
    if (streaks === 30 || streaks === 60 || streaks === 120) {
      openModal(MODALS.TASK_CHEST);
    }
  }, [ data?.in_streak_days, openModal ]);

  const userPosition =
    userProfileData && topProfilesData?.profiles
      ? topProfilesData.profiles.findIndex(
        (profile: { id: string }) => profile.id === userProfileData.id,
      )
      : -1;

  const position =
    userPosition !== -1 ? userPosition + 1 : topProfilesData?.profiles.length!;

  const streakDays = [27, 28, 30]; // TODO: replace with real data from API
  const freezeDays = [29]; // TODO: replace with real data

  const weekData = getWeekData(streakDays, freezeDays);
  console.log(data?.week_information);
  return (
    <>
      <DaysInARowModal onClose={() => closeModal(MODALS.DAYS_IN_A_ROW)} />
      <GetRewardChestModal onClose={() => closeModal(MODALS.TASK_CHEST)} />

      {(isUserLoading || isTopProfilesLoading) && <p>{t('p3')}</p>}

      {(userError || topProfilesError) && <p>{t('p17')}</p>}

      {userProfileData && topProfilesData && (
        <div className={styles.wrp}>
          <div>
            <h1 className={styles.pageTitle}>{t('p1')}</h1>

            <ProfileStatsMini
              subscribers={userProfileData.subscribers}
              position={position}
              daysInARow={streaks !== undefined ? streaks : 0}
              totalViews={userProfileData.total_views}
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
              subscriptionIntegrationsLeft={userProfileData.subscription_integrations_left}
              position={position}
              isVip={false}
            />

            <StreakCard
              streakDays={streaks !== undefined ? streaks : 0}
              frozenDays={frozen !== undefined ? frozen : 0}
              days={weekData}
              weekData={data?.week_information}
            />
          </div>

          <div>
            <p className={styles.statsTitle}>{t('p4')}</p>
            <ProfileStats
              earned={userProfileData.total_earned}
              views={userProfileData.total_views}
              favoriteCompany={'Favourite company'}
              comments={userProfileData.comments_answered_correctly}
              rewards={12}
              coffee={5}
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
