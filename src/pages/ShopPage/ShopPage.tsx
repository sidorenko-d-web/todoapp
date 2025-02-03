import { FC, useState } from 'react';
import { ShopLayout } from '../../layout/ShopLayout/ShopLayout';
import { ItemsTab, NewItemModal, SkinTab } from '../../components';
import { useGetShopItemsQuery } from '../../redux/api/shop/api';
import { TypeItemCategory, TypeItemRarity } from '../../redux';
import { useGetInventoryItemsQuery } from '../../redux/api/inventory/api';

type TypeTab<T> = { title: string; value: T };

const StorePage: FC = () => {
  const [shopCategory, setShopCategory] = useState<TypeTab<TypeItemCategory>>();
  const [itemsRarity, setItemsQuality] = useState<TypeTab<TypeItemRarity>>();

  const {
    data: shop,
    isFetching: isShopFetching,
    refetch: refetchShop,
  } = useGetShopItemsQuery({
    item_category: shopCategory?.value as TypeItemCategory,
    level: 1,
    item_rarity: itemsRarity?.value,
  });

  const {
    data: inventory,
    isFetching: isInventoryFetching,
    refetch: refetchInventory,
  } = useGetInventoryItemsQuery({
    item_category: shopCategory?.value as TypeItemCategory,
    level: 1,
    item_rarity: 'red',
  });

  const items = shop?.items.filter(item => !inventory?.items.map(_item => _item.name).includes(item.name));

  const refetch = () => {
    refetchInventory();
    refetchShop();
  };

  return (
    <ShopLayout mode="shop" onItemCategoryChange={setShopCategory} onItemQualityChange={setItemsQuality}>
      {isShopFetching || isInventoryFetching ? (
        <p style={{ color: '#fff' }}>Loading...</p>
      ) : !shopCategory || !itemsRarity ? (
        <p style={{ color: '#fff' }}>Error occured while getting data</p>
      ) : shopCategory?.title !== 'Вы' ? (
        <ItemsTab shopCategory={shopCategory} shopItems={items} refetchFn={refetch} />
      ) : (
        <SkinTab mode="shop" />
      )}
      <NewItemModal />
    </ShopLayout>
  );
};

export default StorePage;
