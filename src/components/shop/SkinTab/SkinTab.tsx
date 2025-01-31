import { FC } from 'react';
import { ShopSkinCard } from '../ShopSkinCard/ShopSkinCard';
import styles from './SkinTab.module.scss';
import { useGetShopSkinsQuery, useGetInventorySkinsQuery} from '../../../redux';

interface Props {
  mode: 'shop' | 'inventory';
}

export const SkinTab: FC<Props> = ({ mode }) => {
  const { data: shop } = useGetShopSkinsQuery();

  const { data: inventory } = useGetInventorySkinsQuery();

  let skinsData = shop?.skins.filter(item => inventory?.skins.findIndex(_item => _item.id === item.id) === -1)

  let skins;

  if (mode === 'shop') {
    skins = {
      head: skinsData?.filter(item => item.wear_location === 'head' && !item.limited),
      upper_body: skinsData?.filter(item => item.wear_location === 'upper_body' && !item.limited),
      entire_body: skinsData?.filter(item => item.wear_location === 'entire_body' && !item.limited),
      legs: skinsData?.filter(item => item.wear_location === 'legs' && !item.limited),
      feet: skinsData?.filter(item => item.wear_location === 'feet' && !item.limited),
      vip: skinsData?.filter(item => item.limited),
    };
  } else {
    skins = {
      head: inventory?.skins?.filter(item => item.wear_location === 'head' && !item.limited),
      upper_body: inventory?.skins?.filter(item => item.wear_location === 'upper_body' && !item.limited),
      entire_body: inventory?.skins?.filter(item => item.wear_location === 'entire_body' && !item.limited),
      legs: inventory?.skins?.filter(item => item.wear_location === 'legs' && !item.limited),
      feet: inventory?.skins?.filter(item => item.wear_location === 'feet' && !item.limited),
      vip: inventory?.skins?.filter(item => item.limited),
    };
  }

  return (
    <>
      {skins?.head && skins.head.length > 0 && (
        <div className={styles.personCards}>
          <h2>Голова</h2>
          {skins.head?.map(item => (
            <ShopSkinCard mode={mode} key={item.id} item={item} />
          ))}
        </div>
      )}

      {skins.upper_body && skins.upper_body.length > 0 && (
        <div className={styles.personCards}>
          <h2>Вверх</h2>
          {skins.upper_body?.map(item => (
            <ShopSkinCard mode={mode} key={item.id} item={item} />
          ))}
        </div>
      )}

      {skins.entire_body && skins.entire_body.length > 0 && (
        <div className={styles.personCards}>
          <h2>Тело</h2>
          {skins.entire_body?.map(item => (
            <ShopSkinCard mode={mode} key={item.id} item={item} />
          ))}
        </div>
      )}

      {skins.legs && skins.legs.length > 0 && (
        <div className={styles.personCards}>
          <h2>Низ</h2>
          {skins.legs?.map(item => (
            <ShopSkinCard mode={mode} key={item.id} item={item} />
          ))}
        </div>
      )}

      {skins.feet && skins.feet.length > 0 && (
        <div className={styles.personCards}>
          <h2>Обувь</h2>
          {skins.feet?.map(item => (
            <ShopSkinCard mode={mode} key={item.id} item={item} />
          ))}
        </div>
      )}
      {skins.vip && skins.vip.length > 0 && (
        <div className={styles.personCards}>
          <h2 className={styles.vipTitle}>VIP скины</h2>
          {skins.vip?.map(item => (
            <ShopSkinCard mode={mode} key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
};
