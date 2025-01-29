import React from "react";

import styles from './ProfilePage.module.scss';
import { ProfileStatsMini } from "../../components/profile/ProfileStatsMini";
import { ProfileInfo } from "../../components/profile/ProfileInfo";
import { useGetCurrentUserProfileInfoQuery, useGetTopProfilesQuery } from "../../redux/api/profile/api";
import { StreakCard } from "../../components/profile/ProfileStreak/StreakCard/StreakCard";
import { ProfileStats } from "../../components/profile";
import RewardsList from "../../components/profile/RewardsCard/RewardsList";
import { getWeekData } from "../../utils";
import { useModal } from "../../hooks";
import { MODALS } from "../../constants/modals";
import ChangeNicknameModal from "../../components/profile/ChangeNicknameModal/ChangeNicknameModal";


export const ProfilePage: React.FC = () => {

    const { closeModal } = useModal();

    const { data: userProfileData, error: userError, isLoading: isUserLoading} = useGetCurrentUserProfileInfoQuery();

    const { data: topProfilesData, error: topProfilesError, isLoading: isTopProfilesLoading } = useGetTopProfilesQuery();


    const userPosition = userProfileData && topProfilesData?.profiles
        ? topProfilesData.profiles.findIndex((profile: { id: string; }) => profile.id === userProfileData.id)
        : -1;

    const position = userPosition !== -1 ? userPosition + 1 : topProfilesData?.profiles.length!;

    const streakDays = [27, 28, 30]; // TODO: replace with real data from API
    const freezeDays = [29]; // TODO: replace with real data

    const weekData = getWeekData(streakDays, freezeDays);
  

    return (
        <>
            {(isUserLoading || isTopProfilesLoading) && <p>Загрузка...</p>}

            {(userError || topProfilesError) && <p>Ошибка при загрузке данных профиля</p>}

            {(userProfileData && topProfilesData) &&
                <div className={styles.wrp}>
                    <div>
                        <h1 className={styles.pageTitle}>Профиль</h1>

                        <ProfileStatsMini subscribers={userProfileData.subscribers} position={position} daysInARow={10} />
                    </div>

                    <ChangeNicknameModal modalId={MODALS.CHANGING_NICKNAME} 
                        onClose={() => closeModal(MODALS.CHANGING_NICKNAME)} 
                        currentNickname={userProfileData.username} currentBlogName={userProfileData.blog_name}/>

                    <ProfileInfo nickname={userProfileData.username} blogName={userProfileData.blog_name}
                        subscriptionIntegrationsLeft={userProfileData.subscription_integrations_left} position={position} isVip={false}/>

                    <StreakCard streakCount={12} freezeCount={0} days={weekData} progress={12} />

                    <div>
                        <p className={styles.statsTitle}>Статистика за всё время</p>
                        <ProfileStats earned={userProfileData.total_earned} views={userProfileData.total_views}
                            favoriteCompany={'Favourite company'} comments={userProfileData.comments_answered} rewards={12} coffee={5} />
                    </div>

                    <div>
                        <p className={styles.statsTitle}>Награды</p>
                        <RewardsList />
                    </div>
                </div>}
        </>
    );
}