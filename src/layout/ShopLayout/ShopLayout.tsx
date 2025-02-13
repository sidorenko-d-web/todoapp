import {
  type Dispatch,
  type FC,
  PropsWithChildren,
  type SetStateAction,
  useEffect,
  useReducer,
  useState,
} from 'react';
import styles from './ShopLayout.module.scss';
import {
  RootState,
  TypeItemCategory,
  TypeItemRarity,
  useGetCurrentUserBoostQuery,
  useGetInventoryItemsQuery,
  useGetShopItemsQuery,
} from '../../redux';
import TabsNavigation from '../../components/TabsNavigation/TabsNavigation';
import { AppRoute, GUIDE_ITEMS } from '../../constants';
import ArrowLeftIcon from '../../assets/icons/arrow-left.svg';
import InventoryBox from '../../assets/icons/inventory-box.svg';
import { useNavigate } from 'react-router-dom';
import CoinIcon from '../../assets/icons/coin.png';
import SubscriberCoin from '../../assets/icons/subscriber_coin.svg';
import ViewsCoin from '../../assets/icons/views.png';
import { formatAbbreviation, itemsInTab } from '../../helpers';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { isGuideShown, setGuideShown } from '../../utils';
import { setActiveFooterItemId} from '../../redux/slices/guideSlice';
import {
  TrackedButton,
} from '../../components';
import { BackToMainPageGuide, TreeLevelGuide, UpgradeItemsGuide, WelcomeToShopGuide } from '../../components';
import { setActiveFooterItemId, setBuyItemButtonGlowing, setShopStatsGlowing } from '../../redux/slices/guideSlice';

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
    { title: `${t('s16')}`, value: 'green' },
  ];
  const [ shopCategory, setShopCategory ] = useState(shopItemCategories[0]);
  const [ itemsQuality, setItemsQuality ] = useState(shopItemRarity[0]);

  const { data: inventory, isSuccess } = useGetInventoryItemsQuery({});
  const { data: shop } = useGetShopItemsQuery({
    level: 1,
    item_category: shopCategory.value as TypeItemCategory,
  });
  const { data: boost } = useGetCurrentUserBoostQuery()

  useEffect(() => {
    onItemCategoryChange(shopCategory as TypeTab<TypeItemCategory>);
    onItemQualityChange(itemsQuality as TypeTab<TypeItemRarity>);
  }, [ shopCategory, itemsQuality ]);

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

  const inventoryTabs = [];
  isSuccess &&
  inventory?.items.find(
    item => item.item_rarity === 'red' && item.item_category === shopCategory.value,
  ) &&
  inventoryTabs.push(shopItemRarity[0]);
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
  }, [ shopCategory ]);

  const reduxDispatch = useDispatch();

  const initialGuideState = {
    welcomeGuideShown: isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN),
    backToMainGuideShown: isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE),
    upgradeItemsGuideShown: isGuideShown(GUIDE_ITEMS.shopPageSecondVisit.UPGRADE_ITEMS_GUIDE_SHOWN),
    treeLevelGuideShown: isGuideShown(GUIDE_ITEMS.shopPageSecondVisit.TREE_LEVEL_GUIDE_SHOWN),
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

  const [ guideVisibility, dispatch ] = useReducer(guideReducer, initialGuideState);

  const handleGuideClose = (guideId: string) => {
    dispatch({ type: 'SET_GUIDE_SHOWN', payload: guideId });
  };

  useEffect(() => {
    reduxDispatch(setActiveFooterItemId(0));
  }, []);

  const statsGlowing = useSelector((state: RootState) => state.guide.getShopStatsGlowing);

  const isTabsNotEmpty =
    [ ...(itemsInTabs.green ?? []), ...(itemsInTabs.yellow ?? []) ].length > 0;

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <TrackedButton
            trackingData={{
              eventType: 'button',
              eventPlace: 'В магазин - Инвентарь'
            }}
            className={styles.linkBack}
            onClick={handleShop}
            style={{ opacity: mode === 'inventory' ? 1 : 0 }}
          >
            <img src={ArrowLeftIcon} />
          </TrackedButton>
          <div className={styles.mainHeader}>
            <h1
              className={`${styles.title} ${statsGlowing ? styles.elevated : ''}`}>{mode === 'shop' ? `${t('s1')}` : `${t('s19')}`}</h1>
            {boost && (
              <div className={`${styles.scores} ${statsGlowing ? styles.elevated : ''}`}>
                <div
                  className={`${styles.scoresItem} ${statsGlowing ? styles.elevatedBordered : ''} ${statsGlowing ? styles.glowing : ''}`}>
                  <p>+{formatAbbreviation(boost.views)}</p>
                  <img src={ViewsCoin} />
                  <p>/{t('s12')}.</p>
                </div>
                <div
                  className={`${styles.scoresItem} ${statsGlowing ? styles.elevatedBordered : ''} ${statsGlowing ? styles.glowing : ''}`}>
                  <p>+{formatAbbreviation(boost.subscribers)}</p>
                  <img src={SubscriberCoin} />
                  <p>/{t('s12')}.</p>
                </div>
                <div className={styles.scoresItem}>
                  <p>+{formatAbbreviation(boost.income_per_second)}</p>
                  <img src={CoinIcon} />
                  <p>/{t('s13')}.</p>
                </div>
              </div>
            )}

          </div>
          <TrackedButton
            trackingData={{
              eventType: 'button',
              eventPlace: 'В инвентарь - Магазин',
            }}
            className={styles.linkInventory}
            onClick={handleInventory}
            style={{ opacity: mode === 'shop' ? 1 : 0 }}
          >
            <img src={InventoryBox} />
          </TrackedButton>
        </div>

        <div className={styles.navs}>
          <TabsNavigation
            tabs={shopItemCategories}
            currentTab={shopCategory.title}
            onChange={setShopCategory}
          />
          {/* https://www.figma.com/design/EitKuxyKAwTD4SJen3OO91?node-id=1892-284346&m=dev#1121980464  */}
          {shopCategory.title !== t('s6') && isTabsNotEmpty && (
            <TabsNavigation
              colorClass={
                itemsQuality.title === t('s14')
                  ? 'tabItemSelectedBlue'
                  : itemsQuality.title === t('s15')
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

      {!guideVisibility.welcomeGuideShown && mode === 'shop' && (
        <WelcomeToShopGuide onClose={() => {
          reduxDispatch(setShopStatsGlowing(false));
          reduxDispatch(setBuyItemButtonGlowing(true));
          handleGuideClose(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN);
        }} />
      )}

      {(useSelector((state: RootState) => state.guide.itemBought) || isGuideShown(GUIDE_ITEMS.shopPage.ITEM_BOUGHT)) &&
        guideVisibility.welcomeGuideShown &&
        !guideVisibility.backToMainGuideShown &&
        mode === 'inventory' && (
          <BackToMainPageGuide onClose={() => {
            handleGuideClose(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE);
            navigate(AppRoute.Main);
          }} />
        )}

      {(!guideVisibility.upgradeItemsGuideShown
          && isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN) && mode === 'inventory')
        && <UpgradeItemsGuide onClose={() => {
          handleGuideClose(GUIDE_ITEMS.shopPageSecondVisit.UPGRADE_ITEMS_GUIDE_SHOWN);
        }} />}

      {(guideVisibility.upgradeItemsGuideShown
          && !guideVisibility.treeLevelGuideShown && !isGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW) && mode === 'inventory')
        && <TreeLevelGuide onClose={() => {
          setGuideShown(GUIDE_ITEMS.shopPageSecondVisit.UPGRADE_ITEMS_GUIDE_SHOWN);
          handleGuideClose(GUIDE_ITEMS.shopPageSecondVisit.TREE_LEVEL_GUIDE_SHOWN);
          navigate(AppRoute.ProgressTree);
        }} />}

    </>
  );
};