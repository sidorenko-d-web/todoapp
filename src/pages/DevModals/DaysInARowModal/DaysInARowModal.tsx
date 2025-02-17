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

export default function DaysInARowModal({}: Props) {
  const { closeModal } = useModal();
  const { data } = useGetPushLineQuery();
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const [dayNumbers, setDayNumbers] = useState<number[]>([]);

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
  }, []);

  const streakDays =
    data?.week_information?.filter(
      day =>
        day &&
        (day.status === 'unspecified' || day.status === 'passed') &&
        (day.is_notified_at_morning ||
          day.is_notified_at_afternoon ||
          day.is_notified_at_evening ||
          day.is_notified_at_late_evening ||
          day.is_notified_at_late_night ||
          day.is_notified_at_night),
    )?.length ?? 0;

  const progressStage =
    (streakDays ?? 0) < 30 ? 'blue' : (streakDays ?? 0) < 60 ? 'purple' : 'red';

  return (
    <BottomModal
      modalId={MODALS.DAYS_IN_A_ROW}
      title={`${streakDays} дней в ударе!`}
      onClose={() => closeModal(MODALS.DAYS_IN_A_ROW)}
    >
      <div className={styles.images}>
        <Lottie
          animationData={
            streakDays < 30
              ? blueLightAnimation
              : streakDays < 60
              ? purpleLightAnimation
              : redLightAnimation
          }
          loop={true}
          className={styles.light}
        />
        <img
          className={styles.fire}
          src={streakDays < 30 ? FireBlue : streakDays < 60 ? FirePurple : FireRed}
        />
        <div className={styles.days}>
          <p>{streakDays}</p>
        </div>
      </div>

      <div className={styles.days}>
        {dayNumbers.map(day => {
          const dayData = data?.week_information?.find(
            d => new Date(d.date).getDate() === day,
          );

          const isFrozen = !dayData;

          return (
            <DayItem
              key={day}
              day={day}
              isFrozen={isFrozen}
              currentDay={currentDay}
              progressStage={progressStage}
            />
          );
        })}
      </div>
      <div className={styles.progressTitle}>
        <p>
          {streakDays}/{streakDays < 30 ? '30' : streakDays < 60 ? '60' : '120'} дней
        </p>
        <div className={styles.chest}>
          <p>Каменный сундук</p>
          <img
            src={streakDays < 30 ? ChestBlue : streakDays < 60 ? ChestPurple : ChestRed}
          />
        </div>
      </div>

      <div className={styles.progress}>
        <div
          style={{
            width: `${
              (streakDays / (streakDays < 30 ? 30 : streakDays < 60 ? 60 : 120)) * 100
            }%`,
          }}
          className={clsx(
            styles.progressBar,
            streakDays >= 60
              ? styles.progressBarRed
              : streakDays >= 30 && styles.progressBarPurple,
          )}
        />
      </div>
      <Button variant={streakDays < 30 ? 'blue' : streakDays < 60 ? 'purple' : 'red'}>
        Отлично!
      </Button>
    </BottomModal>
  );
}

const DayItem = ({
  day,
  isFrozen,
  currentDay,
  progressStage,
}: {
  day: number;
  isFrozen: boolean;
  currentDay: number;
  progressStage: 'blue' | 'purple' | 'red';
}) => {
  const date = new Date();
  date.setDate(day);
  const weekday = date.toLocaleDateString('ru-RU', { weekday: 'short' });

  return (
    <div className={styles.dayWrapper}>
      <div
        className={clsx(
          styles.icon,
          isFrozen
            ? styles.iconFrozen
            : progressStage === 'red'
            ? styles.iconRed
            : progressStage === 'purple'
            ? styles.iconPurple
            : styles.iconBlue,
        )}
      >
        <img src={isFrozen ? SnowflakeIcon : FireIcon} />
      </div>
      <div
        className={clsx(
          styles.day,
          isFrozen
            ? styles.dayFrozen
            : progressStage === 'red'
            ? styles.dayRed
            : progressStage === 'purple'
            ? styles.dayPurple
            : styles.dayBlue,
          currentDay === day && styles.currentDay,
        )}
      >
        <p>{day}</p>
      </div>
      <p className={styles.weekday}>{weekday}</p>
    </div>
  );
};
