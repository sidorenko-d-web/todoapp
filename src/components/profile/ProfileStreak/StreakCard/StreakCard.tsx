import React from 'react';
import styles from './StreakCard.module.scss';
import ChestBlue from '../../../../assets/icons/chest-blue.svg';
import ChestPurple from '../../../../assets/icons/chest-purple.svg';
import FireBlue from '../../../../assets/icons/fire-blue.svg';
import FireRed from '../../../../assets/icons/fire-red.svg';
import FirePurple from '../../../../assets/icons/fire-purple.svg';
import chestIcon from '../../../../assets/icons/chest-red.svg';
import snowflake from '../../../../assets/icons/snowflake.svg';
import { ProgressLine } from '../../../shared';
import { DayType } from '../../../../types';
import { StreakDay } from './StreakDay';
import { useTranslation } from 'react-i18next';

interface WeekData {
  date: string;
  status: string;
  is_notified_at_morning: boolean;
  is_notified_at_afternoon: boolean;
  is_notified_at_evening: boolean;
  is_notified_at_late_evening: boolean;
  is_notified_at_night: boolean;
  is_notified_at_late_night: boolean;
}

interface StreakCardProps {
  days?: { day: number; type: DayType }[];
  onlyStreak?: boolean;
  streakDays: number;
  status: string | undefined;
  chest: string | undefined;
  frozenDays?: number;
  weekData?: {
    creation_date: string;
    push_line_data: WeekData;
  }[]
}

export const StreakCard: React.FC<StreakCardProps> = ({
  days,
                                                        onlyStreak, streakDays, status, chest,
  frozenDays,
  weekData,
}) => {
  const { t } = useTranslation('profile');

  console.log('week:', days, weekData);
  console.log('streak', onlyStreak, streakDays);
  console.log('frozenDays:', frozenDays);

  const calculateLevel = () => {
    let maxStreak = 0;

    if (streakDays < 30) {
      maxStreak = 30;
    } else if (streakDays < 60) {
      maxStreak = 60;
    } else if (streakDays < 120) {
      maxStreak = 120;
    }
    const maxLevel = 5;

    return Math.min(maxLevel, Math.floor((streakDays / maxStreak) * maxLevel));
  };

  let p14Key = '';
  if (streakDays < 30) {
    p14Key = 'p14_30';
  } else if (streakDays < 60) {
    p14Key = 'p14_60';
  } else if (streakDays >= 60) {
    p14Key = 'p14_120';
  }

  return (
    <div className={styles.wrp}>
      <div className={styles.header}>
        <div className={styles.daysInARowWrp}>
          <span
            className={
              streakDays < 30
                ? styles.badge
                : streakDays < 60
                ? styles.badgePurple
                : styles.badgeRed
            }
          >
            {status}
          </span>

          <div className={styles.title}>
            <span className={styles.daysInARow}>
              {streakDays} {t('p13').replace("в ", "в\u00A0")}
            </span>
            {!onlyStreak && (
              <div className={styles.freezeCount}>
                <span>{frozenDays}</span>
                <img src={snowflake} alt="Freeze Icon" />
              </div>
            )}
          </div>
        </div>
        <div className={styles.fire}>
          <img
            src={streakDays < 30 ? FireBlue : streakDays < 60 ? FirePurple : FireRed}
          />
        </div>
      </div>

      {!onlyStreak && (
        <>
          {days && (
            <div className={styles.streakDays}>
              {days.map(({ day, type }, index) => (
                <StreakDay
                  key={day}
                  streakDays={streakDays}
                  dayNumber={day}
                  type={type}
                  weekIndex={index}
                  weekData={weekData ?? []}
                />
              ))}
            </div>
          )}

          <div className={styles.progressContainer}>
            <div className={`${styles['progressBarTextWrp']} ${styles['progressText']}`}>
              <span>
                {streakDays}/{t(p14Key)}
              </span>
              <span className={styles.reward}>
                {chest}
                <div className={styles.chestImgContainer}>
                  <img
                    src={
                      streakDays < 30
                        ? ChestBlue
                        : streakDays < 60
                        ? ChestPurple
                        : chestIcon
                    }
                    className={styles.chestImg}
                    alt="Chest Icon"
                  />
                </div>
              </span>
            </div>

            <ProgressLine
              level={calculateLevel()}
              color={streakDays < 30 ? 'blue' : streakDays < 60 ? 'purple' : 'red'}
            />
          </div>
        </>
      )}
    </div>
  );
};
