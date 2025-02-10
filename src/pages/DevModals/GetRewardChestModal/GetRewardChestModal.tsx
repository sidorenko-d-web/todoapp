import CentralModal from '../../../components/shared/CentralModal/CentralModal';
import { MODALS } from '../../../constants/modals';
import { useModal } from '../../../hooks';
import styles from './GetRewardChestModal.module.scss';
import Button from '../partials/Button';
import coin from '../../../assets/icons/coin.png';
import integration from '../../../assets/icons/integration-white.svg';
import snowflake from '../../../assets/icons/snowflake.svg';
import Lottie from 'lottie-react';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import chestAnimation from '../../../assets/animations/kamen_fixed.json';
import reward from '../../../assets/animations/reward.json';
import { localStorageConsts } from '../../../constants';

export default function GetRewardChestModal() {
  const { closeModal } = useModal();
  const handleClose = () => {
    closeModal(MODALS.TASK_CHEST);
    localStorage.removeItem(localStorageConsts.IS_NEED_TO_OPEN_CHEST)
  };
  return (
    <CentralModal
      onClose={handleClose}
      modalId={MODALS.TASK_CHEST}
      title={'Сундук открыт!'}
    >
      <div className={styles.background}>
        <Lottie animationData={reward} loop={false} className={styles.reward} />
      </div>
      <div className={styles.images}>
        <Lottie animationData={blueLightAnimation} loop={true} className={styles.light} />
      </div>
      <div className={styles.info}>
        <Lottie animationData={chestAnimation} loop={false} className={styles.chest} />
        <div className={styles.items}>
          <div className={styles.item}>
            <p>+150</p>
            <img src={coin} />
          </div>
          <div className={styles.item}>
            <p>+3</p>
            <img src={integration} />
          </div>
          <div className={styles.item}>
            <p>+1</p>
            <img src={snowflake} />
          </div>
          <div className={styles.itemIcon}>Adv.</div>
        </div>
        <div className={styles.desc}>
          <p>
            Поздравляем! Вы получили дополнительные интеграции, заморозку и учлучшение
            предмета!
          </p>
        </div>
      </div>
      <div className={styles.button}>
        <Button variant={'blue'} onClick={handleClose}>
          Забрать
        </Button>
      </div>
    </CentralModal>
  );
}
