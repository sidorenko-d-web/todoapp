import React from "react";

import styles from './ProfilePage.module.scss';
import { ProfileStatsMini } from "../../components/profile/ProfileStatsMini";
import { ProfileInfo } from "../../components/profile/ProfileInfo";
import { useGetCurrentUserProfileInfoQuery } from "../../redux/api/profile/api";

export const ProfilePage: React.FC = () => {

    const { data, isLoading, error } = useGetCurrentUserProfileInfoQuery();




    return (
        <>
            {isLoading && <p>Загрузка...</p>}

            {error && <p>Ошибка при загрузке данных профиля</p>}

            {data &&
                <div className={styles.wrp}>
                    <div>
                        <h1 className={styles.pageTitle}>Профиль</h1>
                        <ProfileStatsMini subscribers={data.subscribers} position={123} daysInARow={10}/>
                    </div>

                    <ProfileInfo nickname={data.username} blogName={data.blog_name} 
                        subscriptionIntegrationsLeft={data.subscription_integrations_left} position={123}/>
                </div>}
        </>
    );
}