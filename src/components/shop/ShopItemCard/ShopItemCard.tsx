import { FC, useState } from 'react';
import styles from './ShopItemCard.module.scss';
import clsx from 'clsx';
import { useBuyItemMutation } from '../../../redux/api/shop/api';
import { IShopItem, useGetCurrentUserProfileInfoQuery, inventoryApi, TypeItemRarity } from '../../../redux';
import CoinIcon from '../../../assets/icons/coin.svg';
import SubscriberCoin from '../../../assets/icons/subscriber_coin.svg';
import LockIcon from '../../../assets/icons/lock_icon.svg';
import ViewsIcon from '../../../assets/icons/views.svg';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants';

interface Props {
  disabled?: boolean;
  refetchAll: () => void;
  variant?: TypeItemRarity;

  item: IShopItem;
}

export const ShopItemCard: FC<Props> = ({ disabled, variant = 'lowcost', item, refetchAll }) => {
  const [buyItem, { isLoading }] = useBuyItemMutation();

  const { openModal } = useModal();

  const { refetch } = useGetCurrentUserProfileInfoQuery();
  const [error, setError] = useState('');
  const handleBuyItem = async () => {
    try {
      const res = await buyItem({ payment_method: 'internal_wallet', id: item.id });
      console.log(res);
      if (!res.error) {
        refetchAll();
        refetch();
        inventoryApi.util.resetApiState();
        openModal(MODALS.NEW_ITEM, { item: item, mode: 'item' });
      } else {
        setError(JSON.stringify(res.error));
      }
    } catch (error) {
    }
  };

  return (
    <div className={styles.storeCard}>
      <div className={styles.header}>
        <div className={clsx(styles.image)}>
          <img src={item.image_url} />
        </div>
        <div className={styles.title}>
          <div className={styles.headline}>
            <h3>{item.name}</h3>
          </div>
          <p className={variant === 'lux' ? styles.colorRed : variant === 'prem' ? styles.colorPurple : styles.level}>
            Не куплено
          </p>
          {error && (
            <p className={variant === 'lux' ? styles.colorRed : variant === 'prem' ? styles.colorPurple : styles.level}>
              {error}
            </p>
          )}
          <div className={styles.stats}>
            <div className={styles.statsItem}>
              <p>+{item.boost.views}</p>
              <img src={ViewsIcon} />
            </div>
            <div className={styles.statsItem}>
              <p>+{item.boost.subscribers}</p>
              <img src={SubscriberCoin} />
            </div>
            <div className={styles.statsItem}>
              <p>+{item.boost.income_per_second}</p>
              <img src={CoinIcon} alt="" />
              <img src={CoinIcon} alt="" />
              <p>/сек</p>
            </div>
          </div>
        </div>
      </div>

      {!disabled ? (
        <div className={styles.actions}>
          <button onClick={() => openModal(MODALS.NEW_ITEM, { item: item, mode: 'item' })}>
            {item.price_usdt} $USDT
          </button>
          <button onClick={handleBuyItem}>
            {isLoading ? (
              <p>loading</p>
            ) : (
              <>
                {item.price_internal} <img src={CoinIcon} alt="" />
                {item.price_internal} <img src={CoinIcon} alt="" />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <img src={LockIcon} alt="" />
          <p>Нужен уровень Древа 7</p>
          <img src={LockIcon} alt="" />
          <img src={LockIcon} alt="" />
        </div>
      )}
    </div>
  );
};
