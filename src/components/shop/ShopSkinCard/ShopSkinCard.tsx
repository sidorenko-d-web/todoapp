import { FC } from 'react';
import styles from './ShopSkinCard.module.scss';
import clsx from 'clsx';
import { shopApi, useBuySkinMutation } from '../../../redux';
import { IShopSkin } from '../../../redux';
import CoinIcon from '../../../assets/icons/coin.png';
import HeadIcon from '../../../assets/icons/head_icon.svg';
import FaceIcon from '../../../assets/icons/face_icon.svg';
import LegsIcon from '../../../assets/icons/face_icon.svg';
import FeetIcon from '../../../assets/icons/face_icon.svg';
import PersonIcon from '../../../assets/icons/person_icon.svg';
import VIPIcon from '../../../assets/icons/star_check_icon.svg';
import ListIcon from '../../../assets/icons/list.svg';
import { useModal } from '../../../hooks';
import { MODALS, svgHeadersString } from '../../../constants';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared';

interface Props {
  item: IShopSkin;
  mode: 'shop' | 'inventory';
}

export const ShopSkinCard: FC<Props> = ({ item, mode }) => {
  const { t,i18n } = useTranslation('shop');
  const [buySkin, { isLoading }] = useBuySkinMutation();
  const { openModal } = useModal();

  const handleBuySkin = async () => {
    try {
      const res = await buySkin({ payment_method: 'internal_wallet', id: item.id });
      console.log(res);
      if (!res.error) {
        shopApi.util.resetApiState()
        openModal(MODALS.NEW_ITEM, { item: item, mode: 'skin' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';


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
          <p className={styles.description}>{t('s36')}</p>
        </div>
      </div>

      <div className={styles.actions}>
        {item.limited ? (
          <Button className={styles.vipButton}>
            {formatAbbreviation(item.price_usdt, 'currency',{ locale: locale })} ({t('s10')} {item.quantity} {t('s11')}.)
          </Button>
        ) : mode === 'shop' ? (
          <>
            <Button
              className={styles.button}
              onClick={() => openModal(MODALS.NEW_ITEM, { item: item, mode: 'skin' })}
            >
              {formatAbbreviation(item.price_usdt, 'currency', { locale: locale })}
            </Button>
            <Button className={styles.priceButton} onClick={handleBuySkin}>
              {isLoading ? (
                <p>Loading</p>
              ) : (
                <>
                  {formatAbbreviation(item.price_internal, 'number', { locale: locale })} <img src={CoinIcon} />
                </>
              )}
            </Button>
            <Button className={styles.listButton}>
              <img src={ListIcon} alt="list icon" />
            </Button>
          </>
        ) : (
          <>
            <Button className={styles.buttonInventory}>
              {isLoading ? (
                <p>Loading</p>
              ) : (
                <>
                  <p>{t('s39')}</p>
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
