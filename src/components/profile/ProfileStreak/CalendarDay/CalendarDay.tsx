import React from 'react';
import styles from './CalendarDay.module.scss';

import fireIcon from '../../../../assets/icons/streak-fire.svg';
import freezeIcon from '../../../../assets/icons/streak-freeze.svg';


export type DayType = 'streak' | 'freeze' | 'regular';

interface CalendarDayProps {
  dayNumber: number;
  type: DayType;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({ dayNumber, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'streak':
        return <img src={fireIcon} alt="Streak" />;
      case 'freeze':
        return <img src={freezeIcon} alt="Freeze" />;
      default:
        return null;
    }
  };

  return (
    <div className={`${styles['calendar-day']} ${styles[type]}`}>
      {(type === 'streak' || type === 'freeze') && (
        <div className={`${styles['status-icon']} ${styles[type]}`}>
          {getIcon()}
        </div>
      )}
      {dayNumber}
    </div>
  );
};
