import { FC, useEffect, useState } from 'react';
import { ShopLayout } from '../../layout/ShopLayout/ShopLayout';
import { ItemsTab, Loader, NewItemModal, SkinTab } from '../../components';
import {
  setActiveFooterItemId,
  TypeItemCategory,
  TypeItemRarity,
  useGetCurrentUserBoostQuery,
  useGetShopItemsQuery,
} from '../../redux';
import styles from './ShopPage.module.scss';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

type TypeTab<T> = { title: string; value: T };

const StorePage: FC = () => {
  const { t } = useTranslation('shop');
  const [shopCategory, setShopCategory] = useState<TypeTab<TypeItemCategory>>();
  const [itemsRarity, setItemsQuality] = useState<TypeTab<TypeItemRarity>>();

  const dispatch = useDispatch();

  const {
    data: shop,
    isLoading: isShopLoading,
    isFetching: isShopFetching,
    isSuccess,
  } = useGetShopItemsQuery({
    item_category: shopCategory?.value as TypeItemCategory,
    level: 1,
    item_premium_level: 'base',
    is_bought: false,
  });

  useEffect(() => {
    dispatch(setActiveFooterItemId(1));
  }, []);

  const { isLoading: isBoostLoading } = useGetCurrentUserBoostQuery();

  if (isBoostLoading) return <Loader />;

  return (
    <ShopLayout mode="shop" onItemCategoryChange={setShopCategory} onItemQualityChange={setItemsQuality}>
      {isShopLoading || isShopFetching ? (
        <Loader className={styles.itemsLoader} />
      ) : !(isShopLoading || isShopFetching) && (!shopCategory || !itemsRarity) ? (
        <p style={{ color: '#282830' }}>{t('s61')}</p>
      ) : shopCategory?.title !== t('s6') ? (
        items?.length === 0 || !isSuccess ? (
          <p className={styles.emptyText}>{t('s37')}</p>
        ) : (
          <ItemsTab shopCategory={shopCategory} shopItems={shop?.items} />
        )
      ) : (
        <SkinTab mode="shop" />
      )}
      <NewItemModal />
    </ShopLayout>
  );
};

export default StorePage;
