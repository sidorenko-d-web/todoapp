import { FC } from 'react';
import styles from './ShopSkinCard.module.scss';
import clsx from 'clsx';
import { useBuySkinMutation, useGetShopSkinsQuery } from '../../../redux/api/shop/api';
import { useGetInventorySkinsQuery } from '../../../redux/api/inventory/api';
import { IShopSkin } from '../../../redux';

interface Props {
  item: IShopSkin;
}

export const ShopSkinCard: FC<Props> = ({ item }) => {
  const [buySkin, { isLoading }] = useBuySkinMutation();
  const { refetch: refetchShop } = useGetShopSkinsQuery();
  const { refetch: refetchInventory } = useGetInventorySkinsQuery();

  const handleBuySkin = async () => {
    try {
      const res = await buySkin({ payment_method: 'internal_wallet', id: item.id });
      console.log(res);
      if (!res.error) {
        refetchInventory();
        refetchShop();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.storeCard}>
      <div className={styles.header}>
        <div className={clsx(styles.image, item.quantity && styles.vipImage)}>
          <img src={item.image_url} alt="item" />
        </div>
        <div className={styles.title}>
          <div className={styles.headline}>
            <h3>{item.name}</h3>
            <div className={styles.icons}>
              {item.wear_location === 'head' ? (
                <img src="/img/head_icon.svg" className={styles.personIcon} />
              ) : item.wear_location === 'upper_body' ? (
                <img src="/img/face_icon.svg" className={styles.personIcon} />
              ) : item.wear_location === 'entire_body' ? (
                <img src="/img/person_icon.svg" className={styles.personIcon} />
              ) : item.wear_location === 'feet' ? (
                <img src="/img/face_icon.svg" className={styles.personIcon} />
              ) : (
                <img src="/img/face_icon.svg" className={styles.personIcon} />
              )}

              {item.limited && (
                <div className={styles.vip}>
                  <img src="/img/star_check_icon.svg" />
                  <p>VIP</p>
                </div>
              )}
            </div>
          </div>
          <p className={styles.description}>Небольшое описание скина.</p>
        </div>
      </div>

      <div className={styles.actions}>
        {item.limited ? (
          <button className={styles.vipButton}>
            {item.price_usdt} $USDT (осталось {item.quantity} шт.)
          </button>
        ) : (
          <>
            <button className={styles.button} onClick={handleBuySkin}>
              {isLoading ? (
                <p>Загрузка</p>
              ) : (
                <>
                  {item.price_internal} <img src="/img/coin.svg" />
                </>
              )}
            </button>
            <button className={styles.button}>Задание</button>
            <button disabled className={styles.button}>
              {item.price_usdt} $USD
            </button>
          </>
        )}
      </div>
    </div>
  );
};

