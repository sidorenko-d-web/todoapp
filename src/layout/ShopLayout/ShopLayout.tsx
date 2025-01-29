import { PropsWithChildren, useEffect, useState, type Dispatch, type FC, type SetStateAction } from 'react';
import styles from './ShopLayout.module.scss';
import { useGetInventoryBoostQuery } from '../../redux/api/inventory/api';
import TabsNavigation from '../../components/TabsNavigation/TabsNavigation';
import { AppRoute } from '../../constants';
import ArrowLeftIcon from '../../assets/icons/arrow-left.svg';
import InventoryBox from '../../assets/icons/inventory-box.svg';
import { TypeItemCategory, TypeItemQuality } from '../../redux';
import { useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    onItemCategoryChange(shopCategory as TypeTab<TypeItemCategory>);
    onItemQualityChange(itemsQuality as TypeTab<TypeItemQuality>);
  }, [shopCategory, itemsQuality]);

  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <button
          className={styles.linkBack}
          onClick={() => navigate(AppRoute.Shop)}
          style={{ opacity: mode === 'inventory' ? 1 : 0 }}
        >
          <img src={ArrowLeftIcon} />
        </button>
        <div className={styles.mainHeader}>
          <h1 className={styles.title}>Магазин</h1>

          <div className={styles.scores}>
            <div className={styles.scoresItem}>
              <p>+{boosts?.income_per_integration ?? 0}</p>
              <img src="/img/subscriber_coin.svg" />
              <p>/инт.</p>
            </div>
            <div className={styles.scoresItem}>
              <p>+{boosts?.income_per_second ?? 0}</p>
              <img src="/img/coin.svg" />
              <p>/сек.</p>
            </div>
          </div>
        </div>
        <button
          className={styles.linkInventory}
          onClick={() => navigate(AppRoute.ShopInventory)}
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
            tabs={shopItemQualities}
            currentTab={itemsQuality.title}
            onChange={setItemsQuality}
          />
        )}
      </div>

      {children}
    </div>
  );
};
