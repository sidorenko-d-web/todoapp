import { FC, useState } from 'react';
import { ShopLayout } from '../../layout/ShopLayout/ShopLayout';
import { ItemsTab, NewItemModal, SkinTab } from '../../components';
import { useGetShopItemsQuery } from '../../redux/api/shop/api';
import { TypeItemCategory, TypeItemRarity } from '../../redux';
import { useGetInventoryItemsQuery } from '../../redux/api/inventory/api';

type TypeTab<T> = { title: string; value: T };

const getStatus = (name: string): { status: 'pro' | 'adv' | 'base'; name: string } => {
  let status: 'pro' | 'adv' | 'base' = 'base';
  if (name.includes('Pro')) status = 'pro';
  else if (name.includes('Prem')) status = 'adv';
  else status = 'base';

  const nameArr = name.split(' ');
  if (status === 'base') {
    return {
      status,
      name: nameArr.join(' '),
    };
  }
  console.log(nameArr.slice(0, nameArr.length - 1).join(' '));
  return {
    status,
    name: nameArr.slice(0, nameArr.length - 1).join(' '),
  };
};

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
    item_rarity: 'red',
  });

  const items = shop?.items.filter(item => {
    const { status, name } = getStatus(item.name);
    const baseInventoryItem = inventory?.items.find(_item => {
      return (_item.name) === name && getStatus(_item.name).status === 'base';
    });

    const advInventoryItem = inventory?.items.find(
      _item => getStatus(_item.name).name === name && getStatus(_item.name).status === 'adv',
    );

    if (status === 'base') return !baseInventoryItem;
    else if (status === 'adv') return baseInventoryItem?.level === 14;
    else return advInventoryItem && advInventoryItem?.level === 14;
  });

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

