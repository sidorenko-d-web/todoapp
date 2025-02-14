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
import ChestBlue from '../../../assets/icons/chest-blue.svg';
import ChestPurple from '../../../assets/icons/chest-purple.svg';
import ChestRed from '../../../assets/icons/chest-red.svg';
import Button from '../partials/Button';
import { TypeItemQuality } from '../../../redux';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import redLightAnimation from '../../../assets/animations/redLight.json';
import purpleLightAnimation from '../../../assets/animations/purpleLight.json';
import { useGetPushLineQuery } from '../../../redux/api/pushLine/api';
interface Props {
  days?: number;
  quality?: TypeItemQuality;
}

export default function DaysInARowModal({ days = 90 }: Props) {
  const { closeModal } = useModal();
  const { data } = useGetPushLineQuery();
  return (
    <BottomModal
      modalId={MODALS.DAYS_IN_A_ROW}
      title={`${data?.in_streak_days} дней в ударе!`}
      onClose={() => closeModal(MODALS.DAYS_IN_A_ROW)}
    >
      <div className={styles.images}>
        {data?.in_streak_days < 30 ? (
          <Lottie
            animationData={blueLightAnimation}
            loop={true}
            className={styles.light}
          />
        ) : data?.in_streak_days < 60 ? (
          <Lottie
            animationData={purpleLightAnimation}
            loop={true}
            className={styles.light}
          />
        ) : (
          <Lottie
            animationData={redLightAnimation}
            loop={true}
            className={styles.light}
          />
        )}
        <img
          className={styles.fire}
          src={
            data?.in_streak_days < 30
              ? FireBlue
              : data?.in_streak_days < 60
              ? FirePurple
              : FireRed
          }
        />
        <div className={styles.days}>
          <p>{data?.in_streak_days}</p>
        </div>
      </div>
      <div className={styles.days}>
        <DayItem
          day={11}
          isActive={true}
          quality={
            data?.in_streak_days < 30
              ? 'blue'
              : data?.in_streak_days < 60
              ? 'purple'
              : 'red'
          }
        />
        <DayItem
          day={12}
          isActive={true}
          quality={
            data?.in_streak_days < 30
              ? 'blue'
              : data?.in_streak_days < 60
              ? 'purple'
              : 'red'
          }
        />
        <DayItem
          day={13}
          isActive={false}
          quality={
            data?.in_streak_days < 30
              ? 'blue'
              : data?.in_streak_days < 60
              ? 'purple'
              : 'red'
          }
        />
        <DayItem
          day={14}
          isActive={true}
          quality={
            data?.in_streak_days < 30
              ? 'blue'
              : data?.in_streak_days < 60
              ? 'purple'
              : 'red'
          }
        />
        <DayItem
          day={15}
          isActive={false}
          quality={
            data?.in_streak_days < 30
              ? 'blue'
              : data?.in_streak_days < 60
              ? 'purple'
              : 'red'
          }
        />
        <DayItem
          day={16}
          isActive={false}
          quality={
            data?.in_streak_days < 30
              ? 'blue'
              : data?.in_streak_days < 60
              ? 'purple'
              : 'red'
          }
        />
        <DayItem
          day={17}
          isActive={false}
          quality={
            data?.in_streak_days < 30
              ? 'blue'
              : data?.in_streak_days < 60
              ? 'purple'
              : 'red'
          }
        />
      </div>

      <div className={styles.progressTitle}>
        <p>
          {data?.in_streak_days}/
          {data?.in_streak_days < 30 ? '30' : data?.in_streak_days < 60 ? '60' : '120'}{' '}
          дней
        </p>
        <div className={styles.chest}>
          <p>Каменный сундук</p>
          <img
            src={
              data?.in_streak_days < 30
                ? ChestBlue
                : data?.in_streak_days < 60
                ? ChestPurple
                : ChestRed
            }
            alt=""
          />
        </div>
      </div>
      <div className={styles.progress}>
        <div
          style={{
            width: `${
              (data?.in_streak_days /
                (data?.in_streak_days < 30 ? 30 : data?.in_streak_days < 60 ? 60 : 120)) *
              100
            }%`,
          }}
          className={clsx(
            styles.progressBar,
            data?.in_streak_days >= 60
              ? styles.progressBarRed
              : data?.in_streak_days >= 30 && styles.progressBarPurple,
          )}
        />
      </div>

      <Button
        variant={
          data?.in_streak_days < 30 ? 'blue' : data?.in_streak_days < 60 ? 'red' : 'red'
        }
      >
        Отлично!
      </Button>
    </BottomModal>
  );
}

const DayItem = ({
  day,
  isActive,
  quality,
}: {
  day: number;
  isActive: boolean;
  quality: string;
}) => {
  return (
    <div className={styles.dayWrapper}>
      <div
        className={clsx(
          styles.icon,
          quality === 'red' && isActive
            ? styles.iconRed
            : quality === 'purple' && isActive && styles.iconPurple,
        )}
      >
        <img src={isActive ? FireIcon : SnowflakeIcon} />
      </div>
      <div
        className={clsx(
          styles.day,
          quality === 'red' && isActive
            ? styles.dayRed
            : quality === 'purple' && isActive && styles.dayPurple,
        )}
      >
        <p>{day}</p>
      </div>
      <p className={styles.weekday}>пн</p>
    </div>
  );
};
