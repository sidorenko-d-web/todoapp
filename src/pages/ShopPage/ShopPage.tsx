import { FC, useEffect, useState } from 'react';
import { ShopLayout } from '../../layout/ShopLayout/ShopLayout';
import { ItemsTab, NewItemModal, SkinTab } from '../../components';
import { useGetShopItemsQuery } from '../../redux/api/shop/api';
import { IShopItem, TypeItemCategory, TypeItemRarity } from '../../redux';
import { useGetInventoryItemsQuery } from '../../redux/api/inventory/api';
import styles from './ShopPage.module.scss';
import { itemsInTab } from '../../helpers';
type TypeTab<T> = { title: string; value: T };

const StorePage: FC = () => {
  const [shopCategory, setShopCategory] = useState<TypeTab<TypeItemCategory>>();
  const [itemsRarity, setItemsQuality] = useState<TypeTab<TypeItemRarity>>();

  const { data: shop, isFetching: isShopFetching } = useGetShopItemsQuery({
    item_category: shopCategory?.value as TypeItemCategory,
    level: 1,
    item_rarity: itemsRarity?.value,
    item_premium_level: 'base',
  });

  const { data: inventory, isFetching: isInventoryFetching } = useGetInventoryItemsQuery({
    item_category: shopCategory?.value as TypeItemCategory,
  });

  const [items, setItems] = useState<IShopItem[]>();

  useEffect(() => {
    const itemsInTab1 = itemsInTab(shop?.items, inventory?.items);
    console.log(itemsInTab1);
    setItems(
      itemsInTab(shop?.items, inventory?.items)[itemsRarity?.value as TypeItemRarity],
    );
  }, [inventory, shop]);

  return (
    <ShopLayout
      mode="shop"
      onItemCategoryChange={setShopCategory}
      onItemQualityChange={setItemsQuality}
    >
      {isShopFetching || isInventoryFetching ? (
        <p style={{ color: '#fff' }}>Loading...</p>
      ) : !shopCategory || !itemsRarity ? (
        <p style={{ color: '#fff' }}>Error occured while getting data</p>
      ) : shopCategory?.title !== 'Вы' ? (
        items?.length === 0 ? (
          <p className={styles.emptyText}>
            Пока здесь нет новых предметов. Откройте новые предметы с новым уровнем
            Дерева!
          </p>
        ) : (
          <ItemsTab shopCategory={shopCategory} shopItems={items} />
        )
      ) : (
        <SkinTab mode="shop" />
      )}
      <NewItemModal />
    </ShopLayout>
  );
};

export default StorePage;
