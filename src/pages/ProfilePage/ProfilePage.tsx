import React from "react";

import styles from './ProfilePage.module.scss';
import { ProfileStatsMini } from "../../components/profile/ProfileStatsMini";
import { ProfileInfo } from "../../components/profile/ProfileInfo";
import { useGetCurrentUserProfileInfoQuery, useGetTopProfilesQuery } from "../../redux/api/profile/api";
import { StreakCard } from "../../components/profile/ProfileStreak/StreakDay/StreakCard/StreakCard";


export const ProfilePage: React.FC = () => {

    const { data: userProfileData, error: userError, isLoading: isUserLoading } = useGetCurrentUserProfileInfoQuery();
  
    const { data: topProfilesData, error: topProfilesError, isLoading: isTopProfilesLoading } = useGetTopProfilesQuery();


    const userPosition = userProfileData && topProfilesData?.profiles 
        ? topProfilesData.profiles.findIndex((profile: { id: string; }) => profile.id === userProfileData.id)
        : -1;

    const position = userPosition !== -1 ? userPosition + 1 : topProfilesData?.profiles.length!;

    const weekData = [
        { day: 20, type: 'freeze' },
        { day: 21, type: 'streak' },
        { day: 22, type: 'streak' },
        { day: 23, type: 'regular' },
        { day: 24, type: 'regular' },
        { day: 25, type: 'regular' },
        { day: 26, type: 'regular' }
      ];

    return (
        <>
            {(isUserLoading || isTopProfilesLoading) && <p>Загрузка...</p>}

            {(userError || topProfilesError) && <p>Ошибка при загрузке данных профиля</p>}

            {(userProfileData && topProfilesData) && 
                <div className={styles.wrp}>
                    <div>
                        <h1 className={styles.pageTitle}>Профиль</h1>
                       
                        <ProfileStatsMini subscribers={userProfileData.subscribers} position={position} daysInARow={10}/>
                    </div>

                    <ProfileInfo nickname={userProfileData.username} blogName={userProfileData.blog_name} 
                        subscriptionIntegrationsLeft={userProfileData.subscription_integrations_left} position={position}/>

                    <StreakCard streakCount={12} freezeCount={0} days={weekData} progress={12} />
                </div>}
        </> 
    );
}