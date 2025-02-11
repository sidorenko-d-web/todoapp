import { FC, useEffect, useState } from 'react';
import { ShopLayout } from '../../layout/ShopLayout/ShopLayout';
import { ItemsTab, NewItemModal, SkinTab } from '../../components';
import { useGetShopItemsQuery } from '../../redux/api/shop/api';
import { IShopItem, TypeItemCategory, TypeItemRarity } from '../../redux';
import { useGetInventoryItemsQuery } from '../../redux/api/inventory/api';
import { itemsInTab } from '../../helpers';
import { useModal } from '../../hooks';
import { MODALS } from '../../constants';
import { useTranslation } from 'react-i18next';
type TypeTab<T> = { title: string; value: T };

const StorePage: FC = () => {
  const { t } = useTranslation('shop');
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

  const {openModal} = useModal()

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
      ) : shopCategory?.title !== t('s6') ? (
        <ItemsTab shopCategory={shopCategory} shopItems={items} />
      ) : (
        <SkinTab mode="shop" />
      )}
      <NewItemModal />

      <button onClick={() => openModal(MODALS.SETTINGS)}>
        Connect Wallet
      </button>
    </ShopLayout>
  );
};

export default StorePage;
