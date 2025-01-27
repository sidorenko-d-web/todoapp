import { FC, useState } from 'react';
import styles from './ShopPage.module.scss';
import TabsNavigation from '../../components/TabsNavigation/TabsNavigation';
import { useGetInventoryBoostQuery } from '../../redux/api/inventory/api';
import ShopItemsTab from '../../components/shop/ShopItemsTab/ShopItemsTab';
import ShopSkinTab from '../../components/shop/ShopSkinTab/ShopSkinTab';

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

const StorePage: FC = () => {
  const [shopCategory, setShopCategory] = useState(shopItemCategories[0]);
  const [itemsQuality, setItemsQuality] = useState(shopItemQualities[0]);

  const { data: boosts } = useGetInventoryBoostQuery();

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
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

      {shopCategory.title !== 'Вы' ? (
        <ShopItemsTab shopCategory={shopCategory} itemsQuality={itemsQuality} />
      ) : (
        <ShopSkinTab />
      )}
    </div>
  );
};

export default StorePage;
