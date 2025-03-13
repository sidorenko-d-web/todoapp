import { FC } from 'react';
import { ShopSkinCard } from '../ShopSkinCard';
import styles from './SkinTab.module.scss';
import { useGetShopSkinsQuery, useGetInventorySkinsQuery } from '../../../redux';
import { useTranslation } from 'react-i18next';

interface Props {
  mode: 'shop' | 'inventory';
}

export const SkinTab: FC<Props> = ({ mode }) => {
  const { t } = useTranslation('shop');
  const { data: shop } = useGetShopSkinsQuery();

  const { data: inventory } = useGetInventorySkinsQuery();

  const skinsData = shop?.skins.filter(item =>
    !inventory ? true : inventory?.skins.findIndex(_item => _item.id === item.id) === -1,
  );

  let skins;

  if (mode === 'shop') {
    skins = {
      head: skinsData?.filter(item => item.wear_location === 'head' && !item.limited),
      face: skinsData?.filter(item => item.wear_location === 'face' && !item.limited),
      upper_body: skinsData?.filter(item => item.wear_location === 'upper_body' && !item.limited),
      legs: skinsData?.filter(item => item.wear_location === 'legs' && !item.limited),
      skin_color: skinsData?.filter(item => item.wear_location === 'skin_color' && !item.limited),
      vip: skinsData?.filter(item => item.limited),
    };
  } else {
    skins = {
      head: inventory?.skins?.filter(item => item.wear_location === 'head' && !item.limited),
      face: inventory?.skins?.filter(item => item.wear_location === 'face' && !item.limited),
      upper_body: inventory?.skins?.filter(item => item.wear_location === 'upper_body' && !item.limited),
      legs: inventory?.skins?.filter(item => item.wear_location === 'legs' && !item.limited),
      skin_color: inventory?.skins?.filter(item => item.wear_location === 'skin_color' && !item.limited),
      vip: inventory?.skins?.filter(item => item.limited),
    };
  }

  return (
    <>
      {skins?.head && skins.head.length > 0 && (
        <div className={styles.personCards}>
          <h2>{t('s30')}</h2>
          {skins.head?.map(item => <ShopSkinCard mode={mode} key={item.id} item={item} />)}
        </div>
      )}
      {skins?.upper_body && skins.upper_body.length > 0 && (
        <div className={styles.personCards}>
          <h2>{t('s7')}</h2>
          {skins.upper_body?.map(item => <ShopSkinCard mode={mode} key={item.id} item={item} />)}
        </div>
      )}
      {skins?.skin_color && skins.skin_color.length > 0 && (
        <div className={styles.personCards}>
          <h2>{t('s32')}</h2>
          {skins.skin_color?.map(item => <ShopSkinCard mode={mode} key={item.id} item={item} />)}
        </div>
      )}
      {skins?.face && skins.face.length > 0 && (
        <div className={styles.personCards}>
          <h2>{t('s7')}</h2>
          {skins.face?.map(item => <ShopSkinCard mode={mode} key={item.id} item={item} />)}
        </div>
      )}
      {skins?.legs && skins.legs.length > 0 && (
        <div className={styles.personCards}>
          <h2>{t('s8')}</h2>
          {skins.legs?.map(item => <ShopSkinCard mode={mode} key={item.id} item={item} />)}
        </div>
      )}
      {skins?.vip && skins.vip.length > 0 && (
        <div className={styles.personCards}>
          <h2 className={styles.vipTitle}>{t('s9')}</h2>
          {skins.vip?.map(item => <ShopSkinCard mode={mode} key={item.id} item={item} />)}
        </div>
      )}
    </>
  );
};
