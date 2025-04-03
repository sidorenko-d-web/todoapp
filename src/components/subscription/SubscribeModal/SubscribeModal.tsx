import { FC, useEffect, useState } from 'react';
import integrationWhiteIcon from '../../../assets/icons/integration-white.svg';
import coinIcon from '../../../assets/icons/coin.png';
import {
  setDimHeader,
  setSubscribeGuideShown,
  useBuySubscriptionMutation,
  useGetProfileMeWithPollingQuery,
} from '../../../redux';

import s from './SubscribeModal.module.scss';
import { getSubscriptionPurchased, isGuideShown, setGuideShown, setSubscriptionPurchased } from '../../../utils';
import { formatAbbreviation } from '../../../helpers';
import { Button, CentralModal } from '../../shared';
import { GUIDE_ITEMS, MODALS, PROFILE_ME_POLLING_INTERVAL } from '../../../constants';
import { useModal } from '../../../hooks';
import { useTranslation } from 'react-i18next';
import list from '../../../assets/icons/list.svg';
import { SubscrieGuide } from '../../guide';
import { useDispatch } from 'react-redux';
import ListDisableIcon from '@icons/list-disable.svg';
import DisableCoin from '@icons/disableCoin.svg';
import useUsdtPayment from '../../../hooks/useUsdtPayment';

interface SubscribeModalProps {
  modalId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const point_integration = '150';

export const SubscribeModal: FC<SubscribeModalProps> = ({ modalId, onClose, onSuccess }: SubscribeModalProps) => {
  const { t } = useTranslation('guide');
  const [idDisabled] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubscriptionPurchased, setIsSubscriptionPurchased] = useState(false);
  const [nextSubscriptionAt, setNextSubscriptionAt] = useState<Date | null>(null);
  const [timeUntilAvailable, setTimeUntilAvailable] = useState<number | null>(null);

  const [buySubscription] = useBuySubscriptionMutation();
  const { data: current } = useGetProfileMeWithPollingQuery(undefined, {
    pollingInterval: PROFILE_ME_POLLING_INTERVAL,
  });

  const buyBtnGlowing = getSubscriptionPurchased();
  const { openModal, closeModal } = useModal();

  // Установка nextSubscriptionAt
  useEffect(() => {
    if (current?.next_subscription_at) {
      const currentDate = new Date();
      const nextSubscriptionDate = new Date(current.next_subscription_at);
      setNextSubscriptionAt(nextSubscriptionDate);
      setIsSubscriptionPurchased(currentDate <= nextSubscriptionDate);
    }
  }, [current]);

  // Отсчет времени до nextSubscriptionAt
  useEffect(() => {
    if (nextSubscriptionAt) {
      const interval = setInterval(() => {
        const now = new Date();
        const timeDiff = nextSubscriptionAt.getTime() - now.getTime();
        if (timeDiff > 0) {
          setTimeUntilAvailable(timeDiff);
        } else {
          setTimeUntilAvailable(null);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [nextSubscriptionAt]);

  const handleBuySubscription = (paymentMethod: string) => {
    const currentPoints = Number(current?.points);
    const pointIntegration = Number(point_integration);
    if (current && currentPoints < pointIntegration) {
      setErrorMessage(t('g81'));
      setIsShow(true);
      setTimeout(() => setIsShow(false), 3000);
      return;
    }
    setSubscriptionPurchased();
    buySubscription({ payment_method: paymentMethod })
      .unwrap()
      .then(() => {
        onSuccess();
      })
      // .catch((err) => {
      //   onSuccess();
      // });
    // if (!isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN) && !getModalState(MODALS.SUCCESSFULLY_SUBSCRIBED).isOpen) {
    //   openModal(MODALS.SUCCESSFULLY_SUBSCRIBED);
    // }
  };

  const { processPayment } = useUsdtPayment();

  const handleUsdtPayment = async () => {
    try {
      await processPayment(1, async (result) => {
        if (result.success) {
          const currentPoints = Number(current?.points);
          const pointIntegration = Number(point_integration);
          if (current && currentPoints < pointIntegration) {
            setErrorMessage(t('g81'));
            setIsShow(true);
            setTimeout(() => setIsShow(false), 3000);
            return;
          }
          setSubscriptionPurchased();
          const res = await buySubscription({ payment_method: 'usdt', transaction_id: result.transactionHash, sender_address: result.senderAddress })
            .unwrap()
            .then(() => {
              onSuccess();
            });

          console.warn("Buy response:", res)
          if (!isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN)) {
            openModal(MODALS.SUCCESSFULLY_SUBSCRIBED);
          }
        }
      });
    } catch (err) {
      console.error('Error in USDT payment flow:', err);
    }
  };

  const dispatch = useDispatch();
  const guideShown = isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN);
  const formatTime = (milliseconds: number) => {
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} ${t('g85')} ${minutes} ${t('g84')}`;
  };
  return (
    <CentralModal
      modalId={modalId}
      title={`${isSubscriptionPurchased ? t('g82') : `+ 5 ${t('g74')}`}`}
      onClose={onClose}
      titleIcon={integrationWhiteIcon}
    >
      {isShow && <div className={s.errorModal}>{errorMessage}</div>}
      <div className={s.content}>
        <div className={s.info}>
          <div className={s.progress}>
            <div className={s.progressInfo}>
              <span>{t('g76')}</span>
              <span className={s.progressIcon}>
                0/5 <img src={integrationWhiteIcon} height={18} width={18} alt={'Integration'} />
              </span>
            </div>
            <div className={s.progressBar}>
              <div className={s.progressBarInner} style={{ width: `0%` }} />
            </div>
          </div>
          {timeUntilAvailable !== null && (
            <span className={s.time}>
              {t('g83')} {formatTime(timeUntilAvailable)}
            </span>
          )}
          <span className={s.description}>{isSubscriptionPurchased ? t('g86') : t('g75')}</span>
        </div>
        <div className={s.buttons}>
          <Button className={s.button} disabled={!!isSubscriptionPurchased 
            || !isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN)} onClick={handleUsdtPayment}>
            {formatAbbreviation(1, 'currency')}
          </Button>
          <Button
            style={{zIndex: '20000'}}
            className={`${s.button} ${!buyBtnGlowing && isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN) ? s.glowing : ''
              }`}
            disabled={!!isSubscriptionPurchased || !isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN)}
            onClick={() => handleBuySubscription('internal_wallet')}
          >
            {formatAbbreviation(point_integration)}{' '}
            <img src={(isSubscriptionPurchased 
              || !isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN)) ? DisableCoin : coinIcon} height={14} width={14} alt={'Coin'} />
          </Button>
          <Button className={s.button + ' ' + s.gray} disabled={idDisabled || !!isSubscriptionPurchased}>
            <img src={idDisabled ? ListDisableIcon : list} height={16} width={16} alt={'list'} />
          </Button>
        </div>
      </div>
      {!guideShown && (
        <SubscrieGuide
          onClose={() => {
            dispatch(setDimHeader(false));
            dispatch(setSubscribeGuideShown(true));
            setGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN);
            closeModal(MODALS.SUBSCRIBE);
          }}
          top="68%"
          zIndex={1500}
          description={
            <>
              {t('g14')} <span style={{ color: '#2F80ED' }}>{t('g15')}</span>
              <br />
              <br />
              {t('g16')}
            </>
          }
        />
      )}
    </CentralModal>
  );
};

