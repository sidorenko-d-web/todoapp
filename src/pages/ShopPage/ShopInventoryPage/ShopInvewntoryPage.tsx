import { useCallback, useMemo, useState } from 'react';
import { ShopLayout } from '../../../layout/ShopLayout/ShopLayout';
import {
  TypeItemCategory,
  TypeItemRarity,
  useGetCurrentUserBoostQuery,
  useGetEquipedQuery,
  useGetInventoryItemsQuery,
  useGetShopItemsQuery,
} from '../../../redux';
import { ItemsTab, ItemUpgradedModal, Loader, NewItemModal, ShopUpgradedModal, SkinTab } from '../../../components';
import { compareItems } from '../../../helpers';
import styles from '../ShopPage.module.scss';
import GetRewardChestModal from '../../DevModals/GetRewardChestModal/GetRewardChestModal';
import { useTranslation } from 'react-i18next';

type TypeTab<T> = { title: string; value: T };

export const ShopInventoryPage = () => {
  const { t } = useTranslation('shop');
  const [ shopCategory, setShopCategory ] = useState<TypeTab<TypeItemCategory>>();
  const [ itemsQuality, setItemsQuality ] = useState<TypeTab<TypeItemRarity>>();

  const {
    data: inventory,
    isSuccess,
    isLoading: isInventoryLoading,
  } = useGetInventoryItemsQuery(
    {
      item_categories: shopCategory ? [ shopCategory.value ] : [],
      item_rarity: itemsQuality?.value as TypeItemRarity,
    },
    { skip: !shopCategory?.value },
  );

  const { data: shop, isLoading: isShopLoading } = useGetShopItemsQuery(
    {
      item_category: shopCategory?.value,
      item_rarity: itemsQuality?.value,
      level: 1,
    },
    { skip: !shopCategory?.value },
  );

  const { isLoading: isBoostLoading } = useGetCurrentUserBoostQuery();
  const { isLoading: isEquipedLoading } = useGetEquipedQuery();

  const isLoading = isBoostLoading || isEquipedLoading || isShopLoading || isInventoryLoading;

  const items = useMemo(() => {
    if (!inventory || !shop || !shopCategory) return [];

    const filteredInventory = inventory.items.filter(item => item.item_category === shopCategory.value);

    return filteredInventory
      .filter((item, _, arr) => {
        if (item.item_premium_level === 'base') {
          return !arr.find(
            _item =>
              _item.name === item.name &&
              _item.item_rarity === item.item_rarity &&
              _item.item_premium_level === 'advanced',
          );
        } else if (item.item_premium_level === 'advanced') {
          return !arr.find(
            _item =>
              _item.name === item.name && _item.item_rarity === item.item_rarity && _item.item_premium_level === 'pro',
          );
        } else {
          return true;
        }
      })
      .reverse();
  }, [ inventory, shop, shopCategory ]);

  const itemsForBuy = useMemo(() => {
    if (!inventory || !shop || !shopCategory) return [];

    const filteredInventory = inventory.items.filter(item => item.item_category === shopCategory.value);
    const filteredShop = shop.items.filter(item => item.item_category === shopCategory.value);

    return filteredShop
      .filter(item => !filteredInventory.find(_item => compareItems(item, _item)))
      .filter(item =>
        filteredInventory.find(
          _item =>
            _item.level === 50 &&
            ((item.item_premium_level === 'advanced' && _item.item_premium_level === 'base') ||
              (item.item_premium_level === 'pro' && _item.item_premium_level === 'advanced')) &&
            _item.name === item.name,
        ),
      );
  }, [ inventory, shop, shopCategory ]);

  const handleItemCategoryChange = useCallback((category: TypeTab<TypeItemCategory>) => {
    setShopCategory(category);
  }, []);

  const handleItemQualityChange = useCallback((quality: TypeTab<TypeItemRarity>) => {
    setItemsQuality(quality);
  }, []);

  if (isLoading) return <Loader />;

  return (
    <ShopLayout
      mode="inventory"
      onItemCategoryChange={handleItemCategoryChange}
      onItemQualityChange={handleItemQualityChange}
    >
      {isShopLoading || isEquipedLoading ? (
        <Loader className={styles.itemsLoader} />
      ) : !isInventoryLoading && !isSuccess && shopCategory?.title !== 'Вы' ? (
        <p className={styles.emptyText}>{t('s38')}</p>
      ) : !shopCategory || !itemsQuality ? (
        <p style={{ color: '#fff' }}>Error occured while getting data</p>
      ) : shopCategory?.title !== `${t('s6')}` ? (
        isSuccess && (
          <>
            {itemsForBuy?.[0] && <ItemsTab shopCategory={shopCategory} shopItems={itemsForBuy} />}
            <ItemsTab shopCategory={shopCategory} inventoryItems={items} />
          </>
        )
      ) : (
        <SkinTab mode="inventory" />
      )}

      <ItemUpgradedModal />
      <ShopUpgradedModal />
      <GetRewardChestModal />
      <NewItemModal />
    </ShopLayout>
  );
};
