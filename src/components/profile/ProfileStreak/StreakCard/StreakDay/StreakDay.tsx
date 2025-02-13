import React, { useEffect, useState } from 'react';
import styles from './StreakDay.module.scss';

import fireIcon from '../../../../../assets/icons/streak-fire.svg';
import freezeIcon from '../../../../../assets/icons/streak-freeze.svg';
import { DayType } from '../../../../../types';

interface StreakDayProps {
  dayNumber: number;
  type: DayType;
  weekIndex: number;
  failedDay: number;
  streakCount: number;
}

export const StreakDay: React.FC<StreakDayProps> = ({
  dayNumber,
  type,
  weekIndex,
  failedDay,
  streakCount,
}) => {
  const [lang, setLang] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [currentWeekdayIndex, setCurrentWeekdayIndex] = useState<number | null>(null);

  useEffect(() => {
    setLang(localStorage.getItem('selectedLanguage'));

    const today = new Date();
    setCurrentDay(today.getDate());
    setCurrentWeekdayIndex(today.getDay() === 0 ? 6 : today.getDay() - 1); // Преобразуем getDay(), где 0 - это воскресенье
  }, []);

  const isStreakDay =
    streakCount > 0 && dayNumber > currentDay - streakCount && dayNumber <= currentDay;
  const isFailedDay = failedDay === dayNumber;

  const weekdaysRu = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  const weekdaysEn = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const getIcon = () => {
    if (failedDay === dayNumber) return <img src={freezeIcon} />;
    if (
      streakCount > 0 &&
      dayNumber > currentDay - streakCount &&
      dayNumber <= currentDay
    ) {
      return <img src={fireIcon} />;
    }
    return null;
  };
  return (
    <div>
      <div
        className={`${styles['calendar-day']} 
          ${isFailedDay ? styles.freeze : isStreakDay ? styles.streak : styles[type]} 
          ${currentDay === dayNumber ? styles.currentDay : ''}`}
      >
        {(isStreakDay || isFailedDay) && (
          <div
            className={`${styles['status-icon']} ${
              isFailedDay ? styles.freeze : styles.streak
            }`}
          >
            {getIcon()}
          </div>
        )}
        {dayNumber}
      </div>

      {/* Dynamic weekday based on weekIndex */}
      <p
        className={`${styles.dayOfTheWeek} ${
          currentWeekdayIndex === weekIndex ? styles.dayOfTheWeekActive : ''
        }`}
      >
        {lang === 'en' ? weekdaysEn[weekIndex] : weekdaysRu[weekIndex]}
      </p>
    </div>
  );
};
