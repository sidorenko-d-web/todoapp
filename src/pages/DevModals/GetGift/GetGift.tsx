import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import styles from './GetGift.module.scss';
import Button from '../partials/Button';
import coin from '../../../assets/icons/coin.png';
import integration from '../../../assets/icons/integration-white.svg';
import snowflake from '../../../assets/icons/snowflake.svg';
import subscribers from '../../../assets/icons/subscribers.svg';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import redLightAnimation from '../../../assets/animations/redLight.json';
import purpleLightAnimation from '../../../assets/animations/purpleLight.json';
import reward from '../../../assets/animations/reward.json';
import gift from '../../../assets/icons/gift.svg';
import giftRed from '../../../assets/icons/gift-red.svg';
import giftPurple from '../../../assets/icons/gift-purple.svg';
import Lottie from 'lottie-react';
import { CentralModal } from '../../../components/shared';
interface Props {
  lvl?: number;
}
export default function GetGift({ lvl }: Props) {
  const { closeModal, getModalState } = useModal();
  const { isOpen } = getModalState(MODALS.GET_GIFT);

  if (!isOpen) return null;

  let giftImage;

  if (lvl == null || (lvl >= 0 && lvl < 50)) {
    giftImage = <img src={gift} className={styles.gift} />;
  } else if (lvl >= 50 && lvl < 100) {
    giftImage = <img src={giftPurple} className={styles.gift} />;
  } else if (lvl >= 100 && lvl < 150) {
    giftImage = <img src={giftRed} className={styles.gift} />;
  }

  let giftLight;

  if (lvl == null || (lvl >= 0 && lvl < 50)) {
    giftLight = <Lottie animationData={blueLightAnimation} loop={true} className={styles.light} />;
  } else if (lvl >= 50 && lvl < 100) {
    giftLight = <Lottie animationData={purpleLightAnimation} loop={true} className={styles.light} />;
  } else if (lvl >= 100 && lvl < 150) {
    giftLight = <Lottie animationData={redLightAnimation} loop={true} className={styles.light} />;
  }
  return (
    <CentralModal onClose={() => closeModal(MODALS.GET_GIFT)} modalId={MODALS.GET_GIFT} title={'Подарок открыт!'}>
      <div className={styles.background}>
        <Lottie animationData={reward} loop={false} className={styles.reward} />
      </div>

      <div className={styles.images}>{giftLight}</div>

      <div className={styles.info}>
        {giftImage}
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
        variant={lvl == null || (lvl >= 0 && lvl < 50) ? 'blue' : lvl >= 50 && lvl < 100 ? 'purple' : 'red'}
        onClick={() => closeModal(MODALS.GET_GIFT)}
      >
        Забрать
      </Button>
    </CentralModal>
  );
}
