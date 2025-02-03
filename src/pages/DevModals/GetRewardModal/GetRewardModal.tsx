import CentralModal from '../../../components/shared/CentralModal/CentralModal';
import { MODALS } from '../../../constants/modals';
import { useModal } from '../../../hooks';
import styles from './GetRewardModal.module.scss';
import coin from '../../../assets/icons/coin.svg';
import Button from '../partials/Button';
import Lottie from 'lottie-react';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import reward from '../../../assets/animations/reward.json';
export default function GetRewardModal() {
  const { closeModal } = useModal();
  return (
    <CentralModal onClose={() => closeModal(MODALS.GET_REWARD)} modalId={MODALS.GET_REWARD} title={'Награда получена!'}>
      <div className={styles.background}>
        <Lottie animationData={reward} loop={false} className={styles.reward} />
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
            Поздравляем! За ответы на 20 комментариев <br></br> к интеграции вы получаете баллы!
          </p>
        </div>
      </div>
      <Button variant={'blue'}>Забрать</Button>
    </CentralModal>
  );
}
