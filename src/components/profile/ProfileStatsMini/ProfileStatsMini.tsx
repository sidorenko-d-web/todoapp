import React from 'react';

import styles from './ProfileStatsMini.module.scss';

import clanIcon from '../../../assets/icons/clan-red.svg';
import subscriberIcon from '../../../assets/icons/subscribers.png';
import viewsIcon from '../../../assets/icons/views.png';
import fireIcon from '../../../assets/icons/fire-blue.svg';
import { Link } from 'react-router-dom';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import { TrackedButton } from '../..';
import { useIncrementingProfileStats } from '../../../hooks/useIncrementingProfileStats';
import { useGetProfileMeQuery, useGetUserProfileInfoByIdQuery } from '../../../redux';
import { usePushLineStatus } from '../../../hooks';
import clsx from 'clsx';
import { isGuideShown } from '../../../utils';
import { GUIDE_ITEMS } from '../../../constants';

interface ProfileStatsMiniProps {
  daysInARow: number | undefined;
  position: number;
  onlyBadges?: boolean;
  strangerId?: string;
}

export const ProfileStatsMini: React.FC<ProfileStatsMiniProps> = ({ daysInARow, position, onlyBadges, strangerId }) => {
  const { i18n } = useTranslation('shop');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  const { data: userProfileData } = useGetProfileMeQuery(undefined, { skip: !!strangerId });
  const { data: strangerProfileData } = useGetUserProfileInfoByIdQuery(strangerId!, { skip: !strangerId });

  const {
    // points: displayedPoints,
    subscribers: displayedSubscribers,
    totalViews: displayedTotalViews,
  } = useIncrementingProfileStats({
    profileId: (userProfileData ?? strangerProfileData)?.id || '',
    basePoints: (userProfileData ?? strangerProfileData)?.points || '0',
    baseSubscribers: (userProfileData ?? strangerProfileData)?.subscribers || 0,
    baseTotalViews: (userProfileData ?? strangerProfileData)?.total_views || 0,
    baseTotalEarned: (userProfileData ?? strangerProfileData)?.total_earned || '0',
    futureStatistics: (userProfileData ?? strangerProfileData)?.future_statistics,
    lastUpdatedAt: (userProfileData ?? strangerProfileData)?.updated_at,
  });

  const { in_streak } = usePushLineStatus();

  const subscribers = in_streak ? displayedSubscribers : ((userProfileData ?? strangerProfileData)?.subscribers ?? 0);
  const totalViews = in_streak ? displayedTotalViews : ((userProfileData ?? strangerProfileData)?.total_views ?? 0);

  const statsGlowing = !isGuideShown(GUIDE_ITEMS.profilePage.PROFILE_FIRST_GUIDE);


  return (
    <div className={clsx(styles.wrp, (strangerId || onlyBadges) && styles.justifyCenter)}>
      {!strangerId && !onlyBadges && <div className={styles.toCenterStats} />}

      <div className={`${styles.statsWrp}`}>
        <div className={`${styles.statWrp} ${statsGlowing ? styles.glowing : ''}`}>
          <p className={styles.stat}>{`#${position}`}</p>
          <img src={clanIcon} />
        </div>

        <div className={`${styles.statWrp} ${statsGlowing ? styles.glowing : ''}`}>
          <span className={`${styles.stat}`}>{formatAbbreviation(subscribers, 'number', { locale: locale })}</span>
          <img src={subscriberIcon} />
        </div>

        <div className={`${styles.statWrp} ${statsGlowing ? styles.glowing : ''}`}>
          <span className={styles.stat}>{formatAbbreviation(totalViews, 'number', { locale: locale })}</span>
          <img src={viewsIcon} />
        </div>

        <div className={`${styles.statWrp} ${statsGlowing ? styles.glowing : ''}`}>
          <p className={styles.stat}>{daysInARow}</p>
          <img src={fireIcon} />
        </div>
      </div>

      {!strangerId && !onlyBadges && (
        <Link to={'../wardrobe'}>
          <TrackedButton
            trackingData={{
              eventType: 'button',
              eventPlace: 'В гардероб - Профиль',
            }}
            className={clsx(styles.wardrobeButton)}
          />
        </Link>
      )}
    </div>
  );
};
