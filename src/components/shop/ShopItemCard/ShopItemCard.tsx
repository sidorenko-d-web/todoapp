import { FC, useEffect, useState } from 'react';
import styles from './ShopItemCard.module.scss';
import clsx from 'clsx';
import { useBuyItemMutation } from '../../../redux';
import {
  IShopItem,
  RootState,
  useAddItemToRoomMutation,
  useGetEquipedQuery,
  useGetProfileMeQuery,
  useRemoveItemFromRoomMutation,
} from '../../../redux';
import CoinIcon from '../../../assets/icons/coin.png';
import SubscriberCoin from '../../../assets/icons/subscriber_coin.svg';
import LockIcon from '../../../assets/icons/lock_icon.svg';
import CointsGrey from '@icons/cointsGrey.svg';
import ViewsIcon from '../../../assets/icons/views.png';
import { useModal, useSendTransaction, useTonConnect, useUsdtTransactions } from '../../../hooks';
import { useTransactionNotification } from '../../../hooks/useTransactionNotification';
import { buildMode, GUIDE_ITEMS, MODALS, svgHeadersString } from '../../../constants';
import { useSelector } from 'react-redux';
import { isGuideShown, setGuideShown } from '../../../utils';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared';
import classNames from 'classnames';
import { buildLink } from '../../../constants';
import { useRoomItemsSlots } from '../../../../translate/items/items';

interface Props {
  disabled?: boolean;
  item: IShopItem;
}

export const ShopItemCard: FC<Props> = ({ disabled, item }) => {
  const RoomItemsSlots = useRoomItemsSlots();
  const [buyItem, { isLoading }] = useBuyItemMutation();
  const [equipItem] = useAddItemToRoomMutation();
  const [removeItem] = useRemoveItemFromRoomMutation();
  const { data: equipedItems } = useGetEquipedQuery();
  const { t, i18n } = useTranslation('shop');
  const { openModal } = useModal();
  const [error, setError] = useState('');

  const { data: pointsUser } = useGetProfileMeQuery();

  const buyButtonGlowing = useSelector((state: RootState) => state.guide.buyItemButtonGlowing);
  //// for transactions
  // const { sendUSDT } = useSendTransaction();
  // const usdtTransactions = useUsdtTransactions();
  // const [currentTrxId, setCurrentTrxId] = useState('');

  const isAffordable = !!pointsUser && +pointsUser.points >= +item.price_internal;

  const slot = Object.values(RoomItemsSlots).find(_item =>
    _item.name.find((__item: string) => item.name.includes(__item)),
  )?.slot;

  const handleEquipItem = async () => {
    if (!slot && slot !== 0)
      throw new Error('error while getting slot for item, check names in "redux/api/room/dto.ts - RoomItemsSlots"');
    const isSlotNotEmpty = equipedItems?.equipped_items.find(item => item.slot === slot);

    try {
      if (isSlotNotEmpty) {
        await removeItem({ items_to_remove: [{ id: isSlotNotEmpty.id }] });
      }
      await equipItem({ equipped_items: [{ id: item.id, slot }] });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuyItem = async () => {
    setGuideShown(GUIDE_ITEMS.shopPage.ITEM_BOUGHT);
    try {
      const res = await buyItem({ payment_method: 'internal_wallet', id: item.id });
      if (!res.error) {
        void handleEquipItem();
        openModal(MODALS.NEW_ITEM, { item: item, mode: 'item' });
      } else {
        setError(JSON.stringify(res.error));
      }
    } catch (error) {
      console.error(error);
    }
  };

  //// for transactions
  // const { walletAddress, connectWallet } = useTonConnect();
  // const { startTransaction, failTransaction, completeTransaction } = useTransactionNotification();
  // const handleUsdtPayment = async () => {

  //   if (!walletAddress) {
  //     const connected = await connectWallet();
  //     if (!connected) {
  //       setError('Wallet connection timed out');
  //       failTransaction(handleUsdtPayment);
  //       return;
  //     }
  //   }

  //   try {
  //     setError('');
  //     startTransaction();
  //     const trxId = await sendUSDT(1);
  //     setCurrentTrxId(trxId || '');
  //   } catch (error) {
  //     console.log('Error while sending USDT transaction', error);
  //     failTransaction(handleUsdtPayment);
  //   }
  // };

  // useEffect(() => {
  //   const latestTransaction = usdtTransactions[0];
  //   console.error('Transactions', latestTransaction);
  //   console.warn("Trx id: ", currentTrxId)
  //   if (!latestTransaction || latestTransaction.orderId !== currentTrxId) return;

  //   if (latestTransaction.status === 'succeeded') {
  //     completeTransaction();
  //   } else {
  //     failTransaction(handleUsdtPayment);
  //   }
  // }, [usdtTransactions, currentTrxId]);


  const { 
    startTransaction, 
    failTransaction, 
    setCurrentTrxId 
  } = useTransactionNotification();
  
  // For transactions
  const { sendUSDT } = useSendTransaction();
  const { walletAddress, connectWallet } = useTonConnect();

  const handleUsdtPayment = async () => {
    if (!walletAddress) {
      try {
        const connected = await connectWallet();
        if (!connected) {
          setError('Wallet connection timed out');
          return;
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setError('Failed to connect wallet');
        return;
      }
    }

    try {
      setError('');
      // Start the transaction notification
      startTransaction('Processing your payment...');
      
      console.log("Initiating USDT payment...");
      const trxId = await sendUSDT(1);
      
      if (trxId) {
        console.log("Transaction initiated with ID:", trxId);
        setCurrentTrxId(trxId);
        
        // After setting the transaction ID in the state, you could also manually
        // push this "pending" transaction to your local state if needed
      } else {
        console.error("Failed to get transaction ID");
        failTransaction(handleUsdtPayment);
      }
    } catch (error) {
      console.error('Error while sending USDT transaction:', error);
      setError('Transaction failed: ' + (error instanceof Error ? error.message : String(error)));
      failTransaction(handleUsdtPayment);
    }
  };

  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  const imageString =
    buildMode === 'production'
      ? buildLink()?.svgShop(item.image_url).replace('https://', 'https://storage.yandexcloud.net/')
      : buildLink()?.svgShop(item.image_url);

  return (
    <div className={styles.storeCard}>
      <div className={styles.header}>
        <div className={clsx(styles.image)}>
          <img src={imageString + svgHeadersString} />
        </div>
        <div className={styles.title}>
          <div className={styles.headline}>
            <h3>{locale === 'ru' ? item.name : item.name_eng}</h3>
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
              {'Error while loading data'}
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
            disabled={!isAffordable}
            className={classNames(
              clsx(
                !isAffordable ? styles.disabledButton : '',
                buyButtonGlowing && item.name.toLowerCase().trim().includes('печатная машинка')
                  ? styles.glowingBtn
                  : '',
              ),
              { [styles.disabledBtn]: !isAffordable },
            )}
          >
            {isLoading ? (
              <p>{t('s59')}</p>
            ) : (
              <>
                {formatAbbreviation(item.price_internal, 'number', { locale: locale })}{' '}
                <img src={!isAffordable ? CointsGrey : CoinIcon} alt="" />
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
