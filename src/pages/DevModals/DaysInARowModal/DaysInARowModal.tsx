import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import FireBlue from '../../../assets/icons/fire-blue.svg';
import FireRed from '../../../assets/icons/fire-red.svg';
import FirePurple from '../../../assets/icons/fire-purple.svg';
import styles from './DaysInARowModal.module.scss';
import Button from '../partials/Button';
import { useGetPushLineQuery } from '../../../redux';
import ChestBlue from '../../../assets/icons/chest-blue.svg';
import ChestPurple from '../../../assets/icons/chest-purple.svg';
import chestIcon from '../../../assets/icons/chest-red.svg';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import redLightAnimation from '../../../assets/animations/redLight.json';
import purpleLightAnimation from '../../../assets/animations/purpleLight.json';
import { useTranslation } from 'react-i18next';
import { CentralModal, ProgressLine } from '../../../components/shared';
import { StreakDay } from '../../../components/profile/ProfileStreak/StreakCard/StreakDay';

interface Props {
  days?: number;
  onClose?: () => void;
}

export default function DaysInARowModal({ onClose }: Props) {
  const { t, i18n } = useTranslation('profile');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { closeModal } = useModal();
  const { data } = useGetPushLineQuery();
  const [dayNumbers, setDayNumbers] = useState<number[]>([]);
  const [frozenDays, setFrozenDays] = useState<number[]>([]);
  const [streakDays, setStreakDays] = useState<number[]>([]);
  console.log('adsdsa')

  useEffect(() => {
    console.log('adsdsa')

    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysSinceMonday);

    const { openModal } = useModal();
    const newDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date.getDate();
    });

    setDayNumbers(newDays);

    const frozen: number[] = [];
    const streak: number[] = [];

    console.log('data changed')
    data?.week_information?.forEach((day) => {
      const dayDate = new Date(day.creation_date).getDate();
      const hasNotification =
        day.push_line_data?.is_notified_at_morning ||
        day.push_line_data?.is_notified_at_afternoon ||
        day.push_line_data?.is_notified_at_evening ||
        day.push_line_data?.is_notified_at_late_evening ||
        day.push_line_data?.is_notified_at_late_night ||
        day.push_line_data?.is_notified_at_night;

      if (day.push_line_data?.status === 'passed') {
        streak.push(dayDate);
      } else if (day.push_line_data?.status === 'unspecified' && hasNotification) {
        frozen.push(dayDate);
      }
    });

    useEffect(() => {
      const modalShownToday = localStorage.getItem('modalShownToday');
      const today = new Date().toISOString().split('T')[0];

      if (modalShownToday !== today) {
        const isTodayPassed = data?.week_information?.some(
          (entry) => entry.creation_date === today && entry.push_line_data?.status === 'passed'
        );

        if (isTodayPassed) {
          openModal(MODALS.DAYS_IN_A_ROW);
          localStorage.setItem('modalShownToday', today);
        }
      }
    }, [data, openModal]);

    setFrozenDays(frozen);
    setStreakDays(streak);
  }, [data]);

  const streakCount = streakDays.length + 1;

  const calculateLevel = () => {
    let maxStreak = 0;

    if (streakCount < 30) {
      maxStreak = 30;
    } else if (streakCount < 60) {
      maxStreak = 60;
    } else if (streakCount < 120) {
      maxStreak = 120;
    }
    const maxLevel = 5;

    return Math.min(maxLevel, Math.floor((streakCount / maxStreak) * maxLevel));
  };

  let p14Key = '';
  if (streakCount < 30) {
    p14Key = 'p14_30';
  } else if (streakCount < 60) {
    p14Key = 'p14_60';
  } else if (streakCount >= 60) {
    p14Key = 'p14_120';
  }

  return (
    <CentralModal
      modalId={MODALS.DAYS_IN_A_ROW}
      title={`${streakCount === 0 ? 0 : streakCount} ${t('p21')}`}
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
        {dayNumbers.map((day, index) => {
          const isFrozen = frozenDays.includes(day);
          const isStreak = streakDays.includes(day);

          const type = isStreak ? 'passed' : isFrozen ? 'freeze' : 'regular';

          return (
            <StreakDay
              key={day}
              dayNumber={day}
              type={type}
              weekIndex={index}
              weekData={data?.week_information ?? []}
              streakDays={streakCount}
            />
          );
        })}
      </div>

      <div className={styles.progressTitle}>
        <p>
          {streakCount}/{t(p14Key)}
        </p>
        <div className={styles.chest}>
          <p>{locale === 'ru' ? data?.next_chest.chest_name : data?.next_chest.chest_name_eng}</p>
          <img
            src={
              streakCount < 30
                ? ChestBlue
                : streakCount < 60
                  ? ChestPurple
                  : chestIcon
            }
            className={styles.chestImg}
            alt="Chest Icon"
          />
        </div>
      </div>
      <div className={styles.progress}>
        <ProgressLine
          level={calculateLevel()}
          color={streakCount < 30 ? 'blue' : streakCount < 60 ? 'purple' : 'red'}
        />
      </div>
      <Button
        onClick={onClose || (() => closeModal(MODALS.DAYS_IN_A_ROW))}
        variant={streakCount < 30 ? 'blue' : streakCount < 60 ? 'purple' : 'red'}
      >
        {t('p22')}
      </Button>
    </CentralModal>
  );
}