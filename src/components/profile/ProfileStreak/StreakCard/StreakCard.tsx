import React, { useMemo } from 'react';
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
import clsx from 'clsx';
import { isGuideShown } from '../../../../utils';
import { GUIDE_ITEMS } from '../../../../constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux';

interface WeekData {
  date: string;
  status: string;
  is_notified_at_morning: boolean;
  is_notified_at_afternoon: boolean;
  is_notified_at_evening: boolean;
  is_notified_at_late_evening: boolean;
  is_notified_at_night: boolean;
  is_notified_at_late_night: boolean;
  in_streak_days?: number;
}

interface StreakCardProps {
  days?: { day: number; type: DayType }[];
  onlyStreak?: boolean;
  streakDays: number | undefined;
  status: string | undefined;
  chest: string | undefined;
  weekData?: {
    creation_date: string;
    push_line_data: WeekData;
  }[];
  strangerId?: string;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  days,
  onlyStreak,
  streakDays,
  status,
  chest,
  weekData,
  strangerId,
}) => {
  const { t } = useTranslation('profile');

  const showFreezeGuide = useSelector((state: RootState) => state.guide.showFreezeGuide);

  // Get the most reliable streak count
  const reliableStreakDays = useMemo(() => {
    // First check if in_streak_days exists in weekData
    const inStreakDays = weekData?.[0]?.push_line_data?.in_streak_days;

    if (typeof inStreakDays === 'number' && !isNaN(inStreakDays)) {
      return inStreakDays;
    }

    // Otherwise use the prop value
    return typeof streakDays === 'number' && !isNaN(streakDays) ? streakDays : 0;
  }, [streakDays, weekData]);

  // Calculate level based on streak days
  const level = useMemo(() => {
    // For streaks 0-29: progress from 0 to 3
    // For streaks 30-59: level 4
    // For streaks 60+: level 5

    if (reliableStreakDays >= 60) {
      return 5;
    } else if (reliableStreakDays >= 30) {
      return 4;
    } else if (reliableStreakDays > 0) {
      // For streaks 1-29, calculate proportional level (max 3)
      const calculatedLevel = Math.ceil((reliableStreakDays / 30) * 3);
      return Math.min(3, Math.max(1, calculatedLevel));
    }

    return 0; // Default level for 0 streaks
  }, [reliableStreakDays]);

  // Determine the correct milestone text key
  const p14Key = useMemo(() => {
    if (reliableStreakDays >= 60) return 'p14_120';
    if (reliableStreakDays >= 30) return 'p14_60';
    return 'p14_30';
  }, [reliableStreakDays]);

  // Determine color based on streak days
  const color = useMemo(() => {
    if (reliableStreakDays >= 60) return 'red';
    if (reliableStreakDays >= 30) return 'purple';
    return 'blue';
  }, [reliableStreakDays]);

  // Determine the appropriate chest icon
  const chestImage = useMemo(() => {
    if (reliableStreakDays >= 60) return chestIcon;
    if (reliableStreakDays >= 30) return ChestPurple;
    return ChestBlue;
  }, [reliableStreakDays]);

  // Determine the appropriate fire icon
  const fireIcon = useMemo(() => {
    if (reliableStreakDays >= 60) return FireRed;
    if (reliableStreakDays >= 30) return FirePurple;
    return FireBlue;
  }, [reliableStreakDays]);

  const elevateCard =
    (isGuideShown(GUIDE_ITEMS.profilePage.PROFILE_FIRST_GUIDE) &&
      !isGuideShown(GUIDE_ITEMS.profilePage.PROFILE_SECOND_GUIDE_SHOWN)) ||
    (isGuideShown(GUIDE_ITEMS.profilePage.PROFILE_SECOND_GUIDE_SHOWN) &&
      !isGuideShown(GUIDE_ITEMS.profilePage.PROFILE_THIRD_GUIDE_SHOWN));

  const elevatedFreeze =
    isGuideShown(GUIDE_ITEMS.profilePage.PROFILE_SECOND_GUIDE_SHOWN) &&
    !isGuideShown(GUIDE_ITEMS.profilePage.PROFILE_THIRD_GUIDE_SHOWN);

  return (
    <div className={`${styles.wrp} ${elevateCard ? styles.elevated : ''} ${elevatedFreeze ? styles.noBorder : ''}`}>
      <div className={styles.header}>
        <div className={styles.daysInARowWrp}>
          <span
            className={
              reliableStreakDays >= 60 ? styles.badgeRed : reliableStreakDays >= 30 ? styles.badgePurple : styles.badge
            }
            style={showFreezeGuide ? { filter: 'grayscale(100%)' } : undefined}
          >
            {!showFreezeGuide ? status : t('p12_5')}
          </span>

          <div className={styles.title}>
            <span className={clsx(styles.daysInARow, strangerId && styles.stranger)}>
              {!showFreezeGuide ? reliableStreakDays : '0'} {t('p13').replace('в ', 'в\u00A0')}
            </span>
            {!strangerId && !onlyStreak && (
              <div
                className={`${styles.freezeCount} ${elevatedFreeze ? styles.elevatedFreeze : ''}
               ${elevatedFreeze ? styles.border12 : ''}`}
              >
                <span>{streakDays}</span>
                <img src={snowflake} alt="Freeze Icon" />
              </div>
            )}
          </div>
        </div>
        <div className={clsx(styles.fire, styles.stranger)}>
          <img src={fireIcon} alt="Fire Icon" style={showFreezeGuide ? { filter: 'grayscale(100%)' } : undefined} />
        </div>
      </div>

      {!strangerId && !onlyStreak && (
        <>
          {days && (
            <div className={styles.streakDays}>
              {days.map(({ day, type }, index) => (
                <StreakDay
                  key={day}
                  streakDays={reliableStreakDays}
                  dayNumber={day}
                  type={showFreezeGuide ? 'regular' : type}
                  weekIndex={index}
                  weekData={weekData ?? []}
                />
              ))}
            </div>
          )}

          <div className={styles.progressContainer}>
            <div className={`${styles['progressBarTextWrp']} ${styles['progressText']}`}>
              <span>
                {!showFreezeGuide ? reliableStreakDays : 0}/{t(p14Key)}
              </span>
              <span className={styles.reward}>
                {chest}
                <div className={styles.chestImgContainer}>
                  <img src={chestImage} className={styles.chestImg} alt="Chest Icon" />
                </div>
              </span>
            </div>

            <ProgressLine level={!showFreezeGuide ? level : 0} color={color} />
          </div>
        </>
      )}
    </div>
  );
};
