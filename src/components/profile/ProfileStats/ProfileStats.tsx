import React from "react";
import styles from "./ProfileStats.module.scss";
import { useTranslation } from 'react-i18next';
import { formatAbbreviation } from '../../../helpers';

interface ProfileStatsProps {
  earned: string;
  views: number;
  favoriteCompany: string;
  comments: number;
  rewards: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ earned, views, favoriteCompany, comments, rewards: awards }) => {
  const { t,i18n } = useTranslation('profile');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  return (
    <div className={styles.profileStats}>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p6')}</span>
        <span className={styles.value}>{formatAbbreviation(earned,'number', { locale: locale })}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p7')}</span>
        <span className={styles.value}>{formatAbbreviation(views,'number', { locale: locale })}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p8')}</span>
        <span className={styles.value}>{favoriteCompany}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p9')}</span>
        <span className={styles.value}>{formatAbbreviation(comments || 0,'number', { locale: locale })}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>{t('p10')}</span>
        <span className={styles.value}>{formatAbbreviation(awards,'number', { locale: locale })}</span>
      </div>
    </div>
  );
};
