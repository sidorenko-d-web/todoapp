import { type Dispatch, type FC, PropsWithChildren, type SetStateAction, useEffect, useState } from 'react';
import styles from './ShopLayout.module.scss';
import { useGetInventoryBoostQuery, useGetInventoryItemsQuery } from '../../redux/api/inventory/api';
import TabsNavigation from '../../components/TabsNavigation/TabsNavigation';
import { AppRoute } from '../../constants';
import ArrowLeftIcon from '../../assets/icons/arrow-left.svg';
import InventoryBox from '../../assets/icons/inventory-box.svg';
import { TypeItemCategory, TypeItemRarity } from '../../redux';
import { useNavigate } from 'react-router-dom';
import CoinIcon from '../../assets/icons/coin.svg';
import SubscriberCoin from '../../assets/icons/subscriber_coin.svg';
import ViewsCoin from '../../assets/icons/views.svg';
const shopItemCategories = [
  { title: 'Текст', value: 'text' },
  { title: 'Фото', value: 'image' },
  { title: 'Видео', value: 'video' },
  { title: 'Декор', value: 'decor' },
  { title: 'Вы', value: 'decor' },
];
const shopItemRarity = [
  { title: 'Эконом', value: 'red' },
  { title: 'Премиум', value: 'yellow' },
  { title: 'Люкс', value: 'green' },
];

type TypeTab<T> = { title: string; value: T };

interface Props {
  onItemCategoryChange: Dispatch<SetStateAction<TypeTab<TypeItemCategory> | undefined>>;
  onItemQualityChange: Dispatch<SetStateAction<TypeTab<TypeItemRarity> | undefined>>;
  mode: 'shop' | 'inventory';
}

export const ShopLayout: FC<PropsWithChildren<Props>> = ({
  children,
  onItemCategoryChange,
  onItemQualityChange,
  mode,
}) => {
  const { data: boosts } = useGetInventoryBoostQuery();

  const [shopCategory, setShopCategory] = useState(shopItemCategories[0]);
  const [itemsQuality, setItemsQuality] = useState(shopItemRarity[0]);

  const {
    data: inventory,
    isSuccess,
    isFetching,
  } = useGetInventoryItemsQuery({ item_category: shopCategory.value as TypeItemCategory });

  useEffect(() => {
    onItemCategoryChange(shopCategory as TypeTab<TypeItemCategory>);
    onItemQualityChange(itemsQuality as TypeTab<TypeItemRarity>);
  }, [shopCategory, itemsQuality]);

  const navigate = useNavigate();

  const shopQualityTabs =
    isSuccess && !isFetching && inventory && inventory?.items.findIndex(item => item.level === 50) !== -1
      ? inventory?.items.findIndex(item => item.level === 50 && item.name.includes('Prem')) !== -1
        ? shopItemRarity
        : shopItemRarity.slice(0, 2)
      : shopItemRarity.slice(0, 1);

  const inventoryQualityTabs = isSuccess
    ? inventory?.items.find(item => item.name.includes('Pro'))
      ? shopItemRarity
      : inventory?.items.find(item => item.name.includes('Prem'))
      ? shopItemRarity.slice(0, 2)
      : shopItemRarity.slice(0, 1)
    : shopItemRarity.slice(0, 1);

  const handleShop = () => {
    setItemsQuality(shopItemRarity[0]);
    navigate(AppRoute.Shop);
  };
  const handleInventory = () => {
    setItemsQuality(shopItemRarity[0]);

    navigate(AppRoute.ShopInventory);
  };

  useEffect(() => {
    setItemsQuality(shopItemRarity[0]);
  }, [shopCategory]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <button className={styles.linkBack} onClick={handleShop} style={{ opacity: mode === 'inventory' ? 1 : 0 }}>
          <img src={ArrowLeftIcon} />
        </button>
        <div className={styles.mainHeader}>
          <h1 className={styles.title}>{mode === 'shop' ? 'Магазин' : 'Инвентарь '}</h1>

          <div className={styles.scores}>
            <div className={styles.scoresItem}>
              <p>+{boosts?.views ?? 0}</p>
              <img src={ViewsCoin} />
              <p>/инт.</p>
            </div>
            <div className={styles.scoresItem}>
              <p>+{boosts?.subscribers ?? 0}</p>
              <img src={SubscriberCoin} />
              <p>/инт.</p>
            </div>
            <div className={styles.scoresItem}>
              <p>+{boosts?.income_per_second ?? 0}</p>
              <img src={CoinIcon} />
              <p>/сек.</p>
            </div>
          </div>
        </div>
        <button className={styles.linkInventory} onClick={handleInventory} style={{ opacity: mode === 'shop' ? 1 : 0 }}>
          <img src={InventoryBox} />
        </button>
      </div>

      <div className={styles.navs}>
        <TabsNavigation tabs={shopItemCategories} currentTab={shopCategory.title} onChange={setShopCategory} />
        {shopCategory.title !== 'Вы' && (
          <TabsNavigation
            colorClass={
              itemsQuality.title === 'Эконом'
                ? 'tabItemSelectedBlue'
                : itemsQuality.title === 'Премиум'
                ? 'tabItemSelectedPurple'
                : 'tabItemSelectedRed'
            }
            tabs={mode === 'inventory' ? inventoryQualityTabs : shopItemRarity}
            currentTab={itemsQuality.title}
            onChange={setItemsQuality}
          />
        )}
      </div>

      {children}
    </div>
  );
};
