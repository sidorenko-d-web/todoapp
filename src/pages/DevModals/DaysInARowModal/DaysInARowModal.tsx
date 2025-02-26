import { useState, useEffect } from 'react';
import BottomModal from '../../../components/shared/BottomModal/BottomModal';
import Lottie from 'lottie-react';
import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import FireBlue from '../../../assets/icons/fire-blue.svg';
import FireRed from '../../../assets/icons/fire-red.svg';
import FirePurple from '../../../assets/icons/fire-purple.svg';
import styles from './DaysInARowModal.module.scss';
import SnowflakeIcon from '../../../assets/icons/snowflake-icon.svg';
import FireIcon from '../../../assets/icons/fire-icon.svg';
import clsx from 'clsx';
import Button from '../partials/Button';
import { useGetPushLineQuery } from '../../../redux/api/pushLine/api';
import ChestBlue from '../../../assets/icons/chest-blue.svg';
import ChestPurple from '../../../assets/icons/chest-purple.svg';
import ChestRed from '../../../assets/icons/chest-red.svg';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import redLightAnimation from '../../../assets/animations/redLight.json';
import purpleLightAnimation from '../../../assets/animations/purpleLight.json';

interface Props {
  days?: number;
  onClose?: () => void;
}

export default function DaysInARowModal({onClose}: Props) {
  const { closeModal } = useModal();
  const { data } = useGetPushLineQuery();
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const [dayNumbers, setDayNumbers] = useState<number[]>([]);
  const [frozenDays, setFrozenDays] = useState<number[]>([]);
  const [streakDays, setStreakDays] = useState<number[]>([]);

  useEffect(() => {
    setCurrentDay(new Date().getDate());

    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysSinceMonday);

    const newDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date.getDate();
    });

    setDayNumbers(newDays);

    const frozen: number[] = [];
    const streak: number[] = [];

    data?.week_information?.forEach(day => {
      const dayDate = new Date(day.date).getDate();
      const hasNotification =
        day.is_notified_at_morning ||
        day.is_notified_at_afternoon ||
        day.is_notified_at_evening ||
        day.is_notified_at_late_evening ||
        day.is_notified_at_late_night ||
        day.is_notified_at_night;

      if (day.status === 'passed') {
        streak.push(dayDate);
      } else if (day.status === 'unspecified' && hasNotification) {
        frozen.push(dayDate);
      }
    });

    setFrozenDays(frozen);
    setStreakDays(streak);
  }, [data]);

  const streakCount = streakDays.length + 1;
  const progressStage = streakCount < 30 ? 'blue' : streakCount < 60 ? 'purple' : 'red';

  return (
    <BottomModal
      modalId={MODALS.DAYS_IN_A_ROW}
      title={`${streakCount === 0 ? 0 : streakCount} дней в ударе!`}
      onClose={() => closeModal(MODALS.DAYS_IN_A_ROW)}
    >
      <div className={styles.images}>
        <Lottie
          animationData={
            streakCount < 30
              ? blueLightAnimation
              : streakCount < 60
              ? purpleLightAnimation
              : redLightAnimation
          }
          loop={true}
          className={styles.light}
        />
        <img
          className={styles.fire}
          src={streakCount < 30 ? FireBlue : streakCount < 60 ? FirePurple : FireRed}
        />
        <div className={styles.days}>
          <p>{streakCount === 0 ? 0 : streakCount}</p>
        </div>
      </div>

      <div className={styles.days}>
        {dayNumbers.map(day => {
          const isFrozen = frozenDays.includes(day);
          const isStreak = streakDays.includes(day);

          return (
            <DayItem
              key={day}
              day={day}
              isFrozen={isFrozen}
              isStreak={isStreak}
              currentDay={currentDay}
              progressStage={progressStage}
            />
          );
        })}
      </div>

      <div className={styles.progressTitle}>
        <p>
          {streakCount === 0 ? 0 : streakCount}/
          {streakCount < 30 ? '30' : streakCount < 60 ? '60' : '120'} дней
        </p>
        <div className={styles.chest}>
          <p>Каменный сундук</p>
          <img
            src={streakCount < 30 ? ChestBlue : streakCount < 60 ? ChestPurple : ChestRed}
          />
        </div>
      </div>

      <div className={styles.progress}>
        <div
          style={{
            width: `${
              (streakCount / (streakCount < 30 ? 30 : streakCount < 60 ? 60 : 120)) * 100
            }%`,
          }}
          className={clsx(
            styles.progressBar,
            streakCount >= 60
              ? styles.progressBarRed
              : streakCount >= 30 && styles.progressBarPurple,
          )}
        />
      </div>
      <Button
        onClick={onClose || (() => closeModal(MODALS.DAYS_IN_A_ROW))}
        variant={streakCount < 30 ? 'blue' : streakCount < 60 ? 'purple' : 'red'}
      >
        Отлично!
      </Button>
    </BottomModal>
  );
}

const DayItem = ({
  day,
  isFrozen,
  isStreak,
  currentDay,
  progressStage,
}: {
  day: number;
  isFrozen: boolean;
  isStreak: boolean;
  currentDay: number;
  progressStage: 'blue' | 'purple' | 'red';
}) => {
  const date = new Date();
  const isCurrentDay = currentDay === day;
  date.setDate(day);
  const weekday = date.toLocaleDateString('ru-RU', { weekday: 'short' });

  const isNormal = !isStreak && !isFrozen;

  return (
    <div className={styles.dayWrapper}>
      {isStreak ||
        (isCurrentDay && (
          <div
            className={clsx(
              styles.icon,
              progressStage === 'red' && styles.iconRed,
              progressStage === 'purple' && styles.iconPurple,
              progressStage === 'blue' && styles.iconBlue,
            )}
          >
            <img src={FireIcon} />
          </div>
        ))}

      {isFrozen && (
        <div className={clsx(styles.icon, styles.iconBlue)}>
          <img src={SnowflakeIcon} />
        </div>
      )}

      <div
        className={clsx(
          styles.day,
          isCurrentDay && styles.currentDay,
          (isFrozen || progressStage === 'blue') && styles.dayBlue,
          progressStage === 'red' && !isFrozen && styles.dayRed,
          progressStage === 'purple' && !isFrozen && styles.dayPurple,
          isNormal && !isCurrentDay && styles.dayNormal,
        )}
      >
        <p>{day}</p>
      </div>

      <p className={styles.weekday}>{weekday}</p>
    </div>
  );
};
