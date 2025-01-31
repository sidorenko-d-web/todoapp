import { PropsWithChildren, useEffect, useState, type Dispatch, type FC, type SetStateAction } from 'react';
import styles from './ShopLayout.module.scss';
import { useGetInventoryBoostQuery, useGetInventoryItemsQuery } from '../../redux/api/inventory/api';
import TabsNavigation from '../../components/TabsNavigation/TabsNavigation';
import { AppRoute } from '../../constants';
import ArrowLeftIcon from '../../assets/icons/arrow-left.svg';
import InventoryBox from '../../assets/icons/inventory-box.svg';
import { TypeItemCategory, TypeItemQuality } from '../../redux';
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
const shopItemQualities = [
  { title: 'Эконом', value: 'lowcost' },
  { title: 'Премиум', value: 'prem' },
  { title: 'Люкс', value: 'lux' },
];

type TypeTab<T> = { title: string; value: T };

interface Props {
  onItemCategoryChange: Dispatch<SetStateAction<TypeTab<TypeItemCategory> | undefined>>;
  onItemQualityChange: Dispatch<SetStateAction<TypeTab<TypeItemQuality> | undefined>>;
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
  const [itemsQuality, setItemsQuality] = useState(shopItemQualities[0]);

  const { data: inventory, isSuccess, isFetching } = useGetInventoryItemsQuery({ item_category: shopCategory.value as TypeItemCategory });

  useEffect(() => {
    onItemCategoryChange(shopCategory as TypeTab<TypeItemCategory>);
    onItemQualityChange(itemsQuality as TypeTab<TypeItemQuality>);
  }, [shopCategory, itemsQuality]);

  const navigate = useNavigate();

  const shopQualityTabs =
    isSuccess && !isFetching && inventory && inventory?.items.findIndex(item => item.level === 50) !== -1
      ? inventory?.items.findIndex(item => item.level === 50 && item.name.includes('Prem')) !== -1 ? shopItemQualities : shopItemQualities.slice(0, 2)
      : shopItemQualities.slice(0, 1);
  console.log(inventory?.items);

  const inventoryQualityTabs = isSuccess ? (inventory?.items.find(item => item.name.includes('Pro')) ? shopItemQualities :
    inventory?.items.find(item => item.name.includes('Prem')) ? shopItemQualities.slice(0, 2) : shopItemQualities.slice(0, 1)) : shopItemQualities.slice(0, 1)

    const handleShop = () => {
      setItemsQuality(shopItemQualities[0])
      navigate(AppRoute.Shop)
    }
    const handleInventory = () => {
      setItemsQuality(shopItemQualities[0])
      
      navigate(AppRoute.ShopInventory)
    }


useEffect(() => {
  setItemsQuality(shopItemQualities[0])
}, [shopCategory])

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <button
          className={styles.linkBack}
          onClick={handleShop}
          style={{ opacity: mode === 'inventory' ? 1 : 0 }}
        >
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
        <button
          className={styles.linkInventory}
          onClick={handleInventory}
          style={{ opacity: mode === 'shop' ? 1 : 0 }}
        >
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
            tabs={mode === 'inventory' ? inventoryQualityTabs : shopQualityTabs}
            currentTab={itemsQuality.title}
            onChange={setItemsQuality}
          />
        )}
      </div>

      {children}
    </div>
  );
};

