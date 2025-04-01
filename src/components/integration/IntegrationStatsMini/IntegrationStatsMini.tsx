import React from 'react';

import styles from './IntegrationStatsMini.module.scss';

import coin from '../../../assets/icons/coin.png';
import viewsIcon from '../../../assets/icons/views.png';
import subscribersIcon from '../../../assets/icons/subscribers.png';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../../../constants';
import { formatAbbreviation } from '../../../helpers';
import { TrackedButton } from '../..';
import { useTranslation } from 'react-i18next';
import { usePushLineStatus } from '../../../hooks';
import { useIncrementingProfileStats } from '../../../hooks/useIncrementingProfileStats.ts';
import { useGetProfileMeQuery } from '../../../redux/index.ts';

export const IntegrationStatsMini = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation('integrations');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { data: userProfileData } = useGetProfileMeQuery();

  const {
    points: displayedPoints,
    subscribers: displayedSubscribers,
    totalViews: displayedTotalViews,
  } = useIncrementingProfileStats({
    profileId: userProfileData?.id || '',
    basePoints: userProfileData?.points || '0',
    baseSubscribers: userProfileData?.subscribers || 0,
    baseTotalViews: userProfileData?.total_views || 0,
    baseTotalEarned: userProfileData?.total_earned || '0',
    futureStatistics: userProfileData?.future_statistics,
    lastUpdatedAt: userProfileData?.updated_at,
  });

  const { in_streak } = usePushLineStatus();

  const points = in_streak ? displayedPoints : userProfileData?.points || '0';
  const subscribers = in_streak ? displayedSubscribers : userProfileData?.subscribers || 0;
  const totalViews = in_streak ? displayedTotalViews : userProfileData?.total_views || 0;

  return (
    <div className={styles.statsUnderTitleWrp}>
      <div className={styles.toCenterStats} />
      <div className={styles.statsUnderTitle}>
        <div className={styles.topStats}>
          <div className={styles.statWrp}>
            <p className={styles.stat}>{formatAbbreviation(totalViews, 'number', { locale: locale })}</p>
            <img src={viewsIcon} height={18} width={18} alt="" />
          </div>
          <div className={styles.statWrp}>
            <p className={styles.stat}>{formatAbbreviation(subscribers, 'number', { locale: locale })}</p>
            <img src={subscribersIcon} height={18} width={18} alt="" />
          </div>
          <div className={styles.statWrp}>
            <p className={styles.stat}>+ {formatAbbreviation(points, 'number', { locale: locale })}</p>
            <img src={coin} height={18} width={18} alt="" />
          </div>
        </div>
      </div>
      <TrackedButton
        trackingData={{ eventType: 'button', eventPlace: 'К статистике - Интеграции' }}
        onClick={() => navigate(AppRoute.Statistics)}
        className={styles.seeStatsButton}
      ></TrackedButton>
    </div>
  );
};
