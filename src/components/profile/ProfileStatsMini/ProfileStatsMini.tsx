import React from 'react';

import styles from './ProfileStatsMini.module.scss';

import clanIcon from '../../../assets/icons/clan-red.svg';
import subscriberIcon from '../../../assets/icons/subscribers.png';
import viewsIcon from '../../../assets/icons/views.png';
import fireIcon from '../../../assets/icons/fire-red.svg';
import { Link } from 'react-router-dom';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import { TrackedButton } from '../..';
import { useIncrementingProfileStats } from '../../../hooks/useIncrementingProfileStats';
import { useGetCurrentUserProfileInfoQuery } from '../../../redux';
import { usePushLineStatus } from '../../../hooks';

interface ProfileStatsMiniProps {
  daysInARow: number;
  position: number;
  onlyBadges?: boolean;
}

export const ProfileStatsMini: React.FC<ProfileStatsMiniProps> = ({
  daysInARow,
  position,
  onlyBadges,
}) => {
  const { i18n } = useTranslation('shop');
  const locale = ['ru', 'en'].includes(i18n.language)
    ? (i18n.language as 'ru' | 'en')
    : 'ru';


  const {
    data: userProfileData
  } = useGetCurrentUserProfileInfoQuery();

     const {
    // points: displayedPoints,
    subscribers: displayedSubscribers,
    totalViews: displayedTotalViews,
    totalEarned: displayedTotalEarned
  } = useIncrementingProfileStats({
    profileId: userProfileData?.id || '',
    basePoints: userProfileData?.points || '0',
    baseSubscribers: userProfileData?.subscribers || 0,
    baseTotalViews: userProfileData?.total_views || 0,
    baseTotalEarned: userProfileData?.total_earned || '0',
    futureStatistics: userProfileData?.future_statistics,
    lastUpdatedAt: userProfileData?.updated_at,
  });


  const {in_streak} = usePushLineStatus()

  const subscribers = in_streak ? displayedSubscribers : userProfileData?.subscribers ?? 0
  const totalViews = in_streak ? displayedTotalViews : userProfileData?.total_views ?? 0

  return (
    <div className={styles.wrp + ' ' + (onlyBadges ? styles.justifyCenter : '')}>
      {!onlyBadges && <div className={styles.toCenterStats} />}

      <div className={styles.statsWrp}>
        <div className={styles.statWrp}>
          <p className={styles.stat}>{`#${position}`}</p>
          <img src={clanIcon} />
        </div>

        <div className={styles.statWrp}>
          <span className={styles.stat}>
            {formatAbbreviation(subscribers, 'number', { locale: locale })}
          </span>
          <img src={subscriberIcon} />
        </div>

        <div className={styles.statWrp}>
          <span className={styles.stat}>
            {formatAbbreviation(totalViews, 'number', { locale: locale })}
          </span>
          <img src={viewsIcon} />
        </div>

        <div className={styles.statWrp}>
          <p className={styles.stat}>{daysInARow + 1}</p>
          <img src={fireIcon} />
        </div>
      </div>

      {!onlyBadges && (
        <Link to={'../wardrobe'}>
          <TrackedButton
            trackingData={{
              eventType: 'button',
              eventPlace: 'В гардероб - Профиль',
            }}
            className={styles.wardrobeButton}
          />
        </Link>
      )}
    </div>
  );
};
