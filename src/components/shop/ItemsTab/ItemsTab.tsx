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
}

export const ItemsTab: FC<props> = ({ inventoryItems, shopItems }) => {


  return (
    <div className={styles.cardsWrapper}>
      {shopItems?.map(item => (
        <ShopItemCard key={item.id} item={item} />
      ))}
      {inventoryItems?.map(item => (
        <InventoryCard key={item.id} item={item} />
      ))}
    </div>
  );
};
