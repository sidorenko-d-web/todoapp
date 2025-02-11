import React from 'react';
import styles from './StreakCard.module.scss';

import chestIcon from '../../../../assets/icons/elite-chest-glowing.svg';
import snowflake from '../../../../assets/icons/snowflake.svg';
import { ProgressLine } from '../../../shared';

import { DayType } from '../../../../types';
import { StreakDay } from './StreakDay';
import { useTranslation } from 'react-i18next';

interface StreakCardProps {
  streakCount: number;
  freezeCount?: number;
  days?: { day: number; type: DayType }[];
  progress?: number;
  onlyStreak?: boolean;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  streakCount,
  freezeCount,
  days,
  progress,
  onlyStreak,
}) => {
  const { t } = useTranslation('profile');

  return (
    <div className={styles.wrp}>
      <div className={styles.header}>
        <div className={styles.daysInARowWrp}>
          <span className={styles.badge}>{t('p12')}</span>

          <div className={styles.title}>
            <h2 className={styles.daysInARow}>
              {streakCount} {t('p13')}
            </h2>
            {!onlyStreak && (
              <div className={styles.freezeCount}>
                <span>{freezeCount}</span>
                <img src={snowflake} />
              </div>
            )}
          </div>
        </div>
        <div className={styles.fire} />
      </div>

      {!onlyStreak && (
        <>
          {days && (
            <div className={styles.streakDays}>
              {days.map(({ day, type }, index) => (
                <StreakDay key={day} dayNumber={day} type={type} weekIndex={index} />
              ))}
            </div>
          )}

          <div className={styles.progressContainer}>
            <div className={`${styles['progressBarTextWrp']} ${styles['progressText']}`}>
              <span>
                {progress}/{t('p14')}
              </span>
              <span className={styles.reward}>
                {t('p15')}
                <div className={styles.chestImgContainer}>
                  <img src={chestIcon} className={styles.chestImg} />
                </div>
              </span>
            </div>
            <ProgressLine level={3} color="red" />
          </div>
        </>
      )}
    </div>
  );
};
