import { FC } from 'react';
import styles from './ShopItemCard.module.scss';
import clsx from 'clsx';
import LockIconSvg from '../../../assets/Icons/lock-closed';
import { useBuyItemMutation } from '../../../redux/api/shop/api';
import { TypeItemQuality, IShopItem } from '../../../redux';
import CoinIcon from '../../../assets/Icons/coin.svg';
import SubscriberCoin from '../../../assets/Icons/subscriber_coin.svg';
import LockIcon from '../../../assets/Icons/lock_icon.svg';
import ViewsIcon from '../../../assets/Icons/views.svg';

interface Props {
  disabled?: boolean;
  isUpgradeEnabled?: boolean;
  isBlocked?: boolean;
  isB?: boolean;
  refetchAll: () => void;
  variant?: TypeItemQuality;

  item: IShopItem;
}

export const ShopItemCard: FC<Props> = ({
  disabled,
  isBlocked,
  isUpgradeEnabled = true,
  variant = 'lowcost',
  item,
  refetchAll,
}) => {
  const [buyItem, { isLoading }] = useBuyItemMutation();

  const handleBuyItem = async () => {
    try {
      const res = await buyItem({ payment_method: 'internal_wallet', id: item.id });
      console.log(res);
      if (!res.error) {
        refetchAll();
      }
    } catch (error) {}
  };

  return (
    <div className={styles.storeCard}>
      <div className={styles.header}>
        <div className={clsx(styles.image)}>
          <img src={item.image_url} className={clsx(isBlocked && styles.disabledImage)} />
          {isBlocked && <LockIconSvg className={styles.disabledImageIcon} />}
        </div>
        <div className={styles.title}>
          <div className={styles.headline}>
            <h3>{item.name}</h3>
          </div>
          <p className={variant === 'lux' ? styles.colorRed : variant === 'prem' ? styles.colorPurple : styles.level}>
            Не куплено
          </p>
          <div className={clsx(styles.stats, (isBlocked || disabled) && styles.disabledStats)}>
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
              <img src={CoinIcon} alt=''/>
              <p>/сек</p>
            </div>
          </div>
        </div>
      </div>

      {disabled ? (
        <button className={styles.disabledActions}>
          <p>Активировать</p>
        </button>
      ) : isUpgradeEnabled ? (
        <div className={styles.actions}>
          <button disabled>{item.price_usdt} $USDT</button>
          <button onClick={handleBuyItem}>
            {isLoading ? (
              <p>loading</p>
            ) : (
              <>
                {item.price_internal} <img src={CoinIcon} alt=''/>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt=''/>
          <p>Нужен уровень Древа 7</p>
          <img src={LockIcon} alt=''/>
        </div>
      )}
    </div>
  );
};
