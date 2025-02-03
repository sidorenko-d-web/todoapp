import { FC } from 'react';
import styles from './InventoryCard.module.scss';
import clsx from 'clsx';
import LockIconSvg from '../../../assets/icons/lock-closed';
import ChestBlueIcon from '../../../assets/icons/chest-blue.svg';
import ChestPurpleIcon from '../../../assets/icons/chest-purple.svg';
import ChestRedIcon from '../../../assets/icons/chest-red.svg';
import {
  TypeItemRarity,
  useGetCurrentUserProfileInfoQuery,
  useGetShopItemsQuery,
  useUpgradeItemMutation,
} from '../../../redux';
import { IShopItem } from '../../../redux';
import CoinIcon from '../../../assets/icons/coin.svg';
import SubscriberCoin from '../../../assets/icons/subscriber_coin.svg';
import LockIcon from '../../../assets/icons/lock_icon.svg';
import ViewsIcon from '../../../assets/icons/views.svg';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants';

interface Props {
  disabled?: boolean;
  isUpgradeEnabled?: boolean;
  isBlocked?: boolean;
  isB?: boolean;
  refetchAll: () => void;
  variant?: TypeItemRarity;

  item: IShopItem;
}

export const InventoryCard: FC<Props> = ({
  disabled,
  isBlocked,
  isUpgradeEnabled = true,
  variant = 'red',
  item,
  isB,
  refetchAll,
}) => {
  const [upgradeItem, { isLoading }] = useUpgradeItemMutation();
  const { refetch } = useGetCurrentUserProfileInfoQuery();
  const { data } = useGetShopItemsQuery({ level: item.level === 50 ? 50 : item.level + 1, name: item.name });

  const { openModal } = useModal();

  const handleBuyItem = async () => {
    try {
      const res = await upgradeItem({ payment_method: 'internal_wallet', id: item.id });
      if (!res.error) {
        refetchAll();
        refetch();

        if (item.level === 49 && item.name.includes('Pro')) {
          openModal(MODALS.UPGRADED_SHOP, { item, isYellow: item.item_rarity === 'red' });
        }
      }
    } catch (error) {}
  };

  return (
    <div className={styles.storeCard}>
      <div className={styles.header}>
        <div
          className={clsx(
            styles.image,
            variant === 'yellow' ? styles.purpleImage : variant === 'green' && styles.redImage,
          )}
        >
          <img src={item.image_url} className={clsx(isBlocked && styles.disabledImage)} alt="" />
          {isBlocked && <LockIconSvg className={styles.disabledImageIcon} />}
          {!isBlocked && <p>Base</p>}
        </div>
        <div className={styles.title}>
          <div className={styles.headline}>
            <h3>{item.name}</h3>
            {variant === 'red' ? (
              <div className={styles.variant}>
                <p>Эконом</p>
              </div>
            ) : variant === 'yellow' ? (
              <div className={styles.variantPurple}>
                <p>Премиум</p>
              </div>
            ) : (
              <div className={styles.variantRed}>
                <p>Люкс</p>
              </div>
            )}
          </div>
          <p
            className={variant === 'green' ? styles.colorRed : variant === 'yellow' ? styles.colorPurple : styles.level}
          >
            Уровень {item.level} {isB && 'Предмет куплен'}
          </p>
          <div className={clsx(styles.stats, (isBlocked || disabled) && styles.disabledStats)}>
            <div className={styles.statsItem}>
              <p>+{item.boost.views}</p>
              <img src={ViewsIcon} />
            </div>
            <div className={styles.statsItem}>
              <p>+{item.boost.subscribers}</p>
              <img src={SubscriberCoin} alt="" />
            </div>
            <div className={styles.statsItem}>
              <p>+{item.boost.income_per_second}</p>
              <img src={CoinIcon} alt="" />
              <p>/сек</p>
            </div>
          </div>
        </div>
      </div>

      {!isBlocked &&
        (disabled ? (
          <p className={styles.disabledText}>
            Сейчас активен “
            <span className={variant === 'yellow' ? styles.itemNameBlue : styles.itemNamePurple}>
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
                  src={variant === 'red' ? ChestBlueIcon : variant === 'yellow' ? ChestPurpleIcon : ChestRedIcon}
                  alt=""
                />
              </div>
            </div>

            <div className={styles.progressBar}>
              <div
                className={variant === 'red' ? styles.done : variant === 'yellow' ? styles.donePurple : styles.doneRed}
                style={{ width: item.level * 2 + '%' }}
              />
            </div>

            <div className={styles.items}>
              <div
                className={variant === 'red' ? styles.item : variant === 'yellow' ? styles.itemPurple : styles.itemRed}
              >
                <img src={item.image_url} className={styles.itemImage} alt="" />
                <img src={LockIcon} className={styles.lock} alt="" />
              </div>
              <div className={styles.itemLocked}>
                <img src={item.image_url} className={styles.itemImage} alt="" />
                <img src={LockIcon} className={styles.lock} alt="" />
              </div>
              <div className={styles.itemLocked}>
                <img src={item.image_url} className={styles.itemImage} alt="" />
                <img src={LockIcon} className={styles.lock} alt="" />
              </div>
            </div>
          </div>
        ))}

      {isBlocked ? (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>Прокачайте основной предмет</p>
          <img src={LockIcon} alt="" />
        </div>
      ) : item.level === 50 ? (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>Достигнут макс. уровень</p>
          <img src={LockIcon} alt="" />
        </div>
      ) : disabled ? (
        <button className={styles.disabledActions}>
          <p>Активировать</p>
        </button>
      ) : isUpgradeEnabled ? (
        <div className={styles.actions}>
          <button disabled={item.level === 50} onClick={handleBuyItem}>
            {isLoading ? (
              <p>loading</p>
            ) : (
              <>
                {data?.items[0].price_internal} <img src={CoinIcon} alt="" />
              </>
            )}
          </button>
          <button>Задание</button>
          <button>{data?.items[0].price_usdt} $USDT</button>
        </div>
      ) : (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>Нужен уровень Древа 7</p>
          <img src={LockIcon} alt="" />
        </div>
      )}
    </div>
  );
};
