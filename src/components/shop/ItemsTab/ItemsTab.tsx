import { FC } from 'react';
import { ShopItemCard } from '../ShopItemCard/ShopItemCard';
import styles from './ItemsTab.module.scss';
import { IShopItem, TypeItemQuality } from '../../../redux';

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

export const ItemsTab: FC<props> = ({itemsQuality, shopItems, refetchFn }) => {
  const shopItemsFiltered = shopItems?.filter(item => {
    if (itemsQuality.value === 'lux') {
      return item.name.includes('Pro');
    } else if (itemsQuality.value === 'prem') {
      return item.name.includes('Prem');
    } else {
      return !item.name.includes('Prem') && !item.name.includes('Pro');
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
    </div>
  );
};
