import { FC, useState, useEffect } from 'react';
import integrationWhiteIcon from '../../../assets/icons/integration-white.svg';
import coinIcon from '../../../assets/icons/coin.png';
import { RootState, setSubscribeGuideShown, useBuySubscriptionMutation } from '../../../redux';
import { useGetCurrentUserProfileInfoQuery } from '../../../redux';

import s from './SubscribeModal.module.scss';
import { getSubscriptionPurchased, isGuideShown, setGuideShown, setSubscriptionPurchased } from '../../../utils';
import { formatAbbreviation } from '../../../helpers';
import { Button, CentralModal } from '../../shared';
import { GUIDE_ITEMS, MODALS } from '../../../constants';
import { useModal, useSendTransaction, useTonConnect, useUsdtTransactions } from '../../../hooks';
import { useTranslation } from 'react-i18next';
import list from '../../../assets/icons/list.svg';
import { SubscrieGuide } from '../../guide';
import { useDispatch, useSelector } from 'react-redux';
import ListDisableIcon from '@icons/list-disable.svg';
import DisableCoin from '@icons/disableCoin.svg';

interface SubscribeModalProps {
  modalId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const point_integration = '150'

export const SubscribeModal: FC<SubscribeModalProps> = ({
  modalId,
  onClose,
  onSuccess,
}: SubscribeModalProps) => {
  const { t } = useTranslation('guide');
  const [idDisabled] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubscriptionPurchased, setIsSubscriptionPurchased] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [buySubscription] = useBuySubscriptionMutation();
  const { data: current } = useGetCurrentUserProfileInfoQuery(undefined, {
    pollingInterval: 10000, // 10 сек
  });

  const buyBtnGlowing = getSubscriptionPurchased();

  const { openModal, closeModal } = useModal();

  useEffect(() => {
    const lastPurchaseTime = localStorage.getItem('lastPurchaseTime');
    if (lastPurchaseTime) {
      const timeDiff = Date.now() - parseInt(lastPurchaseTime, 10);
      const daysLeft = 3 - Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      if (daysLeft > 0) {
        setIsSubscriptionPurchased(true);
        setTimeLeft(daysLeft * 24 * 60 * 60 * 1000 - (Date.now() - parseInt(lastPurchaseTime, 10)));
      } else {
        localStorage.removeItem('lastPurchaseTime');
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime !== null ? prevTime - 1000 : null);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft !== null && timeLeft <= 0) {
      localStorage.removeItem('lastPurchaseTime');
      setIsSubscriptionPurchased(false);
      setTimeLeft(null);
    }
  }, [timeLeft]);

  // USDT buy subscription
  const { sendUSDT } = useSendTransaction();
  const usdtTransactions = useUsdtTransactions();
  const [currentTrxId, setCurrentTrxId] = useState("")
  // for transactions
  const { walletAddress, connectWallet } = useTonConnect()

  const handleUsdtPayment = async () => {
    if (!walletAddress) {
      connectWallet();
    }
    try {
      const trxId = await sendUSDT(1.99);
      // @ts-expect-error
      setCurrentTrxId(trxId);
    } catch (error) {
      console.log("Error while sending USDT transaction", error)
    }
  };

  useEffect(() => {
    const latestTransaction = usdtTransactions[0];
    console.error("Transactions", latestTransaction)
    console.warn("trx id: ", currentTrxId)

    if (!latestTransaction || latestTransaction.orderId !== currentTrxId) return;

    if (latestTransaction.status === 'succeeded') {
      handleBuySubscription('usdt')
      setCurrentTrxId("")
    } else {
      setErrorMessage("Transaction failed")
    }
  }, [currentTrxId, usdtTransactions, ]);

  const handleBuySubscription = (paymentMethod: string) => {
    if (isSubscriptionPurchased) {
      setErrorMessage(t('g82'));
      setIsShow(true);
      setTimeout(() => setIsShow(false), 3000);
      return;
    }
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
        localStorage.setItem('lastPurchaseTime', Date.now().toString());
        setIsSubscriptionPurchased(true);
        setTimeLeft(24 * 60 * 60 * 1000);
        onSuccess();
      });

    if (!isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN)) {
      openModal(MODALS.SUCCESSFULLY_SUBSCRIBED);
    }
  };

  const dispatch = useDispatch();
  const guideShown = useSelector((state: RootState) => state.guide.subscribeGuideShown);
  const formatTime = (milliseconds: number) => {
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} ${t('g85')} ${minutes} ${t('g84')}`;
  };

  return (
    <CentralModal modalId={modalId} title={`${isSubscriptionPurchased ? t('g82') : `+ 5 ${t('g74')}`}`} onClose={onClose} titleIcon={integrationWhiteIcon}>
      {isShow && <div className={s.errorModal}>{errorMessage}</div>}
      <div className={s.content}>
        <div className={s.info}>
          <div className={s.progress}>
            <div className={s.progressInfo}>
              <span>{t('g76')}</span>
              <span className={s.progressIcon}>0/5 <img src={integrationWhiteIcon} height={18} width={18}
                alt={'Integration'} /></span>
            </div>
            <div className={s.progressBar}>
              <div className={s.progressBarInner} style={{ width: `0%` }} />
            </div>
          </div>
          {isSubscriptionPurchased && timeLeft !== null && (
            <span className={s.time}>
              {t('g83')} {formatTime(timeLeft)}
            </span>
          )}
          <span className={s.description}>
            {isSubscriptionPurchased ? t('g86') : t('g75')}
          </span>
        </div>
        <div className={s.buttons}>
          <Button
            className={s.button}
            disabled={idDisabled || !!isSubscriptionPurchased}
            onClick={handleUsdtPayment}
          >
            {formatAbbreviation(1.99, 'currency')}
          </Button>

          <Button className={`${s.button} ${!buyBtnGlowing ? s.glowing : ''}`} disabled={!!isSubscriptionPurchased}
            onClick={() => handleBuySubscription("internal_wallet")}>
            {formatAbbreviation(point_integration)} <img src={isSubscriptionPurchased ? DisableCoin : coinIcon} height={14} width={14} alt={'Coin'} />
          </Button>
          <Button className={s.button + ' ' + s.gray} disabled={idDisabled || !!isSubscriptionPurchased}>
            <img src={idDisabled ? ListDisableIcon : list} height={16} width={16} alt={'list'} />
          </Button>
        </div>
      </div>

      {!guideShown && <SubscrieGuide
        onClose={() => {
          dispatch(setSubscribeGuideShown(true));
          setGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN);
          closeModal(MODALS.SUBSCRIBE);
        }}
        top="65%"
        zIndex={1500}
        description={
          <>
            {t('g14')} <span style={{ color: '#2F80ED' }}>{t('g15')}</span>
            <br />
            <br />
            {t('g16')}
          </>
        }
      />}
    </CentralModal>
  );
};