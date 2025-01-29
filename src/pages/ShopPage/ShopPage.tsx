import { FC, useState } from 'react';
import { ShopLayout } from '../../layout/ShopLayout/ShopLayout';
import { ItemsTab, SkinTab } from '../../components';
import { useGetShopItemsQuery } from '../../redux/api/shop/api';
import { TypeItemCategory, TypeItemQuality } from '../../redux';

type TypeTab<T> = { title: string; value: T };

const StorePage: FC = () => {
  const [shopCategory, setShopCategory] = useState<TypeTab<TypeItemCategory>>();
  const [itemsQuality, setItemsQuality] = useState<TypeTab<TypeItemQuality>>();

  const {
    data: shop,
    isFetching: isShopFetching,
    refetch: refetchShop,
  } = useGetShopItemsQuery({
    item_category: shopCategory?.value as TypeItemCategory,
  });

  return (
    <ShopLayout mode="shop" onItemCategoryChange={setShopCategory} onItemQualityChange={setItemsQuality}>
      {isShopFetching ? (
        <p style={{ color: '#fff' }}>Loading...</p>
      ) : !shopCategory || !itemsQuality ? (
        <p style={{ color: '#fff' }}>Error occured while getting data</p>
      ) : shopCategory?.title !== 'Вы' ? (
        <ItemsTab
          shopCategory={shopCategory}
          itemsQuality={itemsQuality}
          shopItems={shop?.items}
          refetchFn={refetchShop}
        />
      ) : (
        <SkinTab />
      )}
    </ShopLayout>
  );
};

export default StorePage;
