import CentralModal from '../../../components/shared/CentralModal/CentralModal';
import { MODALS } from '../../../constants/modals';
import { useModal } from '../../../hooks';
import styles from './RewardForIntegrationModal.module.scss';
import Button from '../partials/Button';
import coin from '../../../assets/icons/coin.png';
import subscribers from '../../../assets/icons/subscribers.png';
import integration from '../../../assets/icons/integration-blue.svg';
import starBlue from '../../../assets/icons/star-blue.svg';
import starGray from '../../../assets/icons/star-dark-gray.svg';
import lightning from '../../../assets/icons/lightning.svg';
import Lottie from 'lottie-react';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import reward from '../../../assets/animations/reward.json';
import { useDispatch } from 'react-redux';
import { setIsPublishedModalClosed } from '../../../redux/slices/guideSlice';

export default function RewardForIntegrationModal() {
  const { closeModal } = useModal();

  const dispatch = useDispatch();

  return (
    <CentralModal
      onClose={() => {
        dispatch(setIsPublishedModalClosed(true));
        closeModal(MODALS.INTEGRATION_REWARD);
      }}
      modalId={MODALS.INTEGRATION_REWARD}
      title={'Интеграция опубликована!'}
    >
      <div className={styles.background}>
        <Lottie animationData={reward} loop={false} className={styles.reward} />
      </div>
      <div className={styles.images}>
        <Lottie animationData={blueLightAnimation} loop={true} className={styles.light} />
      </div>
      <div className={styles.info}>
        <div className={styles.top}>
          <div className={styles.lightning}>
            <img src={lightning} />
          </div>
          <img className={styles.integration} src={integration} />
        </div>
        <div className={styles.bottom}>
          <h2 className={styles.title}>Компания</h2>
          <div className={styles.rate}>
            <img src={starBlue} />
            <img src={starGray} />
            <img src={starGray} />
          </div>
          <div className={styles.progress}>
            <div className={styles.progressBar} />
          </div>
        </div>
      </div>
      <div className={styles.icons}>
        <div className={styles.item}>
          <p>+1 500</p>
          <img src={coin} className={styles.coin} />
        </div>
        <div className={styles.item}>
          <p>+500</p>
          <img src={subscribers} />
        </div>
      </div>
      <div className={styles.desc}>
        <p>Поздравляем! Интеграция готова, следите за статистикой и продолжайте в том же духе!</p>
      </div>
      <Button variant={'blue'} onClick={() => {
        console.log('onnn clossseee')
        dispatch(setIsPublishedModalClosed(true));
        closeModal(MODALS.INTEGRATION_REWARD);
      }}>Забрать</Button>
    </CentralModal>
  );
}
