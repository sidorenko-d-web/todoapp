import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './InventoryCard.module.scss';
import clsx from 'clsx';
import LockIconSvg from '@icons/lock_icon.svg';
import CointsGrey from '@icons/cointsGrey.svg';
import ListDisableIcon from '@icons/list-disable.svg';
import GiftIcon from '../../../assets/icons/gift.svg';
import {
  IShopItem,
  selectVolume,
  TypeItemQuality,
  useAddItemToRoomMutation,
  useGetEquipedQuery,
  useGetProfileMeQuery,
  useGetShopItemsQuery,
  useRemoveItemFromRoomMutation,
  useUpgradeItemMutation,
} from '../../../redux';
import CoinIcon from '../../../assets/icons/coin.png';
import SubscriberCoin from '../../../assets/icons/subscribers.png';
import LockIcon from '../../../assets/icons/lock_icon.svg';
import ViewsIcon from '../../../assets/icons/views.png';
import { GUIDE_ITEMS, itemStoreString, localStorageConsts, MODALS, SOUNDS } from '../../../constants';
import { useModal, useTonConnect } from '../../../hooks';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import useSound from 'use-sound';
import { useSelector } from 'react-redux';
import { Button } from '../../shared';
import GetGift from '../../../pages/DevModals/GetGift/GetGift';
import { useRoomItemsSlots } from '../../../../translate/items/items.ts';
import { isGuideShown } from '../../../utils';
import classNames from 'classnames';

interface Props {
  disabled?: boolean;
  isUpgradeEnabled?: boolean;
  isBlocked?: boolean;
  isB?: boolean;
  item: IShopItem;
}

const getPremiumLevelOrder = (level: TypeItemQuality) =>
  ({ base: 0, advanced: 1, pro: 2 }[level]);

function sortByPremiumLevel(items: IShopItem[]) {
  return [...items].sort(
    (a, b) => getPremiumLevelOrder(a.item_premium_level) - getPremiumLevelOrder(b.item_premium_level)
  );
}

