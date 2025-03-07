import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import styles from './GetGift.module.scss';
import Button from '../partials/Button';
import coin from '../../../assets/icons/coin.png';
import integration from '../../../assets/icons/integration-white.svg';
import subscribers from '../../../assets/icons/subscribers.svg';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import redLightAnimation from '../../../assets/animations/redLight.json';
import purpleLightAnimation from '../../../assets/animations/purpleLight.json';
import confetti from '../../../assets/animations/confetti.json';
import gift from '../../../assets/icons/gift.svg';
import giftRed from '../../../assets/icons/gift-red.svg';
import giftPurple from '../../../assets/icons/gift-purple.svg';
import Lottie from 'lottie-react';
import { CentralModal } from '../../../components/shared';
import { Boost } from '../../../redux';
import { formatAbbreviation } from '../../../helpers';

interface Props {
  lvl?: number;
  boost?: Boost | null;
}

export default function GetGift({ lvl, boost }: Props) {
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
        <Lottie animationData={confetti} loop={false} className={styles.reward} />
      </div>

      <div className={styles.images}>{giftLight}</div>

      <div className={styles.info}>
        {giftImage}
        <div className={styles.statsContainer}>
          <div className={styles.stat}>
            {boost?.income_per_second && <span className={styles.statValue}>+{formatAbbreviation(boost?.income_per_second)}</span>}
            <div className={styles.statBox}>
              <span>x{formatAbbreviation(boost?.x_income_per_second || 0)}</span>
              <img src={coin} />
              <span className={styles.extra}>/сек.</span>
            </div>
          </div>
          <div className={styles.stat}>
            {/*<span className={styles.statValue}>+10</span>*/}
            <div className={styles.statBox}>
              <span>+{formatAbbreviation(boost?.subscribers_for_first_level_referrals || 0)}</span>
              <img src={subscribers} />
              <span className={styles.extra}>1 ур.</span>
            </div>
          </div>
          <div className={styles.stat}>
            {/*<span className={styles.statValue}>+5</span>*/}
            <div className={styles.statBox}>
              <span>+{formatAbbreviation(boost?.subscribers_for_second_level_referrals || 0)}</span>
              <img src={subscribers} />
              <span className={styles.extra}>2 ур.</span>
            </div>
          </div>
        </div>
        <div className={styles.items}>
          <div className={styles.item}>
            <p>+{formatAbbreviation(boost?.subscribers || 0)}</p>
            <img src={subscribers} />
          </div>
          <div className={styles.item}>
            <p>+{formatAbbreviation(boost?.points || 0)}</p>
            <img src={coin} />
          </div>
          {boost?.additional_integrations_for_subscription && <div className={styles.item}>
            <p>+{formatAbbreviation(boost?.additional_integrations_for_subscription)}</p>
            <img src={integration} />
          </div>}
          {/*<div className={styles.item}>*/}
          {/*  <p>+1</p>*/}
          {/*  <img src={snowflake} />*/}
          {/*</div>*/}
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
