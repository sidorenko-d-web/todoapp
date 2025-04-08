import { type FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import styles from './ShopLayout.module.scss';
import {
  RootState,
  setLastOpenedRarity,
  setLastOpenedTab,
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
import {
  BackToMainPageGuide,
  TrackedButton,
  TreeLevelGuide,
  UpgradeItemsGuide,
  WelcomeToShopGuide,
} from '../../components';
import { setActiveFooterItemId, setBuyItemButtonGlowing, setShopStatsGlowing } from '../../redux/slices/guideSlice';

type TypeTab<T> = { title: string; value: T };

interface Props {
  onItemCategoryChange: (category: TypeTab<TypeItemCategory>) => void;
  onItemQualityChange: (category: TypeTab<TypeItemRarity>) => void;
  mode: 'shop' | 'inventory';
}

export const ShopLayout: FC<PropsWithChildren<Props>> = ({
                                                           children,
                                                           onItemCategoryChange,
                                                           onItemQualityChange,
                                                           mode,
                                                         }) => {
  const lastOpenedTab = useSelector((state: RootState) => state.shop.lastOpenedTab);
  const lastOpenedRarity = useSelector((state: RootState) => state.shop.lastOpenedRarity);
  const dispatch = useDispatch();

  const { t } = useTranslation('shop');
  const shopItemCategories = [
    { title: `${t('s2')}`, value: 'text' },
    { title: `${t('s3')}`, value: 'image' },
    { title: `${t('s4')}`, value: 'video' },
    { title: `${t('s5')}`, value: 'decor' },
    { title: `${t('s6')}`, value: 'you' },
  ];
  const shopItemRarity = [
    { title: `${t('s14')}`, value: 'red' },
    { title: `${t('s15')}`, value: 'yellow' },
    { title: `${t('s16')}`, value: 'green' },
  ];
  const [ shopCategory, setShopCategory ] = useState(lastOpenedTab || shopItemCategories[0]);
  const [ itemsQuality, setItemsQuality ] = useState(lastOpenedRarity || shopItemRarity[0]);

  const setRerender = useState(0)[1];

  const { data: inventory, isSuccess } = useGetInventoryItemsQuery({});
  const { data: shop } = useGetShopItemsQuery({
    level: 1,
    item_category: shopCategory?.value as TypeItemCategory,
    is_bought: mode === 'inventory',
  });
  const { data: boost } = useGetCurrentUserBoostQuery();

  const [ dimSet, setDimSet ] = useState(false);

  const [ showWelcomeGuide, setShowWelcomeGuide ] = useState(false);
  const [ showBackToMainGuide, setShowBackToMainGuide ] = useState(false);

  useEffect(() => {
    onItemCategoryChange(shopCategory as TypeTab<TypeItemCategory>);
    dispatch(setLastOpenedTab(shopCategory));

    onItemQualityChange(itemsQuality as TypeTab<TypeItemRarity>);
    dispatch(setLastOpenedRarity(itemsQuality));
  }, [ shopCategory.value, itemsQuality.value ]);

  const navigate = useNavigate();

  const itemsInTabs = useMemo(() => {
    return shop?.items && inventory?.items && itemsInTab(shop?.items);
  }, [ shop?.count, inventory?.count ]);

  const tabs = useMemo(() => {
    const _tabs = [];
    itemsInTabs?.red?.length && itemsInTabs?.red?.length > 0 && _tabs.push(shopItemRarity[0]);
    itemsInTabs?.yellow?.length && itemsInTabs?.yellow?.length > 0 && _tabs.push(shopItemRarity[1]);
    itemsInTabs?.green?.length && itemsInTabs?.green?.length > 0 && _tabs.push(shopItemRarity[2]);

    return _tabs;
  }, [ itemsInTabs?.green?.length, itemsInTabs?.red?.length, itemsInTabs?.yellow?.length, shopItemRarity ]);

  const inventoryTabs = useMemo(() => {
    const _inventoryTabs = [];
    isSuccess &&
    inventory?.items.find(item => item.item_rarity === 'red' && item.item_category === shopCategory.value) &&
    _inventoryTabs.push(shopItemRarity[0]);
    isSuccess &&
    inventory?.items.find(item => item.item_rarity === 'yellow' && item.item_category === shopCategory.value) &&
    _inventoryTabs.push(shopItemRarity[1]);
    isSuccess &&
    inventory?.items.find(item => item.item_rarity === 'green' && item.item_category === shopCategory.value) &&
    _inventoryTabs.push(shopItemRarity[2]);

    return _inventoryTabs;
  }, [ inventory?.items, isSuccess, shopCategory.value, shopItemRarity ]);

  const handleShop = () => {
    setItemsQuality(lastOpenedRarity || shopItemRarity[0]);
    if (isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE)) {
      navigate(AppRoute.Shop);
    }
  };

  const handleInventory = () => {
    setItemsQuality(lastOpenedRarity || shopItemRarity[0]);
    navigate(AppRoute.ShopInventory);
  };

  useEffect(() => {
    setItemsQuality(shopItemRarity[0]);
  }, [ shopCategory.value ]);

  const reduxDispatch = useDispatch();

  useEffect(() => {
    reduxDispatch(setActiveFooterItemId(1));
  }, [ reduxDispatch ]);

  const statsGlowing = useSelector((state: RootState) => state.guide.getShopStatsGlowing);

  const isTabsNotEmpty = useMemo(() => (
    [ ...(itemsInTabs?.green ?? []), ...(itemsInTabs?.yellow ?? []) ].length > 0
  ), [ itemsInTabs?.green, itemsInTabs?.yellow ]);
  console.info([ ...(itemsInTabs?.green ?? []), ...(itemsInTabs?.yellow ?? []) ]);

  useEffect(() => {
    if (!dimSet) {
      setDimSet(true);
    }
    const timer = setTimeout(() => {
      setShowWelcomeGuide(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mode === 'inventory') {
      dispatch(setActiveFooterItemId(1));
      const timer = setTimeout(() => {
        setShowBackToMainGuide(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setShowBackToMainGuide(false);
    }
  }, [ mode ]);

  console.info(shopCategory.title !== t('s6') && isTabsNotEmpty);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <TrackedButton
            trackingData={{
              eventType: 'button',
              eventPlace: 'В магазин - Инвентарь',
            }}
            className={styles.linkBack}
            onClick={handleShop}
            style={{ opacity: mode === 'inventory' ? 1 : 0 }}
          >
            <img src={ArrowLeftIcon} />
          </TrackedButton>
          <div className={styles.mainHeader}>
            <h1 className={`${styles.title} ${statsGlowing ? styles.elevated : ''}`}>
              {mode === 'shop' ? `${t('s1')}` : `${t('s19')}`}
            </h1>
            {boost && (
              <div className={`${styles.scores} ${statsGlowing ? styles.elevated : ''}`}>
                <div
                  className={`${styles.scoresItem} ${statsGlowing ? styles.elevatedBordered : ''} ${
                    statsGlowing ? styles.glowing : ''
                  }`}
                >
                  <p>+{formatAbbreviation(boost.views)}</p>
                  <img src={ViewsCoin} />
                  <p>/{t('s12')}.</p>
                </div>
                <div
                  className={`${styles.scoresItem} ${statsGlowing ? styles.elevatedBordered : ''} ${
                    statsGlowing ? styles.glowing : ''
                  }`}
                >
                  <p>+{formatAbbreviation(boost.subscribers)}</p>
                  <img src={SubscriberCoin} />
                  <p>/{t('s12')}.</p>
                </div>
                <div
                  className={`${styles.scoresItem} ${statsGlowing ? styles.elevatedBordered : ''} ${
                    statsGlowing ? styles.glowing : ''
                  }`}
                >
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
          <TabsNavigation tabs={shopItemCategories} currentTab={shopCategory.title} onChange={setShopCategory} />
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

      {!isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN) && mode === 'shop' && showWelcomeGuide && (
        <WelcomeToShopGuide
          onClose={() => {
            reduxDispatch(setShopStatsGlowing(false));
            reduxDispatch(setBuyItemButtonGlowing(true));
            setGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN);
            setRerender(prev => prev + 1);
          }}
        />
      )}

      {isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN) &&
        !isGuideShown(GUIDE_ITEMS.shopPage.ITEM_BOUGHT) && (
          <div
            style={{
              position: 'fixed',
              width: '100%',
              height: '120vh',
              top: '0',
              left: '0',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              pointerEvents: 'none',
              zIndex: '1500',
            }}
          />
        )}

      {(useSelector((state: RootState) => state.guide.itemBought) || isGuideShown(GUIDE_ITEMS.shopPage.ITEM_BOUGHT)) &&
        isGuideShown(GUIDE_ITEMS.shopPage.ITEM_BOUGHT) &&
        !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) &&
        mode === 'inventory' &&
        showBackToMainGuide && (
          <BackToMainPageGuide
            onClose={() => {
              setGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE);
              navigate(AppRoute.Main);
              setRerender(prev => prev + 1);
            }}
          />
        )}

      {isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN) &&
        isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN) &&
        !isGuideShown(GUIDE_ITEMS.shopPageSecondVisit.UPGRADE_ITEMS_GUIDE_SHOWN) &&
        mode === 'shop' &&
        showWelcomeGuide && (
          <UpgradeItemsGuide
            onClose={() => {
              setGuideShown(GUIDE_ITEMS.shopPageSecondVisit.UPGRADE_ITEMS_GUIDE_SHOWN);
              setGuideShown(GUIDE_ITEMS.shopPageSecondVisit.UPGRADE_ITEMS_GUIDE_SHOWN);
              //dispatch(setDimHeader(false));
              setRerender(prev => prev + 1);
              navigate(AppRoute.ShopInventory);
            }}
          />
        )}

      {isGuideShown(GUIDE_ITEMS.shopPageSecondVisit.UPGRADE_ITEMS_GUIDE_SHOWN) &&
        !isGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW) &&
        mode === 'inventory' && !isGuideShown(GUIDE_ITEMS.shopPageSecondVisit.ITEM_UPGRADED) && showBackToMainGuide && inventory && (
          <TreeLevelGuide
            item={inventory?.items[0]!}
            onClose={() => {
              setGuideShown(GUIDE_ITEMS.shopPageSecondVisit.UPGRADE_ITEMS_GUIDE_SHOWN);
              setGuideShown(GUIDE_ITEMS.shopPageSecondVisit.TREE_LEVEL_GUIDE_SHOWN);
              setRerender(prev => prev + 1);
              //navigate(AppRoute.ProgressTree);
            }}
          />
        )}
    </>
  );
};
