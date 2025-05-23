import { FC } from 'react';
import { ShopItemCard } from '../ShopItemCard/ShopItemCard';
import styles from './ItemsTab.module.scss';
import { IShopItem } from '../../../redux';
import { InventoryCard } from '../InventoryCard';
import { isGuideShown } from '../../../utils';
import { GUIDE_ITEMS } from '../../../constants';

interface props {
  shopCategory:
    | {
        title: string;
        value: string;
      }
    | undefined;
  shopItems?: IShopItem[];
  inventoryItems?: IShopItem[];
}

export const ItemsTab: FC<props> = ({ inventoryItems, shopItems, shopCategory }) => {
  const foundItem = shopItems?.find(item => item.name.toLowerCase().trim() === 'печатная машинка');
  const shopFiltered = shopItems?.filter(elem => elem.item_category === shopCategory?.value);

  return (
    <div className={styles.cardsWrapper}>
      {inventoryItems?.map(item => (
        <InventoryCard key={item.id} item={item} />
      ))}
      {isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) ? (
        <>
          {shopFiltered?.map(item => (
            <ShopItemCard key={item.id} item={item} />
          ))}
        </>
      ) : foundItem ? (
        <ShopItemCard key={foundItem.id} item={foundItem} />
      ) : (
        <></>
      )}
    </div>
  );
};
