import { type Dispatch, type FC, PropsWithChildren, type SetStateAction, useEffect, useState } from 'react';
import styles from './ShopLayout.module.scss';
import { useGetInventoryItemsQuery } from '../../redux';
import TabsNavigation from '../../components/TabsNavigation/TabsNavigation';
import { AppRoute } from '../../constants';
import ArrowLeftIcon from '../../assets/icons/arrow-left.svg';
import InventoryBox from '../../assets/icons/inventory-box.svg';
import { TypeItemCategory, TypeItemRarity, useGetShopItemsQuery } from '../../redux';
import { useNavigate } from 'react-router-dom';
import CoinIcon from '../../assets/icons/coin.png';
import SubscriberCoin from '../../assets/icons/subscriber_coin.svg';
import ViewsCoin from '../../assets/icons/views.png';
import { itemsInTab } from '../../helpers';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('shop');
  const shopItemCategories = [
    { title: `${t('s2')}`, value: 'text' },
    { title: `${t('s3')}`, value: 'image' },
    { title: `${t('s4')}`, value: 'video' },
    { title: `${t('s5')}`, value: 'decor' },
    { title: `${t('s6')}`, value: 'decor' },
  ];
  const shopItemRarity = [
    { title: `${t('s14')}`, value: 'red' },
    { title: `${t('s15')}`, value: 'yellow' },
    { title: `${t('s16')}юкс`, value: 'green' },
  ];
  const [shopCategory, setShopCategory] = useState(shopItemCategories[0]);
  const [itemsQuality, setItemsQuality] = useState(shopItemRarity[0]);

  const { data: inventory, isSuccess } = useGetInventoryItemsQuery({});
  const { data: shop } = useGetShopItemsQuery({
    level: 1,
    item_category: shopCategory.value as TypeItemCategory,
  });

  useEffect(() => {
    onItemCategoryChange(shopCategory as TypeTab<TypeItemCategory>);
    onItemQualityChange(itemsQuality as TypeTab<TypeItemRarity>);
  }, [shopCategory, itemsQuality]);

  const navigate = useNavigate();

  const itemsInTabs = itemsInTab(shop?.items, inventory?.items);
  const tabs = [];
  itemsInTabs?.red?.length &&
    itemsInTabs?.red?.length > 0 &&
    tabs.push(shopItemRarity[0]);
  itemsInTabs?.yellow?.length &&
    itemsInTabs?.yellow?.length > 0 &&
    tabs.push(shopItemRarity[1]);
  itemsInTabs?.green?.length &&
    itemsInTabs?.green?.length > 0 &&
    tabs.push(shopItemRarity[2]);

  const inventoryTabs = [shopItemRarity[0]];
  isSuccess &&
    inventory?.items.find(
      item => item.item_rarity === 'yellow' && item.item_category === shopCategory.value,
    ) &&
    inventoryTabs.push(shopItemRarity[1]);
  isSuccess &&
    inventory?.items.find(
      item => item.item_rarity === 'green' && item.item_category === shopCategory.value,
    ) &&
    inventoryTabs.push(shopItemRarity[2]);

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
        <button
          className={styles.linkBack}
          onClick={handleShop}
          style={{ opacity: mode === 'inventory' ? 1 : 0 }}
        >
          <img src={ArrowLeftIcon} />
        </button>
        <div className={styles.mainHeader}>
          <h1 className={styles.title}>{mode === 'shop' ? `${t('s1')}` : `${t('s19')}`}</h1>

          <div className={styles.scores}>
            <div className={styles.scoresItem}>
              <p>+{0}</p>
              <img src={ViewsCoin} />
              <p>/{t('s12')}.</p>
            </div>
            <div className={styles.scoresItem}>
              <p>+{0}</p>
              <img src={SubscriberCoin} />
              <p>/{t('s12')}.</p>
            </div>
            <div className={styles.scoresItem}>
              <p>+{0}</p>
              <img src={CoinIcon} />
              <p>/{t('s13')}.</p>
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
        <TabsNavigation
          tabs={shopItemCategories}
          currentTab={shopCategory.title}
          onChange={setShopCategory}
        />
        {/* https://www.figma.com/design/EitKuxyKAwTD4SJen3OO91?node-id=1892-284346&m=dev#1121980464 */}
        {/*{shopCategory.title !== 'Вы' && (*/}
        {/*  <TabsNavigation*/}
        {/*    colorClass={*/}
        {/*      itemsQuality.title === 'Эконом'*/}
        {/*        ? 'tabItemSelectedBlue'*/}
        {/*        : itemsQuality.title === 'Премиум'*/}
        {/*        ? 'tabItemSelectedPurple'*/}
        {/*        : 'tabItemSelectedRed'*/}
        {/*    }*/}
        {/*    tabs={mode === 'shop' ? tabs : inventoryTabs}*/}
        {/*    currentTab={itemsQuality.title}*/}
        {/*    onChange={setItemsQuality}*/}
        {/*  />*/}
        {/*)}*/}
        {shopCategory.title !== `${t('s6')}` && (
          <TabsNavigation
            colorClass={
              itemsQuality.title === `${t('s14')}`
                ? 'tabItemSelectedBlue'
                : itemsQuality.title === `${t('s15')}`
                ? 'tabItemSelectedPurple'
                : 'tabItemSelectedRed'
            }
            tabs={mode === 'shop' ? tabs : inventoryTabs}
            currentTab={itemsQuality.title}
            onChange={setItemsQuality}
          />
        )}
      </div>

      {children}
    </div>
  );
};
