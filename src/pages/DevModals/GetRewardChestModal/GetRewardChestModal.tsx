import { useAutoPlaySound, useModal } from '../../../hooks';
import styles from './GetRewardChestModal.module.scss';
import Button from '../partials/Button';
import coin from '../../../assets/icons/coin.png';
import subscribersIcon from '../../../assets/icons/subscribers.svg';
import snowflake from '../../../assets/icons/snowflake.svg';
import Lottie from 'lottie-react';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import chestAnimation from '../../../assets/animations/kamen_fixed.json';
import confetti from '../../../assets/animations/confetti.json';
import { localStorageConsts, MODALS, SOUNDS } from '../../../constants';
import { CentralModal } from '../../../components/shared';
import { useTranslation } from 'react-i18next';

interface GetRewardChestModalProps {
  onClose?: () => void;
}

export default function GetRewardChestModal({}: GetRewardChestModalProps) {
  const { closeModal, getModalState } = useModal();
  const { t } = useTranslation('shop');

  const { args } = getModalState(MODALS.TASK_CHEST) ?? {}; // Ensure args is at least an empty object
  const points = typeof args?.points === 'number' ? args.points : 0;
  const subscribers = typeof args?.subscribers === 'number' ? args.subscribers : 0;
  const freezes = typeof args?.freezes === 'number' ? args.freezes : 0;

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
        <Lottie animationData={confetti} loop={false} className={styles.reward} />
      </div>
      <div className={styles.images}>
        <Lottie animationData={blueLightAnimation} loop={true} className={styles.light} />
      </div>
      <div className={styles.info}>
        <Lottie animationData={chestAnimation} loop={false} className={styles.chest} />
        <div className={styles.items}>
          <div className={styles.item}>
            <p>+{points}</p>
            <img src={coin} height={18} width={18}/>
          </div>
          <div className={styles.item}>
            <p>+{subscribers}</p>
            <img src={subscribersIcon} height={18} width={18}/>
          </div>
          <div className={styles.item}>
            <p>+{freezes}</p>
            <img src={snowflake} height={18} width={18}/>
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
