import { useEffect, useState } from 'react';
import { ShopLayout } from '../../../layout/ShopLayout/ShopLayout';
import {
  IShopItem,
  TypeItemCategory,
  TypeItemRarity,
  useGetCurrentUserBoostQuery,
  useGetEquipedQuery,
  useGetInventoryItemsQuery,
  useGetShopItemsQuery,
} from '../../../redux';
import { ItemsTab, ItemUpgradedModal, Loader, ShopUpgradedModal, SkinTab } from '../../../components';
import { compareItems } from '../../../helpers';
import styles from '../ShopPage.module.scss';
import GetRewardChestModal from '../../DevModals/GetRewardChestModal/GetRewardChestModal';
import { useTranslation } from 'react-i18next';

type TypeTab<T> = { title: string; value: T };

export const ShopInvewntoryPage = () => {
  const { t } = useTranslation('shop');
  const [shopCategory, setShopCategory] = useState<TypeTab<TypeItemCategory>>();
  const [itemsQuality, setItemsQuality] = useState<TypeTab<TypeItemRarity>>();

  const {
    data: inventory,
    isSuccess,
    isLoading: isInventoryLoading,
  } = useGetInventoryItemsQuery(
    {
      item_category: shopCategory?.value!,
      item_rarity: itemsQuality?.value as TypeItemRarity,
    },
    { skip: !shopCategory?.value },
  );

  const { data: shop, isLoading: isShopLoading } = useGetShopItemsQuery(
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
            _item.name === item.name && _item.item_rarity === item.item_rarity && _item.item_premium_level === 'pro',
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
            ((item.item_premium_level === 'advanced' && _item.item_premium_level === 'base') ||
              (item.item_premium_level === 'pro' && _item.item_premium_level === 'advanced')) &&
            _item.name === item.name,
        ),
      );

    setItems(_items?.reverse());
    setItemsForBuy(_itemsForBuy);
  }, [inventory]);

  const { isLoading: isBoostLoading } = useGetCurrentUserBoostQuery();
  const { isLoading: isEquipedLoading } = useGetEquipedQuery();

  const isLoading = isBoostLoading;

  if (isLoading) return <Loader />;

  return (
    <ShopLayout mode="inventory" onItemCategoryChange={setShopCategory} onItemQualityChange={setItemsQuality}>
      {isShopLoading || isInventoryLoading || isEquipedLoading ? (
        <Loader className={styles.itemsLoader} />
      ) : !isInventoryLoading && !isSuccess && shopCategory?.title !== 'Вы' ? (
        <p className={styles.emptyText}>{t('s38')}</p>
      ) : !shopCategory || !itemsQuality ? (
        <p style={{ color: '#fff' }}>Error occured while getting data</p>
      ) : shopCategory?.title !== `${t('s6')}` ? (
        isSuccess && (
          <>
            {itemsForBuy?.[0] && <ItemsTab shopCategory={shopCategory} shopItems={itemsForBuy} />}
            <ItemsTab
              shopCategory={shopCategory}
              inventoryItems={items?.sort((a, b) => a.name.localeCompare(b.name))}
            />
          </>
        )
      ) : (
        <SkinTab mode="inventory" />
      )}

      <ItemUpgradedModal />
      <ShopUpgradedModal />
      <GetRewardChestModal />
    </ShopLayout>
  );
};