export const InventoryCard: FC<Props> = ({ disabled, isBlocked, isUpgradeEnabled = true, item, isB }) => {
  const RoomItemsSlots = useRoomItemsSlots();
  const { walletAddress, connectWallet } = useTonConnect();
  const { t, i18n } = useTranslation('shop');
  const { data: profile, refetch } = useGetProfileMeQuery();
  const { data: shopItemsData, isLoading: isItemsLoading } = useGetShopItemsQuery({
    level: item.level === 50 ? 50 : item.level + 1,
    name: item.name,
    item_rarity: item.item_rarity,
  });
  const { data: itemsForImages } = useGetShopItemsQuery({
    name: item.name,
    level: 1,
    item_rarity: item.item_rarity,
  });
  const { openModal } = useModal();
  const { data: equipedItems, refetch: refetchEquipped } = useGetEquipedQuery();
  const [ upgradeItem, { isLoading } ] = useUpgradeItemMutation();
  const [ equipItem ] = useAddItemToRoomMutation();
  const [ removeItem ] = useRemoveItemFromRoomMutation();
  const [ playLvlSound ] = useSound(SOUNDS.levelUp, { volume: useSelector(selectVolume) });
  const [ showEquipButton, setShowEquipButton ] = useState(false);
  const [ isUpdateLoading, setIsUpdateLoading ] = useState(false);

  const itemLevel = useMemo(() => {
    if (item.item_premium_level === 'advanced') return item.level + 50;
    if (item.item_premium_level === 'pro') return item.level + 100;
    return item.level;
  }, [item.item_premium_level, item.level]);

  const computedPrice = useMemo(() => {
    if (shopItemsData) {
      const desiredItem = shopItemsData.items.find(i => i.item_premium_level === item.item_premium_level);
      return '' + (desiredItem?.price_internal || '');
    }
    return '';
  }, [shopItemsData, item.item_premium_level]);

  const isAffordable = profile && +profile.points >= +item.price_internal;

  const slot = useMemo(() => {
    return Object.values(RoomItemsSlots).find(_item =>
      _item.name.some((n: string) => item.name.includes(n))
    )?.slot;
  }, [RoomItemsSlots, item.name]);

  const isEquipped = useMemo(() => {
    return equipedItems?.equipped_items.some(_item => _item.id === item.id);
  }, [equipedItems, item.id]);

  const locale = useMemo(() => (['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru'), [i18n.language]);

  const isActionDisabled = itemLevel === 50 || isLoading || isItemsLoading || isUpdateLoading;

  const levelCap = useMemo(() => {
    if (itemLevel < 10) return 10;
    if (itemLevel > 150) return 150;
    if (itemLevel % 10 === 0) return itemLevel === 50 || itemLevel === 100 || itemLevel === 150 ? itemLevel : itemLevel + 10;
    return Math.ceil(itemLevel / 10) * 10;
  }, [itemLevel]);

  const prevLvl = useRef<number | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevLvl.current = itemLevel;
      return;
    }
    const lastTriggeredLevel = Number(localStorage.getItem('lastTriggeredLevel')) || 0;
    const lvlGiftFromStorage = localStorage.getItem('lvlGift');
    if (prevLvl.current === null) {
      prevLvl.current = itemLevel;
      return;
    }
    if (
      (itemLevel === 50 || itemLevel === 100 || itemLevel === 150) &&
      itemLevel !== lastTriggeredLevel &&
      itemLevel !== prevLvl.current
    ) {
      openModal(MODALS.TASK_CHEST);
      localStorage.setItem('lastTriggeredLevel', String(itemLevel));
    } else if (lvlGiftFromStorage && lvlGiftFromStorage.includes(String(itemLevel))) {
      openModal(MODALS.GET_GIFT);
      localStorage.setItem('lastTriggeredLevel', String(itemLevel));
    }
    prevLvl.current = itemLevel;
  }, [itemLevel, openModal]);

  const handleBuyItem = useCallback(async () => {
    if (profile && +profile.points < +computedPrice) return;
    try {
      setIsUpdateLoading(true);
      const res = await upgradeItem({ payment_method: 'internal_wallet', id: item.id });
      localStorage.setItem('giftName', res.data?.chest.chest_name || '');
      if (!res.error) {
        playLvlSound();
        refetch();
        refetchEquipped();
        if (item.item_premium_level === 'pro') {
          openModal(MODALS.UPGRADED_SHOP, { item, isYellow: item.item_rarity === 'red' });
        } else {
          if (res.data.level % 10 === 0) {
            localStorage.setItem(localStorageConsts.IS_NEED_TO_OPEN_CHEST, 'true');
            localStorage.setItem(localStorageConsts.CHEST_TO_OPEN_ID, res.data.id);
          }
          openModal(MODALS.UPGRADED_ITEM, { item: res.data, mode: 'item', reward: 'reward of item' });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      await refetchEquipped();
      setIsUpdateLoading(false);
    }
  }, [profile, computedPrice, upgradeItem, item, playLvlSound, refetch, refetchEquipped, openModal]);

  const handleEquipItem = useCallback(async () => {
    if (slot === undefined) throw new Error('error while getting slot for item');
    const equippedSlotItem = equipedItems?.equipped_items.find(i => i.slot === slot);
    try {
      if (equippedSlotItem) await removeItem({ items_to_remove: [{ id: equippedSlotItem.id }] });
      await equipItem({ equipped_items: [{ id: item.id, slot }] });
    } catch (error) {
      console.error(error);
    }
  }, [slot, equipedItems, removeItem, equipItem, item.id]);

  useEffect(() => {
    if (item.name_eng.toLowerCase().trim() === 'typewriter' && !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE)) {
      void handleEquipItem();
    }
  }, [item.name_eng, handleEquipItem]);

  const handleUsdtPayment = useCallback(async () => {
    if (!walletAddress) {
      connectWallet();
      return;
    }
    openModal(MODALS.NEW_ITEM, { item, mode: 'item' });
  }, [walletAddress, connectWallet, openModal, item]);

  useEffect(() => {
    if (!isUpdateLoading && !isEquipped) {
      const timeout = setTimeout(() => setShowEquipButton(true), 1500);
      return () => clearTimeout(timeout);
    }
    setShowEquipButton(false);
  }, [isUpdateLoading, isEquipped]);

  return (
    <div className={`${styles.storeCard} ${!isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) ? styles.animated : ''}`}>
      <GetGift giftColor={localStorage.getItem('giftName') ?? ''} />
      <div className={styles.header}>
        <div className={clsx(
          styles.image,
          item.item_rarity === 'yellow' ? styles.purpleImage : item.item_rarity === 'green' && styles.redImage
        )}>
          <img src={itemStoreString(item.image_url)} className={clsx(isBlocked && styles.disabledImage)} alt="" />
          {isBlocked ? <LockIconSvg className={styles.disabledImageIcon} /> : <p>{item.item_premium_level === 'advanced' ? 'adv' : item.item_premium_level}</p>}
        </div>
        <div className={styles.title}>
          <div className={styles.headline}>
            <h3>{locale === 'ru' ? item.name : item.name_eng}</h3>
          </div>
          <p className={item.item_rarity === 'green' ? styles.colorRed : item.item_rarity === 'yellow' ? styles.colorPurple : styles.level}>
            {t('s20')} {itemLevel} {isB && t('s21')}
          </p>
          <div className={clsx(styles.stats, (isBlocked || disabled) && styles.disabledStats)}>
            <div className={styles.statsItem}>
              <p>+{formatAbbreviation(item.boost.views, 'number', { locale })}</p>
              <img src={ViewsIcon} alt="" />
            </div>
            <div className={styles.statsItem}>
              <p>+{formatAbbreviation(item.boost.subscribers, 'number', { locale })}</p>
              <img src={SubscriberCoin} alt="" />
            </div>
            <div className={styles.statsItem}>
              <p>+{formatAbbreviation(item.boost.income_per_second, 'number', { locale })}</p>
              <img src={CoinIcon} alt="" />
              <p>/{t('s13')}</p>
            </div>
          </div>
        </div>
      </div>
      {!isBlocked ? (
        disabled ? (
          <p className={styles.disabledText}>
            {t('s22')} “
            <span className={item.item_rarity === 'yellow' ? styles.itemNameBlue : styles.itemNamePurple}>
              Компьютерный стул - Base
            </span>
            ”. {t('s23')}
          </p>
        ) : (
          <div className={styles.progress}>
            <div className={styles.text}>
              <p>
                {itemLevel}/{levelCap} {t('s24')}{' '}
              </p>
              <div className={styles.goal}>
                <p>{locale === 'ru' ? item.chest.chest_name : item.chest.chest_name_eng}</p>
                <img src={item.chest.chest_image_url || GiftIcon} alt="Reward" />
              </div>
            </div>
            <div className={styles.progressBar}>
              <div
                className={item.item_rarity === 'red'
                  ? styles.done
                  : item.item_rarity === 'yellow'
                    ? styles.donePurple
                    : styles.doneRed}
                style={{ width: `${Math.min(((itemLevel % 10) / 10) * 100, 100)}%` }}
              />
            </div>
            <div className={styles.items}>
              {itemsForImages?.items &&
                sortByPremiumLevel(itemsForImages.items)
                  .filter(i => i.name === item.name)
                  .map((i, index) => (
                    <div
                      key={i.id}
                      className={clsx(
                        styles.item,
                        index === 0 && (itemLevel < 50 || item.item_premium_level === 'base') && styles.blue,
                        index === 1 && ((itemLevel >= 50 && itemLevel < 100 && item.item_premium_level !== 'base') || item.item_premium_level === 'advanced') && styles.purple,
                        index === 2 && ((itemLevel >= 100 && !['base', 'advanced'].includes(item.item_premium_level)) || item.item_premium_level === 'pro') && styles.red,
                        !((index === 0 && (itemLevel < 50 || item.item_premium_level === 'base')) ||
                          (index === 1 && ((itemLevel >= 50 && itemLevel < 100 && item.item_premium_level !== 'base') || item.item_premium_level === 'advanced')) ||
                          (index === 2 && ((itemLevel >= 100 && !['base', 'advanced'].includes(item.item_premium_level)) || item.item_premium_level === 'pro'))
                        ) && styles.noBorder
                      )}
                      style={
                        itemLevel < 50 && index === 1
                          ? { '--lvl-height': `${(itemLevel / 50) * 100}%` }
                          : itemLevel >= 50 && index === 2
                            ? { '--lvl-height': `${((itemLevel - 50) / 50) * 100}%` }
                            : undefined
                      }
                    >
                      <img src={itemStoreString(i.image_url)} className={styles.itemImage} alt="" />
                      {item.item_premium_level === 'base' && i.item_premium_level === 'advanced' && !item.is_bought && (
                        <>
                          <div className={styles.lockedOverlay50}></div>
                          <span className={styles.itemLevel}>50</span>
                          <img src={LockIcon} alt="" className={styles.lockIcon} />
                        </>
                      )}
                      {item.item_premium_level !== 'pro' && i.item_premium_level === 'pro' && !item.is_bought && (
                        <>
                          <div className={styles.lockedOverlay100}></div>
                          <span className={styles.itemLevel}>100</span>
                          <img src={LockIcon} alt="" className={styles.lockIcon} />
                        </>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        )
      ) : null}
      {isBlocked ? (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>{t('s26')}</p>
          <img src={LockIcon} alt="" />
        </div>
      ) : showEquipButton ? (
        <Button onClick={handleEquipItem} className={styles.disabledActions} disabled={isActionDisabled}>
          <p>{t('s28')}</p>
        </Button>
      ) : itemLevel === 50 ? (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>{t('s27')}</p>
          <img src={LockIcon} alt="" />
        </div>
      ) : isUpgradeEnabled && profile && profile.growth_tree_stage_id > item.level ? (
        <div className={styles.actions}>
          <Button onClick={handleUsdtPayment} disabled={isActionDisabled}>
            {formatAbbreviation(shopItemsData?.items[0].price_usdt || 0, 'currency', { locale })}
          </Button>
          <Button
            className={classNames(
              item.item_rarity === 'yellow' ? styles.upgradeItemPurple : item.item_rarity === 'green' && styles.upgradeItemRed,
              { [styles.disabledBtn]: !isAffordable }
            )}
            disabled={isActionDisabled || !isAffordable}
            onClick={handleBuyItem}
          >
            <>
              {formatAbbreviation(computedPrice || 0, 'number', { locale })}{' '}
              <img className={styles.imgCoints} src={!isAffordable ? CointsGrey : CoinIcon} alt="" />
            </>
          </Button>
          <Button onClick={() => removeItem({ items_to_remove: [{ id: item.id }] })} disabled>
            <img src={ListDisableIcon} alt="Tasks" />
          </Button>
        </div>
      ) : (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>
            {t('s18')} {profile && profile.growth_tree_stage_id + 1}
          </p>
          <img src={LockIcon} alt="" />
        </div>
      )}
    </div>
  );
};
