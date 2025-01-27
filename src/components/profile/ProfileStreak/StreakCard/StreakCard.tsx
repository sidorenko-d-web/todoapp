import React from 'react';
import styles from './StreakCard.module.scss';


import chestIcon from '../../../../assets/icons/elite-chest-glowing.svg';
import snowflake from '../../../../assets/icons/snowflake.svg';
import ProgressLine from '../../../shared/ProgressLine/ProgressLine';

import { DayType } from '../../../../types';
import { StreakDay } from './StreakDay';


interface StreakCardProps {
  streakCount: number;
  freezeCount: number;
  days: { day: number; type: DayType }[];
  progress: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streakCount, freezeCount, days, progress }) => {
  return (
    <div className={styles.wrp}>
      <div className={styles.header}>
        <div className={styles.daysInARowWrp}>
          <span className={styles.badge}>Новичок</span>

          <div className={styles.title}>
            <h2 className={styles.daysInARow}>{streakCount} дней в блоге!</h2>
            <div className={styles.freezeCount}>
              <span>{freezeCount}</span>
              <img src={snowflake} />
            </div>
          </div>
        </div>
        <div className={styles.fire} />

      </div>

      <div className={styles.streakDays}>
        {days.map(({ day, type }) => (
          <StreakDay key={day} dayNumber={day} type={type} />
        ))}
      </div>

      <div className={styles.progressContainer}>
        <div className={`${styles['progressBarTextWrp']} ${styles['progressText']}`}>
          <span>{progress}/30 дней</span>
          <span className={styles.reward}>
            Легендарный сундук
            <div className={styles.chestImgContainer}>
              <img src={chestIcon} className={styles.chestImg} />
            </div>
          </span>
        </div>
        <ProgressLine level={3} color='red' />
      </div>
    </div>
  );
};
