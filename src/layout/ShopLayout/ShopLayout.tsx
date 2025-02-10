import { type Dispatch, type FC, PropsWithChildren, type SetStateAction, useEffect, useReducer, useState } from 'react';
import styles from './ShopLayout.module.scss';
import { useGetInventoryItemsQuery } from '../../redux/api/inventory/api';
import TabsNavigation from '../../components/TabsNavigation/TabsNavigation';
import { AppRoute, GUIDE_ITEMS } from '../../constants';
import ArrowLeftIcon from '../../assets/icons/arrow-left.svg';
import InventoryBox from '../../assets/icons/inventory-box.svg';
import { RootState, TypeItemCategory, TypeItemRarity, useGetShopItemsQuery } from '../../redux';
import { useNavigate } from 'react-router-dom';
import CoinIcon from '../../assets/icons/coin.png';
import SubscriberCoin from '../../assets/icons/subscriber_coin.svg';
import ViewsCoin from '../../assets/icons/views.png';
import { formatAbbreviation, itemsInTab } from '../../helpers';
import { useDispatch, useSelector } from 'react-redux';
import { isGuideShown, setGuideShown } from '../../utils';
import { BackToMainPageGuide, WelcomeToShopGuide } from '../../components';
import { setBuyItemButtonGlowing, setShopStatsGlowing } from '../../redux/slices/guideSlice';
import { UpgradeItemsGuide } from '../../components/guide/ShopPageSecondVisitGuides/UpgradeItemsGuide/UpgradeItemsGuide';
import { TreeLevelGuide } from '../../components/guide/ShopPageSecondVisitGuides/TreeLevelGuide/TreeLevelGuide';

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

  const reduxDispatch = useDispatch();

  const initialGuideState = {
    welcomeGuideShown: isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN),
    backToMainGuideShown: isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE),
    upgradeItemsGuideShown: isGuideShown(GUIDE_ITEMS.shopPageSecondVisit.UPGRADE_ITEMS_GUIDE_SHOWN),
    treeLevelGuideShown: isGuideShown(GUIDE_ITEMS.shopPageSecondVisit.TREE_LEVEL_GUIDE_SHOWN)
  };

  function guideReducer(state: any, action: { type: any; payload: string; }) {
    switch (action.type) {
      case 'SET_GUIDE_SHOWN':
        setGuideShown(action.payload);
        return { ...state, [action.payload]: true };
      default:
        return state;
    }
  }

  const [guideVisibility, dispatch] = useReducer(guideReducer, initialGuideState);

  const handleGuideClose = (guideId: string) => {
    dispatch({ type: 'SET_GUIDE_SHOWN', payload: guideId });
  };


  const statsGlowing = useSelector((state: RootState) => state.guide.getShopStatsGlowing);

  return (
    <>
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
            <h1 className={`${styles.title} ${statsGlowing ? styles.elevated : ''}`}>{mode === 'shop' ? 'Магазин' : 'Инвентарь '}</h1>

            <div className={`${styles.scores} ${statsGlowing ? styles.elevated : ''}`}>
              <div className={`${styles.scoresItem} ${statsGlowing ? styles.elevatedBordered : ''} ${statsGlowing ? styles.glowing : ''}`}>
                <p>+{formatAbbreviation(0)}</p>
                <img src={ViewsCoin} />
                <p>/инт.</p>
              </div>
              <div className={`${styles.scoresItem} ${statsGlowing ? styles.elevatedBordered : ''} ${statsGlowing ? styles.glowing : ''}`}>
                <p>+{formatAbbreviation(0)}</p>
                <img src={SubscriberCoin} />
                <p>/инт.</p>
              </div>
              <div className={styles.scoresItem}>
                <p>+{formatAbbreviation(0)}</p>
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
        </div>

        {children}
      </div>

      {!guideVisibility.welcomeGuideShown && mode === 'shop' && (
        <WelcomeToShopGuide onClose={() => {
          reduxDispatch(setShopStatsGlowing(false));
          reduxDispatch(setBuyItemButtonGlowing(true));
          handleGuideClose(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN)
        }} />
      )}

      {useSelector((state: RootState) => state.guide.itemBought) &&
        guideVisibility.welcomeGuideShown &&
        !guideVisibility.backToMainGuideShown &&
        mode === 'inventory' && (
          <BackToMainPageGuide onClose={() => {
            handleGuideClose(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE);
            navigate(AppRoute.Main);
          }} />
        )}

      {(!guideVisibility.upgradeItemsGuideShown
        && isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN))
        && <UpgradeItemsGuide onClose={() => {
          handleGuideClose(GUIDE_ITEMS.shopPageSecondVisit.UPGRADE_ITEMS_GUIDE_SHOWN);
        }} />}

      {(guideVisibility.upgradeItemsGuideShown
        && !guideVisibility.treeLevelGuideShown)
        && <TreeLevelGuide onClose={() => {
          handleGuideClose(GUIDE_ITEMS.shopPageSecondVisit.TREE_LEVEL_GUIDE_SHOWN);
          navigate(AppRoute.ProgressTree);
        }} />}


    </>
  );
};