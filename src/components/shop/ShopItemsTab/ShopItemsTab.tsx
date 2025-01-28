import { FC } from 'react';
import { useGetInventoryItemsQuery } from '../../../redux/api/inventory/api';
import { useGetShopItemsQuery } from '../../../redux/api/shop/api';
import { TypeItemCategory } from '../../../types/shop/ShopApiTypes';
import ShopItemCard from '../ShopItemCard/ShopItemCard';
import styles from './ShopItemsTab.module.scss';

interface props {
  itemsQuality: {
    title: string;
    value: string;
  };
  shopCategory: {
    title: string;
    value: string;
  };
}

type TypeQuality = 'lowcost' | 'prem' | 'lux';

const ShopItemsTab: FC<props> = ({ shopCategory, itemsQuality }) => {
  const {
    data: inventory,
    isSuccess: isInventorySuccess,
    isFetching: isInventoryFetching,
    refetch: refetchInventory,
  } = useGetInventoryItemsQuery({
    item_category: shopCategory.value as TypeItemCategory,
  });
  const {
    data: shop,
    isSuccess: isShopSuccess,
    isFetching: isShopFetching,
    refetch: refetchShop,
  } = useGetShopItemsQuery({
    item_category: shopCategory.value as TypeItemCategory,
  });

  const inventoryItems = inventory?.items.filter(item => {
    if (itemsQuality.value === 'lux') {
      return item.name.includes('Pro');
    } else if (itemsQuality.value === 'prem') {
      return item.name.includes('Prem');
    } else {
      return !item.name.includes('Prem') && !item.name.includes('Pro');
    }
  });

  const shopItems = shop?.items
    .filter(item => {
      if (itemsQuality.value === 'lux') {
        return item.name.includes('Pro');
      } else if (itemsQuality.value === 'prem') {
        return item.name.includes('Prem');
      } else {
        return !item.name.includes('Prem') && !item.name.includes('Pro');
      }
    })
    .filter(item => inventoryItems?.findIndex(_item => _item.id === item.id) === -1);

  const refetchAll = () => {
    refetchInventory()
    refetchShop()
  };

  if (isInventoryFetching || isShopFetching) {
    return <p style={{ color: 'white' }}>Загрузка</p>;
  }

  return (
    <div className={styles.cardsWrapper}>
      {isInventorySuccess &&
        inventoryItems?.map(item => (
          <ShopItemCard key={item.id} variant={itemsQuality.value as TypeQuality} item={item} isB refetchAll={refetchAll}/>
        ))}
      {isShopSuccess &&
        shopItems?.map(item => <ShopItemCard key={item.id} variant={itemsQuality.value as TypeQuality} item={item}  refetchAll={refetchAll}/>)}
    </div>
  );
};

export default ShopItemsTab;
