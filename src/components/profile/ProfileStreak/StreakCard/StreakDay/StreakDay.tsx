import React from 'react';
import styles from './StreakDay.module.scss';

import fireIcon from '../../../../../assets/icons/streak-fire.svg';
import freezeIcon from '../../../../../assets/icons/streak-freeze.svg';
import { DayType } from '../../../../../types';

interface StreakDayProps {
  dayNumber: number;
  type: DayType;
  weekIndex: number;
}

export const StreakDay: React.FC<StreakDayProps> = ({ dayNumber, type, weekIndex }) => {
  const getIcon = () => {
    switch (type) {
      case 'streak':
        return <img src={fireIcon} />;
      case 'freeze':
        return <img src={freezeIcon} />;
      default:
        return null;
    }
  };

  const weekdays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  return (
    <div>
      <div className={`${styles['calendar-day']} ${styles[type]}`}>
        {(type === 'streak' || type === 'freeze') && (
          <div className={`${styles['status-icon']} ${styles[type]}`}>
            {getIcon()}
          </div>
        )}
        {dayNumber}
      </div>

      {/* Dynamic weekday based on weekIndex */}
      <p className={styles.dayOfTheWeek}>{weekdays[weekIndex]}</p>
    </div>
  );
};
