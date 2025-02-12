import { FC, useState, useEffect } from 'react';
import styles from './ShopItemCard.module.scss';
import clsx from 'clsx';
import { useBuyItemMutation } from '../../../redux/api/shop/api';
import { useGetCurrentUserProfileInfoQuery } from '../../../redux';
import { IShopItem, RootState } from '../../../redux';
import CoinIcon from '../../../assets/icons/coin.png';
import SubscriberCoin from '../../../assets/icons/subscriber_coin.svg';
import LockIcon from '../../../assets/icons/lock_icon.svg';
import ViewsIcon from '../../../assets/icons/views.png';
import { useModal, useSendTransaction, useTonConnect, useUsdtTransactions } from '../../../hooks';
import { useTransactionNotification } from '../../../hooks/useTransactionNotification';
import { GUIDE_ITEMS, MODALS, svgHeadersString } from '../../../constants';
import { useSelector } from 'react-redux';
import { isGuideShown, setGuideShown } from '../../../utils';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared';
import { useDispatch } from 'react-redux';
import { setPoints } from '../../../redux/slices/point.ts';

interface Props {
  disabled?: boolean;
  item: IShopItem;
}

export const ShopItemCard: FC<Props> = ({ disabled, item }) => {
  const [buyItem, { isLoading }] = useBuyItemMutation();
  const { data } = useGetCurrentUserProfileInfoQuery();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('shop');
  const { openModal } = useModal();
  const [error, setError] = useState('');

  const buyButtonGlowing = useSelector((state: RootState) => state.guide.buyItemButtonGlowing);
  // for transactions
  const { sendUSDT } = useSendTransaction();
  const usdtTransactions = useUsdtTransactions();
  const [currentTrxId, setCurrentTrxId] = useState("")


  const userPoints = data?.points || 0;
  const handleBuyItem = async () => {
    setGuideShown(GUIDE_ITEMS.shopPage.ITEM_BOUGHT);
    try {
      dispatch(setPoints((prevPoints: number) => prevPoints + 1));
      const res = await buyItem({ payment_method: 'internal_wallet', id: item.id });
      if (!res.error) {
        openModal(MODALS.NEW_ITEM, { item: item, mode: 'item' });
      } else {
        setError(JSON.stringify(res.error));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // for transactions
  const {walletAddress, connectWallet} = useTonConnect()
  const { startTransaction, failTransaction, completeTransaction } = useTransactionNotification();
  const handleUsdtPayment = async () => {

    if (!walletAddress) connectWallet()

    try {
      setError('');
      startTransaction();
      const trxId = await sendUSDT(Number(item.price_usdt));
      setCurrentTrxId(trxId || '');
    } catch (error) {
      failTransaction(handleUsdtPayment);
    }
  };

  useEffect(() => {
    const latestTransaction = usdtTransactions[0];
    console.log("Transactions", latestTransaction)

    if (!latestTransaction || latestTransaction.orderId !== currentTrxId) return;

    if (latestTransaction.status === 'succeeded') {
      completeTransaction();
    } else {
      failTransaction(handleUsdtPayment);
    }
  }, [usdtTransactions, currentTrxId]);


  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  return (
    <div className={styles.storeCard}>
      <div className={styles.header}>
        <div className={clsx(styles.image)}>
          <img src={item.image_url + svgHeadersString} />
        </div>
        <div className={styles.title}>
          <div className={styles.headline}>
            <h3>
              {item.name} {item.item_rarity} {item.item_premium_level}
            </h3>
          </div>
          <p
            className={
              item.item_rarity === 'green'
                ? styles.colorRed
                : item.item_rarity === 'yellow'
                ? styles.colorPurple
                : styles.level
            }
          >
            {t('s17')}
          </p>
          {error && (
            <p
              className={
                item.item_rarity === 'green'
                  ? styles.colorRed
                  : item.item_rarity === 'yellow'
                  ? styles.colorPurple
                  : styles.level
              }
            >
              {error}
            </p>
          )}
          <div className={styles.stats}>
            <div className={styles.statsItem}>
              <p>+{formatAbbreviation(item.boost.views, 'number', { locale: locale })}</p>
              <img src={ViewsIcon} />
            </div>
            <div className={styles.statsItem}>
              <p>+{formatAbbreviation(item.boost.subscribers, 'number', { locale: locale })}</p>
              <img src={SubscriberCoin} />
            </div>
            <div className={styles.statsItem}>
              <p>+{formatAbbreviation(item.boost.income_per_second, 'number', { locale: locale })}</p>
              <img src={CoinIcon} alt="" />
              <p>/{t('s13')}</p>
            </div>
          </div>
        </div>
      </div>

      {!disabled ? (
        <div className={styles.actions}>
          {isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) && (
            <Button onClick={handleUsdtPayment}>
              {formatAbbreviation(item.price_usdt, 'currency', { locale: locale })}
            </Button>
          )}
          <Button
            onClick={handleBuyItem}
            className={clsx(
              Number(userPoints) < Number(item.price_internal) ? styles.disabledButton : '',
              buyButtonGlowing && item.name.toLowerCase().trim().includes('столик') ? styles.glowingBtn : ''
            )}
          >
            {isLoading ? (
              <p>Загрузка...</p>
            ) : (
              <>
                {formatAbbreviation(item.price_internal, 'number', { locale: locale })} <img src={CoinIcon} alt="" />

              </>
            )}
          </Button>
        </div>
      ) : (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <img src={LockIcon} alt="" />
          <p>{t('s18')} 7</p>
          <img src={LockIcon} alt="" />
          <img src={LockIcon} alt="" />
        </div>
      )}
    </div>
  );
};
