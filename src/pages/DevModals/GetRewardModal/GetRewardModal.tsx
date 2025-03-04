import { MODALS, SOUNDS } from '../../../constants';
import { useAutoPlaySound, useModal } from '../../../hooks';
import styles from './GetRewardModal.module.scss';
import coin from '../../../assets/icons/coin.png';
import Button from '../partials/Button';
import Lottie from 'lottie-react';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import confetti from '../../../assets/animations/confetti.json';
import { CentralModal } from '../../../components/shared';

export default function GetRewardModal() {
  const { closeModal } = useModal();

  useAutoPlaySound(MODALS.GET_REWARD, SOUNDS.rewardSmall);

  return (
    <CentralModal
      onClose={() => closeModal(MODALS.GET_REWARD)}
      modalId={MODALS.GET_REWARD}
      title={'Награда получена!'}
    >
      <div className={styles.background}>
        <Lottie animationData={confetti} loop={false} className={styles.reward} />
      </div>
      <div className={styles.images}>
        <Lottie animationData={blueLightAnimation} loop={true} className={styles.light} />
      </div>
      <div className={styles.info}>
        <div className={styles.top}>
          <p>+1 000</p>
          <img src={coin} />
        </div>
        <div className={styles.bottom}>
          <p>
            Поздравляем! За ответы на 20 комментариев <br></br> к интеграции вы получаете
            баллы!
          </p>
        </div>
      </div>
      <Button variant={'blue'}>Забрать</Button>
    </CentralModal>
  );
}
