import React, { useEffect, useMemo, useState } from 'react';
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
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { closeModal, openModal } = useModal();

  // State to track if data has been loaded initially
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Query for push line data
  const { data: pushLineData, isLoading: isPushLineLoading } = useGetPushLineQuery();

  const [claimChestReward] = useClaimChestRewardMutation();

  const { data: awardsData, isLoading: awardsLoading } = useGetInventoryAchievementsQuery();

  const {
    data: userProfileData,
    error: userError,
    isLoading: isUserLoading,
    refetch: refetchCurrentProfile,
  } = useGetProfileMeQuery();

  const {
    data: topProfilesData,
    error: topProfilesError,
    isLoading: isTopProfilesLoading,
  } = useGetTopProfilesQuery({});

  const [, setIsModalShown] = useState(false);

  // Calculate streaks reliably using useMemo to prevent unnecessary recalculations
  const streaks = useMemo(() => {
    // First priority: Check if in_streak_days exists
    if (pushLineData?.in_streak_days !== undefined && pushLineData?.in_streak_days !== null) {
      return pushLineData.in_streak_days;
    }

    // Second priority: Count passed days from week_information
    if (pushLineData?.week_information) {
      return pushLineData.week_information.filter(day => day.push_line_data?.status === 'passed').length;
    }

    // Default to 0 if no data is available
    return 0;
  }, [pushLineData]);

  // Handle one-time modal display
  useEffect(() => {
    if (!sessionStorage.getItem('daysInARowModalShown')) {
      openModal(MODALS.DAYS_IN_A_ROW);
      sessionStorage.setItem('daysInARowModalShown', 'true');
      setIsModalShown(true);
    }
  }, [openModal]);

  // Handle streak milestone rewards
  useEffect(() => {
    // Only process rewards after data is loaded and confirmed
    if (!initialDataLoaded && streaks > 0) {
      setInitialDataLoaded(true);

      // Check for reward milestones
      if (streaks === 30 || streaks === 60 || streaks === 120) {
        claimChestReward({ chest_reward_reason: 'push_line' })
          .unwrap()
          .then(result => {
            openModal(MODALS.TASK_CHEST, {
              points: result.reward.points,
              subscribers: result.reward.subscribers,
              freezes: result.reward.freezes,
            });
          })
          .catch(err => console.error('Error claiming reward:', err));
      }
    }
  }, [streaks, claimChestReward, openModal, initialDataLoaded]);

  // Set up periodic profile refresh
  useEffect(() => {
    if (!userProfileData) return;

    const refetchInterval = setInterval(
      () => {
        refetchCurrentProfile();
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(refetchInterval);
  }, [userProfileData, refetchCurrentProfile]);

  // Calculate user position in leaderboard
  const userPosition = useMemo(() => {
    if (!userProfileData || !topProfilesData?.profiles) return -1;

    return topProfilesData.profiles.findIndex((profile: { id: string }) => profile.id === userProfileData.id);
  }, [userProfileData, topProfilesData]);

  const position = userPosition !== -1 ? userPosition + 1 : topProfilesData?.profiles.length || 0;

  // Process week data for the calendar display
  const weekInformation = pushLineData?.week_information || [];

  const streakDays = useMemo(() => {
    return weekInformation
      .filter(day => day.push_line_data?.status === 'passed')
      .map(day => new Date(day.creation_date).getDate());
  }, [weekInformation]);

  const freezeDays = useMemo(() => {
    return weekInformation
      .filter(day => day.push_line_data?.status === 'frozen')
      .map(day => new Date(day.creation_date).getDate());
  }, [weekInformation]);

  const weekData = useMemo(() => {
    return getWeekData(streakDays, freezeDays);
  }, [streakDays, freezeDays]);

  const isLoading = isUserLoading || isTopProfilesLoading || awardsLoading || isPushLineLoading;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <GetRewardChestModal onClose={() => closeModal(MODALS.TASK_CHEST)} />

      {(isUserLoading || isTopProfilesLoading) && <p>{t('p3')}</p>}

      {(userError || topProfilesError) && <p>{t('p17')}</p>}

      {userProfileData && topProfilesData && (
        <div className={styles.wrp}>
          <div>
            <h1 className={styles.pageTitle}>{t('p1')}</h1>

            <ProfileStatsMini position={position} daysInARow={streaks} />
          </div>

          <ChangeNicknameModal
            modalId={MODALS.CHANGING_NICKNAME}
            onClose={() => closeModal(MODALS.CHANGING_NICKNAME)}
            currentNickname={userProfileData.username}
            currentBlogName={userProfileData.blog_name}
          />

          <div className={styles.info}>
            <ProfileInfo
              showTreeLink
              nickname={userProfileData.username}
              blogName={userProfileData.blog_name}
              levelUser={userProfileData.growth_tree_stage_id}
              subscriptionIntegrationsLeft={userProfileData.subscription_integrations_left}
              position={position}
              isVip={false}
            />
            <StreakCard
              streakDays={streaks}
              frozenDays={userProfileData.available_freezes}
              days={weekData}
              status={
                locale === 'ru'
                  ? pushLineData?.push_line_profile_status?.status_name
                  : pushLineData?.push_line_profile_status?.status_name_eng
              }
              chest={locale === 'ru' ? pushLineData?.next_chest?.chest_name : pushLineData?.next_chest?.chest_name_eng}
              weekData={pushLineData?.week_information}
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

          {awardsData && awardsData?.achievements.length > 0 && (
            <div>
              <p className={styles.statsTitle}>{t('p5')}</p>
              <RewardsList />
            </div>
          )}
        </div>
      )}
    </>
  );
};
