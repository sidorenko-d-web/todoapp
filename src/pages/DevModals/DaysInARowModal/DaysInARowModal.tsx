import { useEffect, useState, useMemo } from 'react';
import Lottie from 'lottie-react';
import { AppRoute, GUIDE_ITEMS, MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import FireBlue from '../../../assets/icons/fire-blue.svg';
import FireRed from '../../../assets/icons/fire-red.svg';
import FirePurple from '../../../assets/icons/fire-purple.svg';
import styles from './DaysInARowModal.module.scss';
import Button from '../partials/Button';
import { RootState, useGetPushLineQuery } from '../../../redux';
import ChestBlue from '../../../assets/icons/chest-blue.svg';
import ChestPurple from '../../../assets/icons/chest-purple.svg';
import chestIcon from '../../../assets/icons/chest-red.svg';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import redLightAnimation from '../../../assets/animations/redLight.json';
import purpleLightAnimation from '../../../assets/animations/purpleLight.json';
import { useTranslation } from 'react-i18next';
import { CentralModal, ProgressLine } from '../../../components/shared';
import { StreakDay } from '../../../components/profile/ProfileStreak/StreakCard/StreakDay';
import { isGuideShown, setGuideShown } from '../../../utils';
import { IntegrationCreatedGuide } from '../../../components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface Props {
  days?: number;
  onClose?: () => void;
}

export default function DaysInARowModal({ onClose }: Props) {
  const { t, i18n } = useTranslation('profile');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { closeModal, openModal } = useModal();
  const { data, isLoading } = useGetPushLineQuery();
  const [dayNumbers, setDayNumbers] = useState<number[]>([]);
  const [frozenDays, setFrozenDays] = useState<number[]>([]);
  const [streakDays, setStreakDays] = useState<number[]>([]);

  const navigate = useNavigate();


  useEffect(() => {
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

    const modalShownToday = localStorage.getItem('modalShownToday');
    const todayDate = new Date().toISOString().split('T')[0];

    if (modalShownToday !== todayDate && isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN)) {
      const isTodayPassed = data?.week_information?.some(
        (entry) => entry.creation_date === todayDate && entry.push_line_data?.status === 'passed'
      );

      if (isTodayPassed && isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN)) {
        openModal(MODALS.DAYS_IN_A_ROW);
        localStorage.setItem('modalShownToday', todayDate);
      }
    }

    setFrozenDays(frozen);
    setStreakDays(streak);
  }, [data?.current_status, isLoading, openModal]);

  // Get the reliable streak count
  const streakCount = useMemo(() => {
    // First check if in_streak_days exists in data
    if (data?.in_streak_days !== undefined && data?.in_streak_days !== null) {
      return data.in_streak_days;
    }

    // Otherwise use the calculated streak days length
    return streakDays.length;
  }, [data, streakDays]);

  // Improved calculateLevel function
  const calculateLevel = useMemo(() => {
    // For streaks 0: level 0
    // For streaks 1-29: levels 1-3 (proportionally)
    // For streaks 30-59: level 4
    // For streaks 60+: level 5

    if (streakCount >= 60) {
      return 5;
    } else if (streakCount >= 30) {
      return 4;
    } else if (streakCount > 0) {
      // For streaks 1-29, calculate proportional level (max 3)
      const calculatedLevel = Math.ceil((streakCount / 30) * 3);
      return Math.min(3, Math.max(1, calculatedLevel));
    }

    return 0; // Default level for 0 streaks
  }, [streakCount]);

  // Determine the milestone text key
  const p14Key = useMemo(() => {
    if (streakCount >= 60) return 'p14_120';
    if (streakCount >= 30) return 'p14_60';
    return 'p14_30';
  }, [streakCount]);

  // Determine the color based on streak count
  const color = useMemo(() => {
    if (streakCount >= 60) return 'red';
    if (streakCount >= 30) return 'purple';
    return 'blue';
  }, [streakCount]);

  // Determine the animation data
  const animationData = useMemo(() => {
    if (streakCount >= 60) return redLightAnimation;
    if (streakCount >= 30) return purpleLightAnimation;
    return blueLightAnimation;
  }, [streakCount]);

  // Determine the fire icon
  const fireIcon = useMemo(() => {
    if (streakCount >= 60) return FireRed;
    if (streakCount >= 30) return FirePurple;
    return FireBlue;
  }, [streakCount]);

  // Determine the chest icon
  const chestImage = useMemo(() => {
    if (streakCount >= 60) return chestIcon;
    if (streakCount >= 30) return ChestPurple;
    return ChestBlue;
  }, [streakCount]);

  const integrationId = useSelector((state: RootState) => state.guide.lastIntegrationId);

  return (
    <>
      <CentralModal
        modalId={MODALS.DAYS_IN_A_ROW}
        title={`${streakCount} ${t('p21')}`}
        onClose={() => closeModal(MODALS.DAYS_IN_A_ROW)}
      >
        <div className={styles.images}>
          <Lottie
            animationData={animationData}
            loop={true}
            className={styles.light}
          />
          <img
            className={styles.fire}
            src={fireIcon}
            alt="Fire Icon"
          />
          <div className={styles.days}>
            <p>{streakCount}</p>
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
          <span>
            {streakCount}/{t(p14Key)}
          </span>
          <div className={styles.chest}>
            <span>{locale === 'ru' ? data?.next_chest.chest_name : data?.next_chest.chest_name_eng}</span>
            <img
              src={chestImage}
              className={styles.chestImg}
              alt="Chest Icon"
            />
          </div>
        </div>
        <div className={styles.progress}>
          <ProgressLine
            level={calculateLevel}
            color={color}
          />
        </div>
        <Button
          onClick={onClose || (() => closeModal(MODALS.DAYS_IN_A_ROW))}
          variant={color}
        >
          {t('p22')}
        </Button>

        {
          !isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN) &&
          <IntegrationCreatedGuide
          onClose={() => {
            closeModal(MODALS.DAYS_IN_A_ROW);
            setGuideShown(GUIDE_ITEMS.creatingIntegration.GO_TO_INTEGRATION_GUIDE_SHOWN);
            navigate(AppRoute.Integration.replace(':integrationId', integrationId));
            //setRerender((prev) => prev + 1);
          }}
        />
        }
      </CentralModal>

    </>
  );
}