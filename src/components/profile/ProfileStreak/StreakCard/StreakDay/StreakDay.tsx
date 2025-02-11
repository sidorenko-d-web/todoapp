import React, { useEffect, useState } from 'react';
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
  const [lang, setLang] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState<number | null>(null);

  useEffect(() => {
    setLang(localStorage.getItem('selectedLanguage'));

    const today = new Date().getDate();
    setCurrentDay(today);
  }, []);

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

  const weekdaysRu = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  const weekdaysEn = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  return (
    <div>
      <div
        className={`${styles['calendar-day']} ${styles[type]} ${
          currentDay === dayNumber ? styles.currentDay : ''
        }`}
      >
        {(type === 'streak' || type === 'freeze') && (
          <div className={`${styles['status-icon']} ${styles[type]}`}>{getIcon()}</div>
        )}
        {dayNumber}
      </div>

      {/* Dynamic weekday based on weekIndex */}
      <p className={styles.dayOfTheWeek}>
        {lang === 'en' ? weekdaysEn[weekIndex] : weekdaysRu[weekIndex]}
      </p>
    </div>
  );
};
