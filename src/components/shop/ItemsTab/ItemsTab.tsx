import { FC } from 'react';
import { ShopItemCard } from '../ShopItemCard/ShopItemCard';
import styles from './ItemsTab.module.scss';
import { IShopItem, TypeItemQuality } from '../../../redux';
import { InventoryCard } from '../InventoryCard';
import { useGetInventoryItemsQuery } from '../../../redux/api/inventory/api';

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
  const { data: inventory } = useGetInventoryItemsQuery();

  const shopItemsFiltered = shopItems
    ?.filter(item => {
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
    })
    .filter(item => {
      if (itemsQuality.value === 'lux') {
        return (
          inventory?.items.find(_item => item.name.includes(_item.name) && item.name.includes('Prem'))?.level === 50
        );
      } else if (itemsQuality.value === 'prem') {
        return (
          inventory?.items.find(_item => item.name.includes(_item.name))?.level === 50
        );
      }
      return true;
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
