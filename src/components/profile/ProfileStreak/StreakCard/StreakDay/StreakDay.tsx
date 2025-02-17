import React, { useEffect, useState } from 'react';
import styles from './StreakDay.module.scss';

import fireIcon from '../../../../../assets/icons/streak-fire.svg';
import freezeIcon from '../../../../../assets/icons/streak-freeze.svg';
import { DayType } from '../../../../../types';

interface WeekData {
  date: string;
  status: string;
  is_notified_at_morning: boolean;
  is_notified_at_afternoon: boolean;
  is_notified_at_evening: boolean;
  is_notified_at_late_evening: boolean;
  is_notified_at_late_night: boolean;
  is_notified_at_night: boolean;
}

interface StreakDayProps {
  dayNumber: number;
  type: DayType;
  weekIndex: number;
  weekData: WeekData[];
}

export const StreakDay: React.FC<StreakDayProps> = ({
  dayNumber,
  type,
  weekIndex,
  weekData,
}) => {
  const [lang, setLang] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [currentWeekdayIndex, setCurrentWeekdayIndex] = useState<number | null>(null);

  useEffect(() => {
    setLang(localStorage.getItem('selectedLanguage'));

    const today = new Date();
    setCurrentDay(today.getDate());
    setCurrentWeekdayIndex(today.getDay() === 0 ? 6 : today.getDay() - 1); // 0 - воскресенье
  }, []);

  const currentDayInfo = weekData.find(day => {
    return new Date(day.date).getDate() === dayNumber;
  });

  const isStreakDay =
    currentDayInfo &&
    (currentDayInfo.status === 'unspecified' || currentDayInfo.status === 'passed') &&
    (currentDayInfo.is_notified_at_morning ||
      currentDayInfo.is_notified_at_afternoon ||
      currentDayInfo.is_notified_at_evening ||
      currentDayInfo.is_notified_at_late_evening ||
      currentDayInfo.is_notified_at_late_night ||
      currentDayInfo.is_notified_at_night);

  const isFailedDay =
    currentDayInfo && currentDayInfo.status === 'passed' && !isStreakDay;

  const weekdaysRu = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  const weekdaysEn = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const getIcon = () => {
    if (isFailedDay) return <img src={freezeIcon} />;
    if (isStreakDay) return <img src={fireIcon} />;
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

      {/* День недели */}
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
