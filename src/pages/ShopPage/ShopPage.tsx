import { FC, useEffect, useState } from 'react';
import { ShopLayout } from '../../layout/ShopLayout/ShopLayout';
import { ItemsTab, Loader, NewItemModal, SkinTab } from '../../components';
import { useGetShopItemsQuery } from '../../redux/api/shop/api';
import { IShopItem, TypeItemCategory, TypeItemRarity, useGetCurrentUserBoostQuery } from '../../redux';
import { useGetInventoryItemsQuery } from '../../redux/api/inventory/api';
import styles from './ShopPage.module.scss';
import { itemsInTab } from '../../helpers';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setActiveFooterItemId } from '../../redux/slices/guideSlice';

type TypeTab<T> = { title: string; value: T };

const StorePage: FC = () => {
  const { t } = useTranslation('shop');
  const [ shopCategory, setShopCategory ] = useState<TypeTab<TypeItemCategory>>();
  const [ itemsRarity, setItemsQuality ] = useState<TypeTab<TypeItemRarity>>();

  const dispatch = useDispatch();

  const { data: shop, isLoading: isShopLoading, isFetching: isShopFetching } = useGetShopItemsQuery({
    item_category: shopCategory?.value as TypeItemCategory,
    level: 1,
    item_rarity: itemsRarity?.value,
    item_premium_level: 'base',
  });

  const { data: inventory, isLoading: isInventoryLoading, isFetching: isInventoryFetching } = useGetInventoryItemsQuery({
    item_category: shopCategory?.value as TypeItemCategory,
  });

  const [ items, setItems ] = useState<IShopItem[]>();

  useEffect(() => {
    dispatch(setActiveFooterItemId(0));
  }, []);

  useEffect(() => {
    setItems(
      itemsInTab(shop?.items, inventory?.items)[itemsRarity?.value as TypeItemRarity],
    );
  }, [ inventory, shop ]);

  const { isLoading: isBoostLoading } = useGetCurrentUserBoostQuery();

  const isLoading = (
    isBoostLoading
  );

  if (isLoading) return <Loader />;

  return (
    <ShopLayout
      mode="shop"
      onItemCategoryChange={setShopCategory}
      onItemQualityChange={setItemsQuality}
    >
      {isShopLoading || isShopFetching || isInventoryLoading || isInventoryFetching ? (
        <Loader className={styles.itemsLoader} />
      ) : !shopCategory || !itemsRarity ? (
        <p style={{ color: '#fff' }}>Error occured while getting data</p>
      ) : shopCategory?.title !== t('s6') ? (
        items?.length === 0 ? (
          <p className={styles.emptyText}>
            {t('s37')}
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
