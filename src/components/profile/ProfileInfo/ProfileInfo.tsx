import React from "react";

import styles from './ProfileInfo.module.scss';

import profileImagePlaceholder from '../../../assets/icons/profile-icon-placeholder.svg';
import clanIcon from '../../../assets/icons/clan-red.svg';
import editIcon from '../../../assets/icons/edit.svg';

export const ProfileInfo: React.FC = () => {
    return (
        <div className={styles.wrp}>
            <div className={styles.avatar}>
                <div className={styles.clanWrp}>
                    <p className={styles.position}>345</p>
                    <img src={clanIcon} />
                </div>

                <img src={profileImagePlaceholder} height={30} width={22.5} />
                <div style={{ height: '12px' }} />
            </div>

            <div className={styles.infoCard}>
                <div className={styles.info}>
                    <div className={styles.nicknameWrp}>
                        <p className={styles.nickname}>Nickname</p>
                        <p className={styles.subscribers}>999</p>
                        <img className={styles.edit} src={editIcon} />
                    </div>

                    <p className={styles.blogName}>
                        Blog name
                    </p>
                </div>
                
                <div className={styles.subscription}>

                </div>
            </div>
            
        </div>
    );
}