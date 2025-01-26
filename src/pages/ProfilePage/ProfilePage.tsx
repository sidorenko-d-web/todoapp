import React from "react";

import styles from './ProfilePage.module.scss';
import { ProfileStatsMini } from "../../components/profile/ProfileStatsMini";
import { ProfileInfo } from "../../components/profile/ProfileInfo";

export const ProfilePage: React.FC = () => {
    return (
        <div className={styles.wrp}>
            <div>
                <h1 className={styles.pageTitle}>Профиль</h1>
                <ProfileStatsMini />
            </div>

            <ProfileInfo />
        </div>
    );
}