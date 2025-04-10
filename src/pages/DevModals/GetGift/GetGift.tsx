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
import { type ChestRewardResponseDTO, useClaimChestRewardMutation, Boost, useGetProfileMeQuery } from '../../../redux';
import { formatAbbreviation, getMaxSubscriptions, isSubscriptionIncreaseLevel } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import snowflake from '../../../assets/icons/snowflake.svg';
import { useEffect, useState } from 'react';

export default function GetGift() {
  const { closeModal, getModalState } = useModal();
  const { isOpen, args } = getModalState<{ giftColor: string; itemId: string; boost: Boost; boostPrev: Boost | null | undefined }>(
    MODALS.GET_GIFT,
  );
  const { t } = useTranslation('quests');
  const maxSubscriptions = getMaxSubscriptions();
  const [claimChest] = useClaimChestRewardMutation();
  const [giftData, setGiftData] = useState<ChestRewardResponseDTO>();

  const { data: profileData } = useGetProfileMeQuery();

  const isVibrationSupported =
    typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function';

  // useEffect(() => {
  //   if (profileData && !isLoading) {
  //     setUserSubscriptions(profileData.subscription_integrations_left);
  //   }
  // }, [profileData?.id, isLoading]);

  useEffect(() => {
    if (!args?.itemId) return;
    (async () => {
      const res = await claimChest({ chest_reward_reason: 'item_upgrade', entity_id: args?.itemId });
      if (res?.data) {
        setGiftData(res.data);
        console.log(res.data);
      }
    })();
  }, []);

  const handleClaimGift = async () => {
    if (isVibrationSupported) {
      navigator.vibrate(200);
    }
    localStorage.setItem('GIFT_FOR_TREE_STAGE', '0');
    closeModal(MODALS.GET_GIFT);
  };

  if (!isOpen) return null;

  let giftImage;
  if (args?.giftColor == null || args.giftColor === t('q54')) {
    giftImage = <img src={gift} className={styles.gift} />;
  } else if (args.giftColor === t('q55')) {
    giftImage = <img src={giftPurple} className={styles.gift} />;
  } else if (args.giftColor === t('q56')) {
    giftImage = <img src={giftRed} className={styles.gift} />;
  }

  let giftLight;
  if (args?.giftColor == null || args.giftColor === t('q54')) {
    giftLight = <Lottie animationData={blueLightAnimation} loop={true} className={styles.light} />;
  } else if (args.giftColor === t('q55')) {
    giftLight = <Lottie animationData={purpleLightAnimation} loop={true} className={styles.light} />;
  } else if (args.giftColor === t('q56')) {
    giftLight = <Lottie animationData={redLightAnimation} loop={true} className={styles.light} />;
  }

  return (
    <CentralModal onClose={() => {
      localStorage.setItem('GIFT_FOR_TREE_STAGE', '0');
      closeModal(MODALS.GET_GIFT);
    }
    }
      modalId={MODALS.GET_GIFT} title={t('q59')}>
      <div className={styles.background}>
        <Lottie animationData={confetti} loop={false} className={styles.reward} />
      </div>

      <div className={styles.images}>{giftLight}</div>

      <div className={styles.info}>
        {giftImage}
        <div className={styles.statsContainer} style={{ marginTop: '35px' }}>
          <div className={styles.stat}>
            {args?.boost?.income_per_second && (
              <span className={styles.statValue}>+{formatAbbreviation(args?.boost?.income_per_second)}</span>
            )}
          </div>
          <div className={styles.stat}>
            <div className={styles.statBox}>
              {args?.boostPrev && (
                <span className={styles.difference1}>
                  +
                  {args?.boost?.subscribers_for_first_level_referrals! -
                    args?.boostPrev?.subscribers_for_first_level_referrals}
                </span>
              )}
              <span>+{formatAbbreviation(args?.boost?.subscribers_for_first_level_referrals || 0)}</span>
              <img src={subscribers} />
              <span className={styles.extra}>1 {t('q9_2')}</span>
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statBox}>
              {args?.boostPrev && (
                <span className={styles.difference2}>
                  +
                  {args?.boost?.subscribers_for_second_level_referrals! -
                    args?.boostPrev?.subscribers_for_second_level_referrals!}
                </span>
              )}
              <span>+{formatAbbreviation(args?.boost?.subscribers_for_second_level_referrals || 0)}</span>
              <img src={subscribers} />
              <span className={styles.extra}>2 {t('q9_2')}</span>
            </div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statBox}>
              {
                isSubscriptionIncreaseLevel() && 
                  <span className={styles.difference1}>+1</span>
              }

              <span>
                {formatAbbreviation(profileData?.subscription_integrations_left)}/{formatAbbreviation(maxSubscriptions)}
              </span>
              <img src={integration} />
              <span className={styles.extra}>{t('q60')}</span>
            </div>
          </div>
        </div>
        <div className={styles.items}>
          <div className={styles.item}>
            <p>+{formatAbbreviation(giftData?.reward.subscribers ?? (args?.boost.subscribers || 0))}</p>
            <img src={subscribers} />
          </div>
          <div className={styles.item}>
            <p>+{formatAbbreviation(giftData?.reward.points ?? (args?.boost.points || 0))}</p>
            <img src={coin} />
          </div>
          {localStorage.getItem('GIFT_FOR_TREE_STAGE') !== '1' 
            && (giftData?.reward.subscriptions ?? args?.boost.additional_integrations_for_subscription) && (
            <div className={styles.item}>
              <p>
                +
                {formatAbbreviation(
                  giftData?.reward.subscriptions ?? args?.boost.additional_integrations_for_subscription,
                )}
              </p>
              <img src={integration} />
            </div>
          )}

          {giftData?.reward.freezes && (
            <div className={styles.item}>
              <p>+{giftData?.reward.freezes}</p>
              <img src={snowflake} />
            </div>
          )}
        </div>
        <p className={styles.desc}>{t('q57')}</p>
      </div>
      <Button
        variant={
          args?.giftColor == null || args?.giftColor === t('q54')
            ? 'blue'
            : args?.giftColor === t('q55')
            ? 'purple'
            : 'red'
        }
        onClick={handleClaimGift}
      >
        {t('q58')}
      </Button>
    </CentralModal>
  );
}
