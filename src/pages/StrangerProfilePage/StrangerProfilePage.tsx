import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GetRewardChestModal from '../DevModals/GetRewardChestModal/GetRewardChestModal';
import styles from './StrangerProfilePage.module.scss';
import { ProfileInfo, ProfileStats, ProfileStatsMini, StreakCard } from '../../components/profile';
import {
  useClaimChestRewardMutation,
  useGetPushLineQuery,
  useGetTopProfilesQuery,
  useGetUserProfileInfoByIdQuery,
} from '../../redux';
import goldMedal from '../../assets/icons/medal-gold.svg';
import silverMedal from '../../assets/icons/medal-silver.svg';
import bronzeMedal from '../../assets/icons/medal-bronze.svg';
import { getWeekData } from '../../utils';
import { useModal } from '../../hooks';
import { MODALS } from '../../constants';
import ChangeNicknameModal from '../../components/profile/ChangeNicknameModal/ChangeNicknameModal';
import { Loader } from '../../components';
import { useLocation, useSearchParams } from 'react-router-dom';
import { WithModal } from '../../components/shared/WithModal/WithModa';

export const StrangerProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation('profile');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { closeModal, openModal } = useModal();
  const { data } = useGetPushLineQuery();

  const strangerId = useLocation().pathname.split('/')[2];

  const [claimChestReward] = useClaimChestRewardMutation();

  const {
    data: userProfileData,
    error: userError,
    isLoading: isUserLoading,
    refetch: refetchCurrentProfile,
  } = useGetUserProfileInfoByIdQuery(strangerId);

  useEffect(() => {
    if (!userProfileData) return;
    const refetchInterval = setInterval(() => {
      refetchCurrentProfile();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refetchInterval);
  }, [userProfileData, refetchCurrentProfile]);

  const {
    data: topProfilesData,
    error: topProfilesError,
    isLoading: isTopProfilesLoading,
  } = useGetTopProfilesQuery({ ids: [strangerId] });

  const streaks = data?.week_information.filter(day => day.push_line_data?.status === 'passed').length;

  useEffect(() => {
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
  }, [streaks, claimChestReward, openModal]);
  const [searchParams] = useSearchParams();

  const position = Number(searchParams.get('topposition')) ?? 1;

  const weekInformation = data?.week_information || [];

  const streakDays = weekInformation
    .filter(day => day.push_line_data?.status === 'passed')
    .map(day => new Date(day.creation_date).getDate());

  const freezeDays = weekInformation
    .filter(day => day.push_line_data?.status === 'frozen')
    .map(day => new Date(day.creation_date).getDate());

  const weekData = getWeekData(streakDays, freezeDays);

  const medalIcons = [bronzeMedal, silverMedal, goldMedal];

  const isLoading = isUserLoading || isTopProfilesLoading;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <WithModal
        modalId={MODALS.TASK_CHEST}
        component={<GetRewardChestModal onClose={() => closeModal(MODALS.TASK_CHEST)} />}
      />
      {(isUserLoading || isTopProfilesLoading) && <p>{t('p3')}</p>}
      {(userError || topProfilesError) && <p>{t('p17')}</p>}
      {userProfileData && topProfilesData && (
        <div className={styles.wrp}>
          <div>
            {!strangerId && <h1 className={styles.pageTitle}>{t('p1')}</h1>}

            <ProfileStatsMini
              strangerId={strangerId}
              position={position}
              daysInARow={streaks !== undefined ? streaks : 0}
            />
          </div>

          <WithModal
            modalId={MODALS.CHANGING_NICKNAME}
            component={
              <ChangeNicknameModal
                modalId={MODALS.CHANGING_NICKNAME}
                onClose={() => closeModal(MODALS.CHANGING_NICKNAME)}
                currentNickname={userProfileData.username}
                currentBlogName={userProfileData.blog_name}
              />
            }
          />
          <div className={styles.info}>
            <ProfileInfo
              nickname={userProfileData.username}
              blogName={userProfileData.blog_name}
              levelUser={userProfileData.growth_tree_stage_id}
              subscriptionIntegrationsLeft={userProfileData.subscription_integrations_left}
              position={position}
              isVip={false}
              strangerId={strangerId}
            />
            <StreakCard
              streakDays={streaks !== undefined ? streaks : 0}
              days={weekData}
              status={
                locale === 'ru'
                  ? data?.push_line_profile_status.status_name
                  : data?.push_line_profile_status.status_name_eng
              }
              chest={locale === 'ru' ? data?.next_chest.chest_name : data?.next_chest.chest_name_eng}
              weekData={data?.week_information}
              strangerId={strangerId}
            />
          </div>

          <ProfileStats
            favoriteCompany={userProfileData.favorite_company}
            comments={userProfileData.comments_answered_correctly}
            rewards={userProfileData.achievements_collected}
            views={userProfileData.total_views}
          />
          {topProfilesData.profiles?.[0]?.achievements?.length > 0 && (
            <div className={styles.achivements}>
              {topProfilesData.profiles?.[0]?.achievements.map(item => {
                return (
                  <div className={styles.rewardImage}>
                    {item.level && (
                      <img src={medalIcons[item?.level]} alt={`${item?.level} medal`} className={styles.medal} />
                    )}
                    <img src={item?.image_url} className={styles.image} alt={'Star'} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};
