import { useState } from 'react';
import { ShopLayout } from '../../../layout/ShopLayout/ShopLayout';
import { useGetInventoryItemsQuery } from '../../../redux/api/inventory/api';
import { ItemUpgradedModal, ItemsTab, ShopUpgradedModal, SkinTab } from '../../../components';
import { TypeItemCategory, TypeItemQuality } from '../../../redux';

type TypeTab<T> = { title: string; value: T };

export const ShopInvewntoryPage = () => {
  const [shopCategory, setShopCategory] = useState<TypeTab<TypeItemCategory>>();
  const [itemsQuality, setItemsQuality] = useState<TypeTab<TypeItemQuality>>();

  const {
    data: inventory,
    isFetching: isInventoryFetching,
    refetch,
    isSuccess,
  } = useGetInventoryItemsQuery({ item_category: shopCategory?.value! }, { skip: !shopCategory?.value });

  return (
    <ShopLayout mode="inventory" onItemCategoryChange={setShopCategory} onItemQualityChange={setItemsQuality}>
      {isInventoryFetching ? (
        <p style={{ color: '#fff' }}>Loading...</p>
      ) : !isSuccess && shopCategory?.title !== 'Вы' ? (
        <p style={{ color: '#fff' }}>No items in inventory</p>
      ) : !shopCategory || !itemsQuality ? (
        <p style={{ color: '#fff' }}>Error occured while getting data</p>
      ) : shopCategory?.title !== 'Вы' ? (
        <ItemsTab
          shopCategory={shopCategory}
          itemsQuality={itemsQuality}
          inventoryItems={inventory?.items}
          refetchFn={refetch}
        />
      ) : (
        <SkinTab mode="inventory" />
      )}

      <ItemUpgradedModal />
      <ShopUpgradedModal />
    </ShopLayout>
  );
};
