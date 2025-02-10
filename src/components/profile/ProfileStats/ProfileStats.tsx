import React from 'react';
import styles from './ProfileStats.module.scss';
import { formatAbbreviation } from '../../../helpers';

interface ProfileStatsProps {
  earned: string;
  views: number;
  favoriteCompany: string;
  comments: number;
  rewards: number;
  coffee: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ earned, views, favoriteCompany, comments, rewards: awards, coffee }) => {
  return (
    <div className={styles.profileStats}>
      <div className={styles.stat}>
        <span className={styles.label}>Всего заработано</span>
        <span className={styles.value}>{formatAbbreviation(earned)}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Всего просмотров</span>
        <span className={styles.value}>{formatAbbreviation(views)}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Любимая компания</span>
        <span className={styles.value}>{favoriteCompany}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Отвечено комментариев</span>
        <span className={styles.value}>{formatAbbreviation(comments || 0)}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Собрано наград</span>
        <span className={styles.value}>{formatAbbreviation(awards)}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Выпито чашек кофе</span>
        <span className={styles.value}>{formatAbbreviation(coffee)}</span>
      </div>
    </div>
  );
};
