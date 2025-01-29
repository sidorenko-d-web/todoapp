import { FC } from 'react';
import styles from './ShopItemCard.module.scss';
import clsx from 'clsx';
import LockIconSvg from '../../../assets/Icons/lock-closed';
import ChestBlueIcon from '../../../assets/Icons/chest-blue.svg';
import ChestPurpleIcon from '../../../assets/Icons/chest-purple.svg';
import ChestRedIcon from '../../../assets/Icons/chest-red.svg';
import { useBuyItemMutation } from '../../../redux/api/shop/api';
import { TypeItemQuality, IShopItem } from '../../../redux';
import CoinIcon from '../../../assets/Icons/coin.svg'
import SubscriberCoin from '../../../assets/Icons/subscriber_coin.svg'
import LockIcon from '../../../assets/Icons/lock_icon.svg'

interface Props {
  disabled?: boolean;
  isUpgradeEnabled?: boolean;
  isBlocked?: boolean;
  isB?: boolean;
  refetchAll: () => void;
  variant?: TypeItemQuality;

  item: IShopItem;
}

export const InventoryCard: FC<Props> = ({
  disabled,
  isBlocked,
  isUpgradeEnabled = true,
  variant = 'lowcost',
  item,
  isB,
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
        <div
          className={clsx(styles.image, variant === 'prem' ? styles.purpleImage : variant === 'lux' && styles.redImage)}
        >
          <img src={item.image_url} className={clsx(isBlocked && styles.disabledImage)} />
          {isBlocked && <LockIconSvg className={styles.disabledImageIcon} />}
          {!isBlocked && <p>Base</p>}
        </div>
        <div className={styles.title}>
          <div className={styles.headline}>
            <h3>{item.name}</h3>
            {variant === 'lowcost' ? (
              <div className={styles.variant}>
                <p>Эконом</p>
              </div>
            ) : variant === 'prem' ? (
              <div className={styles.variantPurple}>
                <p>Премиум</p>
              </div>
            ) : (
              <div className={styles.variantRed}>
                <p>Люкс</p>
              </div>
            )}
          </div>
          <p className={variant === 'lux' ? styles.colorRed : variant === 'prem' ? styles.colorPurple : styles.level}>
            Уровень {item.level} {isB && 'Предмет куплен'}
          </p>
          <div className={clsx(styles.stats, (isBlocked || disabled) && styles.disabledStats)}>
            <div className={styles.statsItem}>
              <p>+{item.boost.income_per_integration}</p>
              <img src={CoinIcon} />
            </div>
            <div className={styles.statsItem}>
              <p>+{item.boost.subscribers}</p>
              <img src={SubscriberCoin} />
            </div>
            <div className={styles.statsItem}>
              <p>+{item.boost.income_per_second}</p>
              <img src={CoinIcon} />
              <p>/сек</p>
            </div>
          </div>
        </div>
      </div>

      {!isBlocked && 
        (disabled ? (
          <p className={styles.disabledText}>
            Сейчас активен “
            <span className={variant === 'prem' ? styles.itemNameBlue : styles.itemNamePurple}>
              Компьютерный стул - Base
            </span>
            ”. Вы можете заменить его на текущий предмет, сделав его активным.
          </p>
        ) : (
          <div className={styles.progress}>
            <div className={styles.text}>
              <p>{item.level}/50 уровней </p>
              <div className={styles.goal}>
                <p>Каменный сундук</p>
                <img
                  src={variant === 'lowcost' ? ChestBlueIcon : variant === 'prem' ? ChestPurpleIcon : ChestRedIcon}
                />
              </div>
            </div>

            <div className={styles.progressBar}>
              <div
                className={
                  variant === 'lowcost' ? styles.done : variant === 'prem' ? styles.donePurple : styles.doneRed
                }
                style={{ width: item.level * 2 + '%' }}
              />
            </div>

            <div className={styles.items}>
              <div
                className={
                  variant === 'lowcost' ? styles.item : variant === 'prem' ? styles.itemPurple : styles.itemRed
                }
              >
                <img src={item.image_url} className={styles.itemImage} />
                <img src={LockIcon} className={styles.lock} />
              </div>
              <div className={styles.itemLocked}>
                <img src={item.image_url} className={styles.itemImage} />
                <img src={LockIcon} className={styles.lock} />
              </div>
              <div className={styles.itemLocked}>
                <img src={item.image_url} className={styles.itemImage} />
                <img src={LockIcon} className={styles.lock} />
              </div>
            </div>
          </div>
        ))}

      {isBlocked ? (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} />
          <p>Прокачайте основной предмет</p>
          <img src={LockIcon} />
        </div>
      ) : disabled ? (
        <button className={styles.disabledActions}>
          <p>Активировать</p>
        </button>
      ) : isUpgradeEnabled ? (
        <div className={styles.actions}>
          <button onClick={handleBuyItem}>
            {isLoading ? (
              <p>loading</p>
            ) : (
              <>
                {item.price_internal} <img src={CoinIcon} />
              </>
            )}
          </button>
          <button>Задание</button>
          <button disabled>{item.price_usdt} $USDT</button>
        </div>
      ) : (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} />
          <p>Нужен уровень Древа 7</p>
          <img src={LockIcon} />
        </div>
      )}
    </div>
  );
};
