import React from "react";

import styles from './ProfileInfo.module.scss';

import profileImagePlaceholder from '../../../assets/icons/profile-icon-placeholder.svg';
import clanIcon from '../../../assets/icons/clan-red.svg';
import editIcon from '../../../assets/icons/edit.svg';
import vipIcon from '../../../assets/icons/vip.svg';

import subscriptionLeveIcon from '../../../assets/icons/subscription-level.svg';

import ProgressLine from "../../shared/ProgressLine/ProgressLine";

interface ProfileInfoProps {
    nickname: string;
    blogName: string;
    subscriptionIntegrationsLeft: number;
    position: number;
    isVip: boolean;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ nickname, blogName, subscriptionIntegrationsLeft, position, isVip }) => {
    return (
        <div className={styles.wrp}>
            <div className={`${styles.avatar} ${isVip ? styles.vip : ""}`}>
                <div className={styles.avatarImageWrp}>
                    <div className={`${styles.clanWrp} ${isVip ? styles.vip : ""}`}>
                        <span className={styles.position}>{`#${position}`}</span>
                        <img src={clanIcon} />
                    </div>

                    <img src={profileImagePlaceholder} className={styles.imagePlaceholder} />
                    {isVip ? (
                        <>
                            <div className={styles.vipWrp}>
                                <img src={vipIcon} />
                                <span className={styles.vipText}>VIP</span>
                            </div>
                        </>
                    ) : <>
                        <div style={{height: '16px'}}></div>
                    </>}

                </div>
            </div>

            <div className={styles.infoCard}>
                <div className={styles.info}>
                    <div className={styles.nicknameWrp}>
                        <span className={styles.nickname}>{nickname}</span>
                        <span className={styles.subscribers}>999</span>
                        <img className={styles.edit} src={editIcon} />
                    </div>

                    <p className={styles.blogName}>
                        {blogName}
                    </p>
                </div>

                <div className={styles.subscription}>
                    <div className={styles.subscriptionTextWrp}>
                        <span className={styles.subscriptionText}>Подписка</span>

                        <div className={styles.subscriptionLevelWrp}>
                            <span className={styles.subscriptionLevel}>{subscriptionIntegrationsLeft}/5</span>
                            <img src={subscriptionLeveIcon} />
                        </div>
                    </div>
                    <ProgressLine level={subscriptionIntegrationsLeft} color="blue" />
                </div>
            </div>

        </div>
    );
}