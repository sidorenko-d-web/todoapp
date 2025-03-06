import { useAutoPlaySound, useModal } from '../../../hooks';
import styles from './TaskCompletedModal.module.scss';
import Button from '../partials/Button';
import coin from '../../../assets/icons/coin.png';
import subscribers_img from '../../../assets/icons/subscribers.png';
import Lottie from 'lottie-react';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import confetti from '../../../assets/animations/confetti.json';
import { MODALS, SOUNDS } from '../../../constants';
import { CentralModal } from '../../../components/shared';

interface TaskCompletedModalProps {
  income: number;
  subscribers: number;
  passiveIncome: number;
}

export default function TaskCompletedModal({ income, subscribers, passiveIncome }: TaskCompletedModalProps) {
  const { closeModal } = useModal();

  useAutoPlaySound(MODALS.TASK_COMPLETED, SOUNDS.rewardHuge);
  return (
    <CentralModal
      onClose={() => closeModal(MODALS.TASK_COMPLETED)}
      modalId={MODALS.TASK_COMPLETED}
      title={'Задание выполнено!'}
    >
      <div className={styles.background}>
        <Lottie animationData={confetti} loop={false} className={styles.reward} />
      </div>
      <div className={styles.info}>
        <div className={styles.top}>
          <div className={styles.item}>
            <div className={styles.bg}>
              <Lottie
                animationData={blueLightAnimation}
                loop={true}
                className={styles.light}
              />
            </div>
            <div className={styles.content}>
              <p>+{income}</p>
              <img src={coin} />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.bg}>
              <Lottie
                animationData={blueLightAnimation}
                loop={true}
                className={styles.light}
              />
            </div>
            <div className={styles.content}>
              <p>+{subscribers}</p>
              <img src={subscribers_img} />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.bg}>
              <Lottie
                animationData={blueLightAnimation}
                loop={true}
                className={styles.light}
              />
            </div>
            <div className={styles.content}>
              <p>+{passiveIncome}</p>
              <img src={coin} />
              <p>/сек.</p>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>
            Поздравляем! За выполнение задания вы <br></br>получаете дополнительные
            бонусы!
          </p>
        </div>
      </div>
      <Button variant={'blue'}>Забрать</Button>
    </CentralModal>

  );
}
