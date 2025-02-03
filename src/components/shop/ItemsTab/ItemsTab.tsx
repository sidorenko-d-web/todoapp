import { FC } from 'react';
import { ShopItemCard } from '../ShopItemCard/ShopItemCard';
import styles from './ItemsTab.module.scss';
import { IShopItem } from '../../../redux';
import { InventoryCard } from '../InventoryCard';

interface props {
  shopCategory: {
    title: string;
    value: string;
  };
  shopItems?: IShopItem[];
  inventoryItems?: IShopItem[];
  refetchFn: () => void;
}

export const ItemsTab: FC<props> = ({ inventoryItems, shopItems, refetchFn }) => {
  const refetchAll = () => {
    refetchFn();
  };

  return (
    <div className={styles.cardsWrapper}>
      {shopItems?.map(item => (
        <ShopItemCard key={item.id} variant={item.item_rarity} item={item} refetchAll={refetchAll} />
      ))}
      {inventoryItems?.map(item => (
        <InventoryCard key={item.id} variant={item.item_rarity} item={item} refetchAll={refetchAll} />
      ))}
    </div>
  );
};
