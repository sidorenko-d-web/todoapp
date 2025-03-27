import React from 'react';
import styles from './ProfileStats.module.scss';
import { useTranslation } from 'react-i18next';
import { formatAbbreviation } from '../../../helpers';
import { useIncrementingProfileStats } from '../../../hooks/useIncrementingProfileStats';
import { usePushLineStatus } from '../../../hooks';
import { useGetProfileMeQuery } from '../../../redux';

interface ProfileStatsProps {
  favoriteCompany: string;
  comments: number;
  rewards: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ favoriteCompany, comments, rewards: awards }) => {
  const { t, i18n } = useTranslation('profile');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  const { data: userProfileData } = useGetProfileMeQuery();

  const { in_streak } = usePushLineStatus();

  const { totalViews: displayedTotalViews, totalEarned: displayedTotalEarned } = useIncrementingProfileStats({
    profileId: userProfileData?.id || '',
    basePoints: userProfileData?.points || '0',
    baseSubscribers: userProfileData?.subscribers || 0,
    baseTotalViews: userProfileData?.total_views || 0,
    baseTotalEarned: userProfileData?.total_earned || '0',
    futureStatistics: userProfileData?.future_statistics,
    lastUpdatedAt: userProfileData?.updated_at,
  });

  const views = in_streak ? displayedTotalViews : userProfileData?.total_views ?? 0;
  const earned = in_streak ? displayedTotalEarned : userProfileData?.total_earned ?? '';

  return (
    <div className={styles.profileStats}>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p6')}</span>
        <span className={styles.value}>{formatAbbreviation(earned, 'number', { locale: locale })}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p7')}</span>
        <span className={styles.value}>{formatAbbreviation(views, 'number', { locale: locale })}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p8')}</span>
        <span className={styles.value}>{favoriteCompany}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p9')}</span>
        <span className={styles.value}>{formatAbbreviation(comments || 0, 'number', { locale: locale })}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p10')}</span>
        <span className={styles.value}>{formatAbbreviation(awards, 'number', { locale: locale })}</span>
      </div>
    </div>
  );
};

