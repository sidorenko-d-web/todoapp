import CentralModal from '../../../components/shared/CentralModal/CentralModal';
import { MODALS } from '../../../constants/modals';
import { useModal } from '../../../hooks';
import styles from './LossOfProgress.module.scss';
import Button from '../partials/Button';
import grayFire from '../../../assets/icons/grayFire.svg';
import blueChest from '../../../assets/icons/chest-blue.svg';

export default function LossOfProgress() {
  const { closeModal } = useModal();
  return (
    <CentralModal
      onClose={() => closeModal(MODALS.LOSS_PROGRESS)}
      modalId={MODALS.LOSS_PROGRESS}
      title={'Прогресс потерян :('}
    >
      <div className={styles.info}>
        <div className={styles.top}>
          <img src={grayFire} className={styles.fire} />
          <p className={styles.desc}>Вы пропустили день ударного режима, и у вас закончились заморозки.</p>
        </div>
        <div className={styles.bottom}>
          <div className={styles.progressTitle}>
            <div className={styles.progressInfo}>
              <p>0/30 дней</p>
              <div className={styles.chest}>
                <p>Каменный сундук</p>
                <img src={blueChest} />
              </div>
            </div>

            <div className={styles.progress}>
              <div className={styles.progressBar} />
            </div>
            <p className={styles.text}>Делайте интеграции каждый день, чтобы снова начать получать награды.</p>
          </div>
        </div>
      </div>
      <Button variant={'gray'}>Понятно</Button>
    </CentralModal>
  );
}
