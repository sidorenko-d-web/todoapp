import { FC } from 'react';
import { ShopItemCard } from '../ShopItemCard/ShopItemCard';
import styles from './ItemsTab.module.scss';
import { IShopItem, TypeItemQuality } from '../../../redux';
import { InventoryCard } from '../InventoryCard';

interface props {
  itemsQuality: {
    title: string;
    value: string;
  };
  shopCategory: {
    title: string;
    value: string;
  };
  shopItems?: IShopItem[];
  inventoryItems?: IShopItem[];
  refetchFn: () => void;
}

export const ItemsTab: FC<props> = ({ itemsQuality, inventoryItems, shopItems, refetchFn }) => {
  const shopItemsFiltered = shopItems?.filter(item => {
    if (itemsQuality.value === 'lux') {
      return item.name.includes('Pro') || item.name.includes('ВЫРОС');
    } else if (itemsQuality.value === 'prem') {
      return item.name.includes('Prem') || item.name.includes('РАСТЁТ');
    } else {
      return (
        !item.name.includes('Prem') &&
        !item.name.includes('Pro') &&
        !item.name.includes('ВЫРОС') &&
        !item.name.includes('РАСТЁТ')
      );
    }
  });

  const itemsFiltered = inventoryItems?.filter(item => {
    if (itemsQuality.value === 'lux') {
      return item.name.includes('Pro') || item.name.includes('ВЫРОС');
    } else if (itemsQuality.value === 'prem') {
      return item.name.includes('Prem') || item.name.includes('РАСТЁТ');
    } else {
      return (
        !item.name.includes('Prem') &&
        !item.name.includes('Pro') &&
        !item.name.includes('ВЫРОС') &&
        !item.name.includes('РАСТЁТ')
      );
    }
  });

  const refetchAll = () => {
    refetchFn();
  };

  return (
    <div className={styles.cardsWrapper}>
      {shopItemsFiltered?.map(item => (
        <ShopItemCard
          key={item.id}
          variant={itemsQuality.value as TypeItemQuality}
          item={item}
          refetchAll={refetchAll}
        />
      ))}
      {itemsFiltered?.map(item => (
        <InventoryCard
          key={item.id}
          variant={itemsQuality.value as TypeItemQuality}
          item={item}
          refetchAll={refetchAll}
        />
      ))}
    </div>
  );
};
