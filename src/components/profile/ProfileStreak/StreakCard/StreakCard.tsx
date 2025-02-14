import React from 'react';
import styles from './StreakCard.module.scss';

import chestIcon from '../../../../assets/icons/elite-chest-glowing.svg';
import snowflake from '../../../../assets/icons/snowflake.svg';
import { ProgressLine } from '../../../shared';

import { DayType } from '../../../../types';
import { StreakDay } from './StreakDay';
import { useTranslation } from 'react-i18next';

interface StreakCardProps {
  days?: { day: number; type: DayType }[];
  onlyStreak?: boolean;
  streakDays: number;
  frozenDays: number;
  weekData: [];
}

export const StreakCard: React.FC<StreakCardProps> = ({
  days,
  onlyStreak,
  streakDays,
  frozenDays,
  weekData,
}) => {
  const { t } = useTranslation('profile');

  const calculateLevel = () => {
    const maxStreak = 30;
    const maxLevel = 5;

    return Math.min(maxLevel, Math.floor((streakDays / maxStreak) * maxLevel));
  };

  return (
    <div className={styles.wrp}>
      <div className={styles.header}>
        <div className={styles.daysInARowWrp}>
          <span className={styles.badge}>{t('p12')}</span>

          <div className={styles.title}>
            <h2 className={styles.daysInARow}>
              {streakDays} {t('p13')}
            </h2>
            {!onlyStreak && (
              <div className={styles.freezeCount}>
                <span>{frozenDays}</span>
                <img src={snowflake} alt="Freeze Icon" />
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
                <StreakDay
                  key={day}
                  dayNumber={day}
                  type={type}
                  weekIndex={index}
                  weekData={weekData}
                />
              ))}
            </div>
          )}

          <div className={styles.progressContainer}>
            <div className={`${styles['progressBarTextWrp']} ${styles['progressText']}`}>
              <span>
                {streakDays}/{t('p14')}
              </span>
              <span className={styles.reward}>
                {t('p15')}
                <div className={styles.chestImgContainer}>
                  <img src={chestIcon} className={styles.chestImg} alt="Chest Icon" />
                </div>
              </span>
            </div>

            <ProgressLine level={calculateLevel()} color="red" />
          </div>
        </>
      )}
    </div>
  );
};
