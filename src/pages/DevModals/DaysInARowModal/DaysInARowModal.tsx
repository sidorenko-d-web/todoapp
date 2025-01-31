import BottomModal from '../../../components/shared/BottomModal/BottomModal';
import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import BgLightBlue from '../../../assets/icons/bg-light-blue.svg';
import BgRedBlue from '../../../assets/icons/bg-light-red.svg';
import BgRedPurple from '../../../assets/icons/bg-light-purple.svg';
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

interface Props {
  days?: number;
  quality?: TypeItemQuality;
}

export default function DaysInARowModal({ days = 90 }: Props) {
  const { closeModal } = useModal();

  return (
    <BottomModal
      modalId={MODALS.DAYS_IN_A_ROW}
      title={`${days} дней в ударе!`}
      onClose={() => closeModal(MODALS.DAYS_IN_A_ROW)}
    >
      <div className={styles.images}>
        <img className={styles.light} src={days < 30 ? BgLightBlue : days < 60 ? BgRedPurple : BgRedBlue} />
        <img className={styles.fire} src={days < 30 ? FireBlue : days < 60 ? FirePurple : FireRed} />
        <div className={styles.days}>
          <p>{days}</p>
        </div>
      </div>
      <div className={styles.days}>
        <DayItem day={11} isActive={true} quality={days < 30 ? 'blue' : days < 60 ? 'purple' : 'red'} />
        <DayItem day={12} isActive={true} quality={days < 30 ? 'blue' : days < 60 ? 'purple' : 'red'} />
        <DayItem day={13} isActive={false} quality={days < 30 ? 'blue' : days < 60 ? 'purple' : 'red'} />
        <DayItem day={14} isActive={true} quality={days < 30 ? 'blue' : days < 60 ? 'purple' : 'red'} />
        <DayItem day={15} isActive={false} quality={days < 30 ? 'blue' : days < 60 ? 'purple' : 'red'} />
        <DayItem day={16} isActive={false} quality={days < 30 ? 'blue' : days < 60 ? 'purple' : 'red'} />
        <DayItem day={17} isActive={false} quality={days < 30 ? 'blue' : days < 60 ? 'purple' : 'red'} />
      </div>

      <div className={styles.progressTitle}>
        <p>
          {days}/{days < 30 ? '30' : days < 60 ? '60' : '120'} дней
        </p>
        <div className={styles.chest}>
          <p>Каменный сундук</p>
          <img src={days < 30 ? ChestBlue : days < 60 ? ChestPurple : ChestRed} alt="" />
        </div>
      </div>
      <div className={styles.progress}>
        <div
          style={{ width: `${(days / (days < 30 ? 30 : days < 60 ? 60 : 120)) * 100}%` }}
          className={clsx(
            styles.progressBar,
            days >= 60 ? styles.progressBarRed : days >= 30 && styles.progressBarPurple,
          )}
        />
      </div>

      <Button variant={days < 30 ? 'blue' : days < 60 ? 'red' : 'red'}>Отлично!</Button>
    </BottomModal>
  );
}

const DayItem = ({ day, isActive, quality }: { day: number; isActive: boolean; quality: string }) => {
  return (
    <div className={styles.dayWrapper}>
      <div
        className={clsx(
          styles.icon,
          quality === 'red' && isActive ? styles.iconRed : quality === 'purple' && isActive && styles.iconPurple,
        )}
      >
        <img src={isActive ? FireIcon : SnowflakeIcon} />
      </div>
      <div
        className={clsx(
          styles.day,
          quality === 'red' && isActive ? styles.dayRed : quality === 'purple' && isActive && styles.dayPurple,
        )}
      >
        <p>{day}</p>
      </div>
      <p className={styles.weekday}>пн</p>
    </div>
  );
};
