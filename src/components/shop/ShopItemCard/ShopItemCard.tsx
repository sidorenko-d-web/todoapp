import { FC, useState } from 'react';
import styles from './ShopItemCard.module.scss';
import clsx from 'clsx';
import { useBuyItemMutation } from '../../../redux';
import { useGetCurrentUserProfileInfoQuery } from '../../../redux';
import { IShopItem } from '../../../redux';
import CoinIcon from '../../../assets/icons/coin.png';
import SubscriberCoin from '../../../assets/icons/subscriber_coin.svg';
import LockIcon from '../../../assets/icons/lock_icon.svg';
import ViewsIcon from '../../../assets/icons/views.png';
import { MODALS, svgHeadersString } from '../../../constants';
import { formatAbbreviation } from '../../../helpers';
import { useModal } from '../../../hooks';
import { useTranslation } from 'react-i18next';
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
  const userPoints = data?.points || 0;
  const [error, setError] = useState('');

  const handleBuyItem = async () => {
    try {
      dispatch(setPoints((prevPoints: number) => prevPoints + 1));
      const res = await buyItem({ payment_method: 'internal_wallet', id: item.id });
      if (!res.error) {
        openModal(MODALS.NEW_ITEM, { item: item, mode: 'item' });
      } else {
        setError(JSON.stringify(res.error));
      }
    } catch (error) {}
  };

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
              <p>+{formatAbbreviation(item.boost.views,'number', { locale: locale })}</p>
              <img src={ViewsIcon} />
            </div>
            <div className={styles.statsItem}>
              <p>+{formatAbbreviation(item.boost.subscribers,'number', { locale: locale })}</p>
              <img src={SubscriberCoin} />
            </div>
            <div className={styles.statsItem}>
              <p>+{formatAbbreviation(item.boost.income_per_second,'number', { locale: locale })}</p>
              <img src={CoinIcon} alt="" />
              <p>/{t('s13')}</p>
            </div>
          </div>
        </div>
      </div>

      {!disabled ? (
        <div className={styles.actions}>
          <button
            onClick={() => openModal(MODALS.NEW_ITEM, { item: item, mode: 'item' })}
          >
            {formatAbbreviation(item.price_usdt, 'currency',{ locale: locale })}
          </button>
          <button
            className={userPoints < item.price_internal ? styles.disabledButton : ''}
            onClick={handleBuyItem}
          >
            {isLoading ? (
              <p>loading</p>
            ) : (
              <>
                {formatAbbreviation(item.price_internal,'number', { locale: locale })} <img src={CoinIcon} alt="" />
              </>
            )}
          </button>
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
