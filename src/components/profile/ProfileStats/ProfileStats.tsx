import React from "react";
import styles from "./ProfileStats.module.scss";
import { useTranslation } from 'react-i18next';

interface ProfileStatsProps {
  earned: string;
  views: number;
  favoriteCompany: string;
  comments: number;
  rewards: number;
  coffee: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ earned, views, favoriteCompany, comments, rewards: awards, coffee }) => {
  const { t } = useTranslation('profile');

  return (
    <div className={styles.profileStats}>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p6')}</span>
        <span className={styles.value}>{earned}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p7')}</span>
        <span className={styles.value}>{views}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p8')}</span>
        <span className={styles.value}>{favoriteCompany}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p9')}</span>
        <span className={styles.value}>{comments}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p10')}</span>
        <span className={styles.value}>{awards}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p11')}</span>
        <span className={styles.value}>{coffee}</span>
      </div>
    </div>
  );
};
