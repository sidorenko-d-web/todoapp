import { useEffect, useState } from 'react';
import { ShopLayout } from '../../../layout/ShopLayout/ShopLayout';
import { useGetInventoryItemsQuery } from '../../../redux/api/inventory/api';
import {
  ItemUpgradedModal,
  ItemsTab,
  ShopUpgradedModal,
  SkinTab,
} from '../../../components';
import {
  IShopItem,
  TypeItemCategory,
  TypeItemRarity,
  useGetShopItemsQuery,
} from '../../../redux';
import { compareItems } from '../../../helpers';
import styles from '../ShopPage.module.scss'
import GetRewardChestModal from '../../DevModals/GetRewardChestModal/GetRewardChestModal';

type TypeTab<T> = { title: string; value: T };

export const ShopInvewntoryPage = () => {
  const [shopCategory, setShopCategory] = useState<TypeTab<TypeItemCategory>>();
  const [itemsQuality, setItemsQuality] = useState<TypeTab<TypeItemRarity>>();

  const {
    data: inventory,
    isSuccess,
    isFetching,
  } = useGetInventoryItemsQuery(
    {
      item_category: shopCategory?.value!,
      item_rarity: itemsQuality?.value as TypeItemRarity,
    },
    { skip: !shopCategory?.value },
  );

  const { data: shop } = useGetShopItemsQuery(
    {
      item_category: shopCategory?.value!,
      item_rarity: itemsQuality?.value,
      level: 1,
    },
    { skip: !shopCategory?.value },
  );
  const [items, setItems] = useState<IShopItem[]>();
  const [itemsForBuy, setItemsForBuy] = useState<IShopItem[]>();

  useEffect(() => {
    const _items = inventory?.items.filter((item, _, arr) => {
      if (item.item_premium_level === 'base') {
        return !arr.find(
          _item =>
            _item.name === item.name &&
            _item.item_rarity === item.item_rarity &&
            _item.item_premium_level === 'advanced',
        )
          ? true
          : false;
      } else if (item.item_premium_level === 'advanced') {
        return !arr.find(
          _item =>
            _item.name === item.name &&
            _item.item_rarity === item.item_rarity &&
            _item.item_premium_level === 'pro',
        )
          ? true
          : false;
      } else {
        return true;
      }
    });

    const _itemsForBuy = shop?.items
      .filter(item => !inventory?.items.find(_item => compareItems(item, _item)))
      .filter(item =>
        inventory?.items.find(
          _item =>
            _item.level === 50 &&
            ((item.item_premium_level === 'advanced' &&
              _item.item_premium_level === 'base') ||
              (item.item_premium_level === 'pro' &&
                _item.item_premium_level === 'advanced')) &&
            _item.name === item.name,
        ),
      );

    setItems(_items);
    setItemsForBuy(_itemsForBuy);
  }, [inventory]);

  return (
    <ShopLayout
      mode="inventory"
      onItemCategoryChange={setShopCategory}
      onItemQualityChange={setItemsQuality}
    >
      {!isFetching && !isSuccess && shopCategory?.title !== 'Вы' ? (
        <p className={styles.emptyText}>Пока здесь нет приобретенных предметов. Купите новый предмет в магазине.</p>
      ) : !shopCategory || !itemsQuality ? (
        <p style={{ color: '#fff' }}>Error occured while getting data</p>
      ) : shopCategory?.title !== 'Вы' ? (
        isSuccess && (
          <>
            {itemsForBuy?.[0] && (
              <ItemsTab shopCategory={shopCategory} shopItems={itemsForBuy} />
            )}
            <ItemsTab shopCategory={shopCategory} inventoryItems={items} />
          </>
        )
      ) : (
        <SkinTab mode="inventory" />
      )}

      <ItemUpgradedModal />
      <ShopUpgradedModal />
      <GetRewardChestModal/>
    </ShopLayout>
  );
};
