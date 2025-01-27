import React from "react";

import styles from './ProfileInfo.module.scss';

import profileImagePlaceholder from '../../../assets/icons/profile-icon-placeholder.svg';
import clanIcon from '../../../assets/icons/clan-red.svg';
import editIcon from '../../../assets/icons/edit.svg';
import subscriptionLeveIcon from '../../../assets/icons/subscription-level.svg';

import ProgressLine from "../../shared/ProgressLine/ProgressLine";

interface ProfileInfoProps {
    nickname: string;
    blogName: string;
    subscriptionIntegrationsLeft: number;
    position: number;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({nickname, blogName, subscriptionIntegrationsLeft, position}) => {
    return (
        <div className={styles.wrp}>
            <div className={styles.avatar}>
                <div className={styles.clanWrp}>
                    <p className={styles.position}>{`#${position}`}</p>
                    <img src={clanIcon} />
                </div>

                <img src={profileImagePlaceholder} height={30} width={22.5} />
                <div style={{ height: '12px' }} />
            </div>

            <div className={styles.infoCard}>
                <div className={styles.info}>
                    <div className={styles.nicknameWrp}>
                        <p className={styles.nickname}>{nickname}</p>
                        <p className={styles.subscribers}>999</p>
                        <img className={styles.edit} src={editIcon} />
                    </div>

                    <p className={styles.blogName}>
                        {blogName}
                    </p>
                </div>
                
                <div className={styles.subscription}>
                    <div className={styles.subscriptionTextWrp}>
                        <p className={styles.subscriptionText}>Подписка</p>

                        <div className={styles.subscriptionLevelWrp}>
                            <p className={styles.subscriptionLevel}>{subscriptionIntegrationsLeft}/5</p>
                            <img src={subscriptionLeveIcon}/>
                        </div>
                    </div>
                    <ProgressLine level={subscriptionIntegrationsLeft} color="blue"/>
                </div>
            </div>
            
        </div>
    );
}