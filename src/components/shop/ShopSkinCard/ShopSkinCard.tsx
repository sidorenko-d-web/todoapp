import { FC } from 'react';
import styles from './ShopSkinCard.module.scss';
import clsx from 'clsx';
import { useBuySkinMutation, useGetShopSkinsQuery } from '../../../redux/api/shop/api';
import { useGetInventorySkinsQuery } from '../../../redux/api/inventory/api';
import { IShopSkin } from '../../../redux';
import CoinIcon from '../../../assets/icons/coin.png';
import HeadIcon from '../../../assets/icons/head_icon.svg';
import FaceIcon from '../../../assets/icons/face_icon.svg';
import PersonIcon from '../../../assets/icons/person_icon.svg';
import LegsIcon from '../../../assets/icons/face_icon.svg';
import FeetIcon from '../../../assets/icons/face_icon.svg';
import VIPIcon from '../../../assets/icons/star_check_icon.svg';
import ListIcon from '../../../assets/icons/list.svg';
import { useModal } from '../../../hooks';
import { MODALS, svgHeadersString } from '../../../constants';

interface Props {
  item: IShopSkin;
  mode: 'shop' | 'inventory';
}

export const ShopSkinCard: FC<Props> = ({ item, mode }) => {
  const [buySkin, { isLoading }] = useBuySkinMutation();
  const { refetch: refetchShop } = useGetShopSkinsQuery();
  const { refetch: refetchInventory } = useGetInventorySkinsQuery();
  const { openModal } = useModal();

  const handleBuySkin = async () => {
    try {
      const res = await buySkin({ payment_method: 'internal_wallet', id: item.id });
      console.log(res);
      if (!res.error) {
        refetchInventory();
        refetchShop();
        openModal(MODALS.NEW_ITEM, { item: item, mode: 'skin' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(mode);

  return (
    <div className={styles.storeCard}>
      <div className={styles.header}>
        <div className={clsx(styles.image, item.quantity && styles.vipImage)}>
          <img src={item.image_url + svgHeadersString} alt="item" />
        </div>
        <div className={styles.title}>
          <div className={styles.headline}>
            <h3>{item.name}</h3>
            <div className={styles.icons}>
              {item.wear_location === 'head' ? (
                <img src={HeadIcon} className={styles.personIcon} />
              ) : item.wear_location === 'upper_body' ? (
                <img src={FaceIcon} className={styles.personIcon} />
              ) : item.wear_location === 'entire_body' ? (
                <img src={PersonIcon} className={styles.personIcon} />
              ) : item.wear_location === 'feet' ? (
                <img src={FeetIcon} className={styles.personIcon} />
              ) : (
                <img src={LegsIcon} className={styles.personIcon} />
              )}

              {item.limited && (
                <div className={styles.vip}>
                  <img src={VIPIcon} />
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
        ) : mode === 'shop' ? (
          <>
            <button className={styles.button} onClick={() => openModal(MODALS.NEW_ITEM, { item: item, mode: 'skin' })}>
              {item.price_usdt} $USDT
            </button>
            <button className={styles.priceButton} onClick={handleBuySkin}>
              {isLoading ? (
                <p>Загрузка</p>
              ) : (
                <>
                  {item.price_internal} <img src={CoinIcon} />
                </>
              )}
            </button>
            <button className={styles.listButton}>
              <img src={ListIcon} alt="" />
            </button>
          </>
        ) : (
          <>
            <button className={styles.buttonInventory}>
              {isLoading ? (
                <p>Загрузка</p>
              ) : (
                <>
                  <p>Надеть</p>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
