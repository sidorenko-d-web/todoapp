import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import styles from './GetGiftDaily.module.scss';
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
import { useTranslation } from 'react-i18next';

interface Props {
  giftColor?: string;
  boost?: Boost | null;
}

export default function GetGiftDaily({ giftColor }: Props) {
  const { closeModal, getModalState } = useModal();
  const { isOpen, args } = getModalState<{
    points: number;
    boost: Boost;
  }>(MODALS.GET_GIFT_DAILY);
  const incomePerSecond = args?.boost?.income_per_second;
  const xIncomePerSecond = args?.boost?.x_income_per_second;
  const subscribersForFirstLevelReferrals = args?.boost?.subscribers_for_first_level_referrals;
  const subscribersForSecondLevelReferrals = args?.boost?.subscribers_for_second_level_referrals;
  const subscribersBoost = args?.boost?.subscribers;
  const pointsBoost = args?.points;
  const additionalIntegrationsForSubscription = args?.boost?.additional_integrations_for_subscription;
  
  const { t } = useTranslation('gift');

  if (!isOpen) return null;

  let giftImage;

  if (giftColor == null || giftColor === 'Синий подарок') {
    giftImage = <img src={gift} className={styles.gift} />;
  } else if (giftColor === 'Пурпурный подарок') {
    giftImage = <img src={giftPurple} className={styles.gift} />;
  } else if (giftColor === 'Красный подарок') {
    giftImage = <img src={giftRed} className={styles.gift} />;
  }

  let giftLight;

  if (giftColor == null || giftColor === 'Синий подарок') {
    giftLight = <Lottie animationData={blueLightAnimation} loop={true} className={styles.light} />;
  } else if (giftColor === 'Пурпурный подарок') {
    giftLight = <Lottie animationData={purpleLightAnimation} loop={true} className={styles.light} />;
  } else if (giftColor === 'Красный подарок') {
    giftLight = <Lottie animationData={redLightAnimation} loop={true} className={styles.light} />;
  }

  return (
    <CentralModal onClose={() => closeModal(MODALS.GET_GIFT_DAILY)} modalId={MODALS.GET_GIFT_DAILY} title={t('g1')}>
      <div className={styles.background}>
        <Lottie animationData={confetti} loop={false} className={styles.reward} />
      </div>

      <div className={styles.images}>{giftLight}</div>

      <div className={styles.info}>
        {giftImage}
        <div className={styles.statsContainer}>
          <div className={styles.stat}>
            {incomePerSecond && (
              <span className={styles.statValue}>+{formatAbbreviation(incomePerSecond)}</span>
            )}
            <div className={styles.statBox}>
              <span>x{formatAbbreviation(xIncomePerSecond || 0)}</span>
              <img src={coin} />
              <span className={styles.extra}>/сек.</span>
            </div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statBox}>
              <span>+{formatAbbreviation(subscribersForFirstLevelReferrals || 0)}</span>
              <img src={subscribers} />
              <span className={styles.extra}>1 ур.</span>
            </div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statBox}>
              <span>+{formatAbbreviation(subscribersForSecondLevelReferrals || 0)}</span>
              <img src={subscribers} />
              <span className={styles.extra}>2 ур.</span>
            </div>
          </div>
        </div>
        <div className={styles.items}>
          <div className={styles.item}>
            <p>+{formatAbbreviation(subscribersBoost || 0)}</p>
            <img src={subscribers} />
          </div>
          <div className={styles.item}>
            <p>+{formatAbbreviation(pointsBoost || 0)}</p>
            <img src={coin} />
          </div>
          {additionalIntegrationsForSubscription && (
            <div className={styles.item}>
              <p>+{formatAbbreviation(additionalIntegrationsForSubscription || 0)}</p>
              <img src={integration} />
            </div>
          )}
          {/*<div className={styles.item}>*/}
          {/*  <p>+1</p>*/}
          {/*  <img src={snowflake} />*/}
          {/*</div>*/}
        </div>
        <p className={styles.desc}>{t('g2')}</p>
      </div>
      <Button
        variant={
          giftColor == null || giftColor === 'Синий подарок'
            ? 'blue'
            : giftColor === 'Пурпурный подарок'
              ? 'purple'
              : 'red'
        }
        onClick={() => closeModal(MODALS.GET_GIFT_DAILY)}
      >
        {t('g3')}
      </Button>
    </CentralModal>
  );
}