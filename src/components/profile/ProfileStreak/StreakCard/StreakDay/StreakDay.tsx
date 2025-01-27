import React from 'react';
import styles from './StreakDay.module.scss';

import fireIcon from '../../../../../assets/icons/streak-fire.svg';
import freezeIcon from '../../../../../assets/icons/streak-freeze.svg';
import { DayType } from '../../../../../types';


interface StreakDayProps {
  dayNumber: number;
  type: DayType;
}

export const StreakDay: React.FC<StreakDayProps> = ({ dayNumber, type }) => {
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

      <p className={styles.dayOfTheWeek}>чт</p>
    </div>
  );
};
