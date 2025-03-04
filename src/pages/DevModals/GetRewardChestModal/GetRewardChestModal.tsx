import { useAutoPlaySound, useModal } from '../../../hooks';
import styles from './GetRewardChestModal.module.scss';
import Button from '../partials/Button';
import coin from '../../../assets/icons/coin.png';
import integration from '../../../assets/icons/integration-white.svg';
import snowflake from '../../../assets/icons/snowflake.svg';
import Lottie from 'lottie-react';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import chestAnimation from '../../../assets/animations/kamen_fixed.json';
// import reward from '../../../assets/animations/reward.json';
import confetti from '../../../assets/animations/confetti.json';
import { localStorageConsts, MODALS, SOUNDS } from '../../../constants';
import { CentralModal } from '../../../components/shared';
import { useTranslation } from 'react-i18next';

interface GetRewardChestModalProps {
  onClose?: () => void;
}

export default function GetRewardChestModal({}: GetRewardChestModalProps) {
  const { closeModal } = useModal();
  const { t } = useTranslation('shop');

  const handleClose = () => {
    closeModal(MODALS.TASK_CHEST);
    localStorage.removeItem(localStorageConsts.IS_NEED_TO_OPEN_CHEST);
  };

  useAutoPlaySound(MODALS.TASK_CHEST, SOUNDS.chestOpen);

  return (
    <CentralModal
      onClose={handleClose}
      modalId={MODALS.TASK_CHEST}
      title={t('s40')}
    >
      <div className={styles.background}>
        {/*<Lottie animationData={reward} loop={false} className={styles.reward} />*/}
        <Lottie animationData={confetti} loop={true} className={styles.reward} />
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
          <p>{t('s41')}</p>
        </div>
      </div>
      <div className={styles.button}>
        <Button variant={'blue'} onClick={handleClose}>
          {t('s42')}
        </Button>
      </div>
    </CentralModal>
  );
}
