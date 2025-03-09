import { FC } from 'react';
import { ShopItemCard } from '../ShopItemCard';
import styles from './ItemsTab.module.scss';
import { IShopItem } from '../../../redux';
import { InventoryCard } from '../InventoryCard';

interface props {
  shopCategory: {
    title: string;
    value: string;
  } | undefined;
  shopItems?: IShopItem[];
  inventoryItems?: IShopItem[];
}

export const ItemsTab: FC<props> = ({ inventoryItems, shopItems }) => {

  return (
    <div className={styles.cardsWrapper}>
      {inventoryItems?.map(item => (
        <InventoryCard key={item.id} item={item} />
      ))}
      {/* todo: remove before prod */}
      {/* {isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) ? ( */}
      {/* {isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) ? (
        <> */}
          {shopItems?.map(item => (
            <ShopItemCard key={item.id} item={item} />
          ))}
        {/* </>
      ) : foundItem ? (
        <ShopItemCard key={foundItem.id} item={foundItem} />
      ) : (
        <></>
      )} */}
    </div>
  );
};
