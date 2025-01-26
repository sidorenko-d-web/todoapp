import React from "react";

import styles from './ProfilePage.module.scss';
import { ProfileStatsMini } from "../../components/profile/ProfileStatsMini";

export const ProfilePage: React.FC = () => {
    return (
        <div className={styles.wrp}>
            <h1 className={styles.pageTitle}>Профиль</h1>
            <ProfileStatsMini/>
        </div>
    );
}