import React from 'react';

import styles from './ProfileInfo.module.scss';

import profileImagePlaceholder from '../../../assets/icons/profile-icon-placeholder.svg';
import clanIcon from '../../../assets/icons/clan-red.svg';
import vipIcon from '../../../assets/icons/vip.svg';

import subscriptionLeveIcon from '../../../assets/icons/subscription-level.svg';

import { ProgressLine } from '../../shared';
import { AppRoute } from '../../../constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { useTranslation } from 'react-i18next';
import { TrackedLink } from '../..';

interface ProfileInfoProps {
  nickname: string;
  blogName: string;
  subscriptionIntegrationsLeft: number;
  position: number;
  isVip?: boolean;
  nonEditable?: boolean;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
                                                          nickname,
                                                          subscriptionIntegrationsLeft,
                                                          position,
                                                          isVip,
                                                        }) => {
  const { t } = useTranslation('profile');
  const lastActiveStage = useSelector(
    (state: RootState) => state.treeSlice.lastActiveStage,
  );

  return (
    <div className={styles.wrp}>
      <div className={`${styles.avatar} ${isVip ? styles.vip : ''}`}>
        <div className={styles.avatarImageWrp}>
          <div className={`${styles.clanWrp} ${isVip ? styles.vip : ''}`}>
            <span className={styles.position}>{`#${position}`}</span>
            <img src={clanIcon} alt="" />
          </div>

          <div className={styles.imagePlaceholder}>
            <img src={profileImagePlaceholder} alt="" />
          </div>
          {isVip ? (
            <>
              <div className={styles.vipWrp}>
                <img src={vipIcon} alt="" />
                <span className={styles.vipText}>VIP</span>
              </div>
            </>
          ) : (
            <>
              <div style={{ height: '16px' }}></div>
            </>
          )}
        </div>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.info}>
          <div className={styles.nicknameWrp}>
            <span className={styles.nickname}>{nickname}</span>
            <TrackedLink
              trackingData={{
                eventType: 'button',
                eventPlace: 'В дерево роста - Профиль',
              }} to={AppRoute.ProgressTree} className={styles.subscribers}>
              {lastActiveStage}
            </TrackedLink>
            {/*{!nonEditable && (*/}
            {/*  <img*/}
            {/*    className={styles.edit}*/}
            {/*    src={editIcon}*/}
            {/*    onClick={() => openModal(MODALS.CHANGING_NICKNAME)}*/}
            {/*    alt=""*/}
            {/*  />*/}
            {/*)}*/}
          </div>

          {/*<p className={styles.blogName}>{blogName}</p>*/}
        </div>

        <div className={styles.subscription}>
          <div className={styles.subscriptionTextWrp}>
            <span className={styles.subscriptionText}>{t('p2')}</span>

            <div className={styles.subscriptionLevelWrp}>
              <span className={styles.subscriptionLevel}>
                {subscriptionIntegrationsLeft}/5
              </span>
              <img src={subscriptionLeveIcon} alt="" />
            </div>
          </div>
          <ProgressLine level={subscriptionIntegrationsLeft} color="blue" />
        </div>
      </div>
    </div>
  );
};
