import CentralModal from '../../../components/shared/CentralModal/CentralModal';
import { MODALS } from '../../../constants/modals';
import { useModal } from '../../../hooks';
import styles from './TaskCompletedModal.module.scss';

import Button from '../partials/Button';
import coin from '../../../assets/icons/coin.svg';
import subscribers from '../../../assets/icons/subscribers.svg';
import Lottie from 'lottie-react';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import reward from '../../../assets/animations/reward.json';

export default function TaskCompletedModal() {
  const { closeModal } = useModal();
  return (
    <CentralModal
      onClose={() => closeModal(MODALS.TASK_COMPLETED)}
      modalId={MODALS.TASK_COMPLETED}
      title={'Задание выполнено!'}
    >
      <div className={styles.background}>
        <Lottie animationData={reward} loop={false} className={styles.reward} />
      </div>
      <div className={styles.info}>
        <div className={styles.top}>
          <div className={styles.item}>
            <div className={styles.bg}>
              <Lottie animationData={blueLightAnimation} loop={true} className={styles.light} />
            </div>
            <div className={styles.content}>
              <p>+100</p>
              <img src={coin} />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.bg}>
              <Lottie animationData={blueLightAnimation} loop={true} className={styles.light} />
            </div>
            <div className={styles.content}>
              <p>+150</p>
              <img src={subscribers} />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.bg}>
              <Lottie animationData={blueLightAnimation} loop={true} className={styles.light} />
            </div>
            <div className={styles.content}>
              <p>+5</p>
              <img src={coin} />
              <p>/сек.</p>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>
            Поздравляем! За выполнение задания вы <br></br>получаете дополнительные бонусы!
          </p>
        </div>
      </div>
      <Button variant={'blue'}>Забрать</Button>
    </CentralModal>
  );
}
