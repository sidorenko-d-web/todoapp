import { FC, useState } from 'react';
import styles from './ShopSkinCard.module.scss';
import clsx from 'clsx';
import {
  IShopSkin,
  shopApi,
  useBuySkinMutation,
  useGetCharacterQuery,
  useGetProfileMeQuery,
  useUpdateCharacterMutation,
} from '../../../redux';
import CoinIcon from '../../../assets/icons/coin.png';
import HeadIcon from '../../../assets/icons/head_icon.svg';
import FaceIcon from '../../../assets/icons/face_icon.svg';
import LegsIcon from '../../../assets/icons/face_icon.svg';
import PersonIcon from '../../../assets/icons/person_icon.svg';
import VIPIcon from '../../../assets/icons/star_check_icon.svg';
import ListIcon from '../../../assets/icons/list.svg';
import { useModal } from '../../../hooks';
import { MODALS, svgHeadersString } from '../../../constants';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared';
import ListDisableIcon from '../../../assets/icons/list-disable.svg';
import useUsdtPayment from '../../../hooks/useUsdtPayment';

interface Props {
  item: IShopSkin;
  mode: 'shop' | 'inventory';
}

export const ShopSkinCard: FC<Props> = ({ item, mode }) => {
  const { t, i18n } = useTranslation('shop');
  const [idDisabled] = useState(true);

  const [buySkin, { isLoading: isBuyLoading }] = useBuySkinMutation();
  const [updateCharacter, { isLoading: isUpdateLoading }] = useUpdateCharacterMutation();

  const { refetch } = useGetProfileMeQuery(undefined, {});
  const { data: characterData, isLoading: isCharacterLoading } = useGetCharacterQuery();
  const { openModal } = useModal();

  const handleBuySkin = async () => {
    try {
      const res = await buySkin({ payment_method: 'internal_wallet', id: item.id });
      if (!res.error) {
        shopApi.util.resetApiState();
        openModal(MODALS.NEW_ITEM, { item: item, mode: 'skin' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { processPayment } = useUsdtPayment();

  const handleUsdtPayment = async () => {
    try {
      await processPayment(Number(item.price_usdt), async (result) => {
        if (result.success) {
          const res = await buySkin({
            id: item.id,
            payment_method: 'usdt',
            transaction_id: result.transactionHash,
            sender_address: result.senderAddress
          });

          if (!res.error) {
            shopApi.util.resetApiState();
            openModal(MODALS.NEW_ITEM, { item: item, mode: 'skin' });
          } else {
            throw new Error(JSON.stringify(res.error));
          }
        }
      });
    } catch (err) {
      console.error('Error in USDT payment flow:', err);
    }
  };


  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  const handleSelectSkin = async (item: IShopSkin) => {
    if (!characterData) return;
    const prevSkins = {
      head: characterData?.skins.find(_item => _item.wear_location === 'head')?.id,
      face: characterData?.skins.find(_item => _item.wear_location === 'face')?.id,
      legs: characterData?.skins.find(_item => _item.wear_location === 'legs')?.id,
      skin_color: characterData?.skins.find(_item => _item.wear_location === 'skin_color')?.id,
      upper_body: characterData?.skins.find(_item => _item.wear_location === 'upper_body')?.id,
      entire_body: characterData?.skins.find(_item => _item.wear_location === 'entire_body')?.id,
    };
    prevSkins[item.wear_location] = item.id;
    const body = {
      head_skin_id: prevSkins.head,
      face_skin_id: prevSkins.face,
      upper_body_skin_id: prevSkins.upper_body,
      legs_skin_id: prevSkins.legs,
      skin_color_id: prevSkins.skin_color,
      gender: characterData.gender,
    };
    try {
      await updateCharacter(body);
    } catch (error) {
      console.log(error);
    } finally {
      refetch();
    }
  };

  const isLoading = isUpdateLoading || isCharacterLoading || isBuyLoading;

  return (
    <div className={styles.storeCard}>
      <div className={styles.header}>
        <div className={clsx(styles.image, item.quantity && styles.vipImage)}>
          <img src={item.image_url + svgHeadersString} alt="item" />
        </div>
        <div className={styles.title}>
          <div className={styles.headline}>
            <h3>{locale === 'ru' ? item.name : item.name_eng}</h3>
            <div className={styles.icons}>
              {item.wear_location === 'head' ? (
                <img src={HeadIcon} className={styles.personIcon} />
              ) : item.wear_location === 'upper_body' ? (
                <img src={FaceIcon} className={styles.personIcon} />
              ) : item.wear_location === 'entire_body' ? (
                <img src={PersonIcon} className={styles.personIcon} />
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
          <p className={styles.description}>{/* {t('s36')} */}</p>
        </div>
      </div>

      <div className={styles.actions}>
        {item.limited ? (
          <Button className={styles.vipButton}>
            {formatAbbreviation(item.price_usdt, 'currency', { locale: locale })} ({t('s10')} {item.quantity} {t('s11')}
            .)
          </Button>
        ) : mode === 'shop' ? (
          <>
            <Button className={styles.button} onClick={handleUsdtPayment}>
              {formatAbbreviation(item.price_usdt, 'currency', { locale: locale })}
            </Button>
            <Button className={styles.priceButton} onClick={handleBuySkin}>
              {isLoading ? (
                <p>{t('s59')}</p>
              ) : (
                <>
                  {formatAbbreviation(item.price_internal, 'number', { locale: locale })} <img src={CoinIcon} />
                </>
              )}
            </Button>
            <Button className={styles.listButton} disabled={idDisabled}>
              <img src={idDisabled ? ListDisableIcon : ListIcon} alt="list icon" />
            </Button>
          </>
        ) : characterData?.skins.map(item => item.id).includes(item.id) ? (
          <Button disabled className={styles.buttonInventory}>
            {isLoading ? (
              <p>{t('s59')}</p>
            ) : (
              <>
                <p>{t('s39-1')}</p>
              </>
            )}
          </Button>
        ) : (
          <Button onClick={() => handleSelectSkin(item)} className={styles.buttonInventory}>
            {isLoading ? (
              <p>{t('s59')}</p>
            ) : (
              <>
                <p>{t('s39')}</p>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
