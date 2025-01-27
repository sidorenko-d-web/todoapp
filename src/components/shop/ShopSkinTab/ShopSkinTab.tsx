import { useGetInventorySkinsQuery } from '../../../redux/api/inventory/api';
import { useGetShopSkinsQuery } from '../../../redux/api/shop/api';
import ShopSkinCard from '../ShopSkinCard/ShopSkinCard';
import styles from './ShopSkinTab.module.scss';

const ShopSkinTab = () => {
  const { data: shopSkins } = useGetShopSkinsQuery();

  const { data: inventorySkins } = useGetInventorySkinsQuery();

  const skinsData = shopSkins?.skins.filter(
    item => inventorySkins?.skins.findIndex(_item => _item.id === item.id) === -1,
  );

  const skins = {
    head: skinsData?.filter(item => item.wear_location === 'head' && !item.limited),
    upper_body: skinsData?.filter(item => item.wear_location === 'upper_body' && !item.limited),
    entire_body: skinsData?.filter(item => item.wear_location === 'entire_body' && !item.limited),
    legs: skinsData?.filter(item => item.wear_location === 'legs' && !item.limited),
    feet: skinsData?.filter(item => item.wear_location === 'feet' && !item.limited),
    vip: skinsData?.filter(item => item.limited),
  };

  return (
    <>
      {skins?.head && skins.head.length > 0 && (
        <div className={styles.personCards}>
          <h2>Голова</h2>
          {skins.head?.map(item => (
            <ShopSkinCard item={item} />
          ))}
        </div>
      )}

      {skins.upper_body && skins.upper_body.length > 0 && (
        <div className={styles.personCards}>
          <h2>Вверх</h2>
          {skins.upper_body?.map(item => (
            <ShopSkinCard item={item} />
          ))}
        </div>
      )}

      {skins.entire_body && skins.entire_body.length > 0 && (
        <div className={styles.personCards}>
          <h2>Тело</h2>
          {skins.entire_body?.map(item => (
            <ShopSkinCard item={item} />
          ))}
        </div>
      )}

      {skins.legs && skins.legs.length > 0 && (
        <div className={styles.personCards}>
          <h2>Низ</h2>
          {skins.legs?.map(item => (
            <ShopSkinCard item={item} />
          ))}
        </div>
      )}

      {skins.feet && skins.feet.length > 0 && (
        <div className={styles.personCards}>
          <h2>Обувь</h2>
          {skins.feet?.map(item => (
            <ShopSkinCard item={item} />
          ))}
        </div>
      )}
      {skins.vip && skins.vip.length > 0 && (
        <div className={styles.personCards}>
          <h2 className={styles.vipTitle}>VIP скины</h2>
          {skins.vip?.map(item => (
            <ShopSkinCard item={item} />
          ))}
        </div>
      )}
    </>
  );
};

export default ShopSkinTab;
