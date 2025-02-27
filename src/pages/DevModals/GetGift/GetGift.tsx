import { MODALS } from '../../../constants/modals';
import { useModal } from '../../../hooks';
import styles from './GetGift.module.scss';
import Button from '../partials/Button';
import coin from '../../../assets/icons/coin.png';
import integration from '../../../assets/icons/integration-white.svg';
import snowflake from '../../../assets/icons/snowflake.svg';
import subscribers from '../../../assets/icons/subscribers.svg';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import reward from '../../../assets/animations/reward.json';
import gift from '../../../assets/icons/gift.svg';
import Lottie from 'lottie-react';
import { CentralModal } from '../../../components/shared';
import { useGetDailyRewardQuery } from '../../../redux/api/tasks';


export default function GetGift() {
  const { closeModal, getModalState } = useModal();
  const { isOpen } = getModalState(MODALS.GET_GIFT);

  const taskId = localStorage.getItem('taskId');

  if(isOpen) {

    console.log('getting reward for ', taskId)
    useGetDailyRewardQuery(''+taskId);
  }

  
  if (!isOpen) return null;
  
  return (
    <CentralModal 
      onClose={() => closeModal(MODALS.GET_GIFT)} 
      modalId={MODALS.GET_GIFT} 
      title={'Подарок открыт!'}
    >
      <div className={styles.background}>
        <Lottie animationData={reward} loop={false} className={styles.reward} />
      </div>

      <div className={styles.images}>
        <Lottie animationData={blueLightAnimation} loop={true} className={styles.light} />
      </div>

      <div className={styles.info}>
        <img src={gift} className={styles.gift} />

        <div className={styles.statsContainer}>
          <div className={styles.stat}>
            <span className={styles.statValue}>+0,15</span>
            <div className={styles.statBox}>
              <span>x1,15</span>
              <img src={coin} />
              <span className={styles.extra}>/сек.</span>
            </div>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>+10</span>
            <div className={styles.statBox}>
              <span>+120</span>
              <img src={subscribers} />
              <span className={styles.extra}>1 ур.</span>
            </div>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>+5</span>
            <div className={styles.statBox}>
              <span>+40</span>
              <img src={subscribers} />
              <span className={styles.extra}>2 ур.</span>
            </div>
          </div>
        </div>
        <div className={styles.items}>
          <div className={styles.item}>
            <p>+100</p>
            <img src={subscribers} />
          </div>
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
        </div>
        <p className={styles.desc}>Поздравляем! Вы улучшли основные показатели и получили дополнительные бонусы!</p>
      </div>
      <Button 
        variant={'blue'} 
        onClick={() => {
          closeModal(MODALS.GET_GIFT);
        }}
      >
        Забрать
      </Button>
    </CentralModal>
  );
}
