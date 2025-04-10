import { FC, useEffect, useRef, useState } from 'react';
import styles from './InventoryCard.module.scss';
import clsx from 'clsx';
// @ts-expect-error error
import LockIconSvg from '@icons/lock-closed.tsx';
import CointsGrey from '@icons/cointsGrey.svg';
import ListIcon from '@icons/list.svg';
import ListDisableIcon from '@icons/list-disable.svg';
import GiftIcon from '../../../assets/icons/gift.svg';
import {
  IShopItem,
  profileApi,
  roomApi,
  selectVolume,
  setItemUpgraded,
  TypeItemQuality,
  UpgradeItemResponse,
  useAddItemToRoomMutation,
  useGetCurrentUserBoostQuery,
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
import {
  buildLink,
  buildMode,
  GUIDE_ITEMS,
  localStorageConsts,
  MODALS,
  SOUNDS,
  svgHeadersString,
} from '../../../constants';
import { useModal } from '../../../hooks';
import { formatAbbreviation, getNextLevelReward } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import useSound from 'use-sound';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../shared';
import { RoomItemsSlots } from '../../../../translate/items/items.ts';
import { isGuideShown, setGuideShown } from '../../../utils';
import classNames from 'classnames';
import useUsdtPayment from '../../../hooks/useUsdtPayment.ts';

interface Props {
  item: IShopItem;
}

const getPremiumLevelOrder = (level: TypeItemQuality) =>
  ({
    base: 0,
    advanced: 1,
    pro: 2,
  }[level]);

function sortByPremiumLevel(items: IShopItem[]) {
  return [...items].sort(
    (a, b) => getPremiumLevelOrder(a.item_premium_level) - getPremiumLevelOrder(b.item_premium_level),
  );
}

export const InventoryCard: FC<Props> = ({ item }) => {
  const { t, i18n } = useTranslation('shop');
  const { processPayment } = useUsdtPayment();

  const prevLvl = useRef<number | null>(null);
  const isFirstRender = useRef(true);

  const [idDisabled] = useState(true);
  const [price, setPrice] = useState('');
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const [equipItem] = useAddItemToRoomMutation();
  const [removeItem] = useRemoveItemFromRoomMutation();
  const [upgradeItem, { isLoading }] = useUpgradeItemMutation();

  const { data: equipedItems, refetch: refetchEquipped } = useGetEquipedQuery();
  const { data: profile, refetch: refetchProfile } = useGetProfileMeQuery();
  const { refetch: refetchBoost } = useGetCurrentUserBoostQuery();

  const { data: nextLevelItem, isLoading: isItemsLoading } = useGetShopItemsQuery({
    level: item.level === 50 ? 50 : item.level + 1,
    name: item.name,
    item_rarity: item.item_rarity,
    item_premium_level: item.item_premium_level,
  });
  const { data: itemsForImages } = useGetShopItemsQuery({
    name: item.name,
    level: 1,
    item_rarity: item.item_rarity,
  });

  const { openModal } = useModal();
  const [playLvlSound] = useSound(SOUNDS.levelUp, { volume: useSelector(selectVolume) });

  const dispatch = useDispatch();

  const handleBuyItem = async (itemPoints: string) => {
    vibrate();
    if (profile && +profile?.points < +itemPoints) return;

    try {
      dispatch(setItemUpgraded(true));
      setGuideShown(GUIDE_ITEMS.shopPageSecondVisit.ITEM_UPGRADED);

      setIsUpdateLoading(true);
      const res = await upgradeItem({ payment_method: 'internal_wallet', id: item.id });
      localStorage.setItem('giftName', upgradeReward?.name || '');

      if (!res.error) {
        profileApi.util.invalidateTags(['Me']);
        roomApi.util.invalidateTags(['Boost']);
        refetchBoost();
        playLvlSound();
        refetchProfile();
        refetchEquipped();

        handleRewardAfterUpgrade(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      await refetchEquipped().then(() => {
        setIsUpdateLoading(false);
      });
    }
  };

  const handleRewardAfterUpgrade = (data: UpgradeItemResponse) => {
    //Определяет награду после прокачки
    console.log(data.level % 10 === 0);
    if (item.item_premium_level === 'pro' && data.level === 50) {
      openModal(MODALS.UPGRADED_SHOP, {
        item,
        isYellow: item.item_rarity === 'red',
      });
    } else if (data.level === 50) {
      localStorage.setItem(localStorageConsts.IS_NEED_TO_OPEN_CHEST, 'true');
      localStorage.setItem(localStorageConsts.CHEST_TO_OPEN_ID, data.id);

      const rewardForUpgrade =
        data.item_premium_level === 'base' ? t('s63') : data.item_premium_level === 'advanced' ? t('s64') : t('s65');

      openModal(MODALS.UPGRADED_ITEM, {
        item: data,
        mode: 'item',
        reward: rewardForUpgrade,
      });
    }else if(data.level % 10 === 0){
      openModal(MODALS.GET_GIFT, {
        giftColor: upgradeReward?.name,
        itemId: nextLevelItem?.items[0].id
      });
    }
  };

  const handleEquipItem = async () => {
    vibrate();
    if (!slot && slot !== 0)
      throw new Error('error while getting slot for item, check names in "redux/api/room/dto.ts - RoomItemsSlots"');
    const isSlotNotEmpty = equipedItems?.equipped_items.find(item => item.slot === slot);

    try {
      if (isSlotNotEmpty) {
        await removeItem({ items_to_remove: [{ id: isSlotNotEmpty.id }] });
      }
      await equipItem({ equipped_items: [{ id: item.id, slot }] });

      profileApi.util.invalidateTags(['Me']);
      roomApi.util.invalidateTags(['Boost']);
      refetchBoost();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUsdtPayment = async () => {
    try {
      await processPayment(Number(item.price_usdt), async result => {
        if (result.success) {
          console.warn('Transaction info:', 'hash:', result.transactionHash, 'senderAddress:', result.senderAddress);
          const res = await upgradeItem({
            id: item.id,
            payment_method: 'usdt',
            transaction_id: result.transactionHash,
            sender_address: result.senderAddress,
          });

          if (!res.error) {
            try {
              setIsUpdateLoading(true);
              const res = await upgradeItem({ payment_method: 'internal_wallet', id: item.id });
              localStorage.setItem('giftName', upgradeReward?.name || '');

              if (!res.error) {
                playLvlSound();
                refetchProfile();
                refetchEquipped();
                if (item.item_premium_level === 'pro' && res.data.level === 100) {
                  openModal(MODALS.UPGRADED_SHOP, {
                    item,
                    isYellow: item.item_rarity === 'red',
                  });
                } else {
                  if (res.data.level === 50 || res.data.level === 100) {
                    localStorage.setItem(localStorageConsts.IS_NEED_TO_OPEN_CHEST, 'true');
                    localStorage.setItem(localStorageConsts.CHEST_TO_OPEN_ID, res.data.id);

                    const rewardForUpgrade =
                      res.data.level === 50
                        ? 'Каменный сундук'
                        : res.data.level === 100
                        ? 'Редкий сундук'
                        : 'Легендарный сундук';

                    openModal(MODALS.UPGRADED_ITEM, {
                      item: res.data,
                      mode: 'item',
                      reward: rewardForUpgrade,
                    });
                  }
                }
              }
            } catch (error) {
              console.log(error);
            } finally {
              await refetchEquipped().then(() => {
                setIsUpdateLoading(false);
              });
            }
          } else {
            throw new Error(JSON.stringify(res.error));
          }
        }
      });
    } catch (err) {
      console.error('Error in USDT payment flow:', err);
    }
  };

  const vibrate = () => {
    const isVibrationSupported =
      typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function';
    if (isVibrationSupported) {
      navigator.vibrate(200);
    }
  };
  const getImage = (url: string) =>
    buildMode === 'production'
      ? buildLink()?.svgShop(url).replace('https://', 'https://storage.yandexcloud.net/')
      : buildLink()?.svgShop(url);

  const itemLevel =
    item.item_premium_level === 'advanced'
      ? item.level + 50
      : item.item_premium_level === 'pro'
      ? item.level + 100
      : item.level;

  const upgradeReward = getNextLevelReward(itemLevel, i18n.language as 'ru' | 'en');

  const levelCap =
    itemLevel < 10
      ? 10
      : itemLevel > 150
      ? 150
      : itemLevel % 10 === 0
      ? itemLevel === 50 || itemLevel === 100 || itemLevel === 150
        ? itemLevel
        : itemLevel + 10
      : Math.ceil(itemLevel / 10) * 10;

  const slot = Object.values(RoomItemsSlots).find(_item =>
    _item.name.find((__item: string) => item.name.includes(__item)),
  )?.slot;
  const isEquipped = equipedItems?.equipped_items.find(_item => _item.id === item.id);

  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  const isAffordable = !!profile && +profile.points >= +item.price_internal;

  useEffect(() => {
    if (nextLevelItem) {
      const desiredItem = nextLevelItem.items?.[0];
      setPrice('' + desiredItem?.price_internal);
    }
  }, [nextLevelItem?.count, isItemsLoading]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
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
  }, [itemLevel]);

  useEffect(() => {
    if (!isUpdateLoading && !isEquipped) {
      // Delay showing the button to ensure `equipedItems` is updated
      const timeout = setTimeout(() => {
        // setShowEquipButton(true);
      }, 1500); // Adjust the delay as needed (e.g., 500ms)
      return () => clearTimeout(timeout); // Clear the timer on unmount or re-render
    } else {
      // setShowEquipButton(false); // Hide the button if the item is equipped or the upgrade is in progress
    }
  }, [isUpdateLoading]);

  useEffect(() => {
    if (
      item.name_eng.toLowerCase().trim() === 'typewriter' &&
      !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE)
    ) {
      void handleEquipItem();
    }
  }, []);

  return (
    <div
      className={`${styles.storeCard} ${
        !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) ? styles.animated : ''
      }`}
    >
      <div className={styles.header}>
        <div
          className={clsx(
            styles.image,
            item.item_rarity === 'yellow' ? styles.purpleImage : item.item_rarity === 'green' && styles.redImage,
          )}
        >
          <img src={getImage(item.image_url) + svgHeadersString} alt="" />
          <p>{item.item_premium_level === 'advanced' ? 'adv' : item.item_premium_level}</p>
        </div>
        <div className={styles.title}>
          <div className={styles.headline}>
            <h3>{locale === 'ru' ? item.name : item.name_eng}</h3>
          </div>
          <p
            className={
              item.item_rarity === 'green'
                ? styles.colorRed
                : item.item_rarity === 'yellow'
                ? styles.colorPurple
                : styles.level
            }
          >
            {t('s20')} {itemLevel}
          </p>
          <div className={clsx(styles.stats)}>
            <div className={styles.statsItem}>
              <p>+{formatAbbreviation(item.boost.views, 'number', { locale: locale })}</p>
              <img src={ViewsIcon} />
            </div>
            <div className={styles.statsItem}>
              <p>+{formatAbbreviation(item.boost.subscribers, 'number', { locale: locale })}</p>
              <img src={SubscriberCoin} alt="" />
            </div>
            <div className={styles.statsItem}>
              <p>
                +
                {formatAbbreviation(item.boost.income_per_second, 'number', {
                  locale: locale,
                })}
              </p>
              <img src={CoinIcon} alt="" />
              <p>/{t('s13')}</p>
            </div>
          </div>
        </div>
      </div>

      {
        <div className={styles.progress}>
          <div className={styles.text}>
            <p>
              {itemLevel}/{levelCap} {t('s24')}{' '}
            </p>
            {itemLevel % 50 !== 0 && (
              <div className={styles.goal}>
                <p>{upgradeReward?.name}</p>
                <img src={upgradeReward?.icon || GiftIcon} alt="Reward" />
              </div>
            )}
          </div>

          <div className={styles.progressBar}>
            <div
              className={
                item.item_rarity === 'red'
                  ? styles.done
                  : item.item_rarity === 'yellow'
                  ? styles.donePurple
                  : styles.doneRed
              }
              style={{
                width: `${Math.min(((itemLevel % 10) / 10) * 100, 100)}%`,
              }}
            />
          </div>

          <div className={styles.items}>
            {itemsForImages?.items &&
              sortByPremiumLevel(itemsForImages?.items)
                .filter(_item => _item.name === item.name)
                .map((_item, index) => (
                  <div
                    className={clsx(
                      styles.item,
                      index === 0 && (itemLevel < 50 || item.item_premium_level === 'base') && styles.blue,
                      index === 1 &&
                        ((itemLevel >= 50 && itemLevel < 100 && item.item_premium_level !== 'base') ||
                          item.item_premium_level === 'advanced') &&
                        styles.purple,
                      index === 2 &&
                        ((itemLevel >= 100 && !['base', 'advanced'].includes(item.item_premium_level)) ||
                          item.item_premium_level === 'pro') &&
                        styles.red,
                      !(
                        (index === 0 && (itemLevel < 50 || item.item_premium_level === 'base')) ||
                        (index === 1 &&
                          ((itemLevel >= 50 && itemLevel < 100 && item.item_premium_level !== 'base') ||
                            item.item_premium_level === 'advanced')) ||
                        (index === 2 &&
                          ((itemLevel >= 100 && !['base', 'advanced'].includes(item.item_premium_level)) ||
                            item.item_premium_level === 'pro'))
                      ) && styles.noBorder,
                    )}
                    key={_item.id}
                    style={
                      itemLevel < 50 && index === 1
                        ? ({
                            '--lvl-height': `${(itemLevel / 50) * 100}%`,
                          } as React.CSSProperties)
                        : itemLevel >= 50 && index === 2
                        ? ({
                            '--lvl-height': `${((itemLevel - 50) / 50) * 100}%`,
                          } as React.CSSProperties)
                        : undefined
                    }
                  >
                    <img src={getImage(_item.image_url) + svgHeadersString} className={styles.itemImage} alt="" />

                    {item.item_premium_level === 'base' &&
                      _item.item_premium_level === 'advanced' &&
                      !item.is_bought && (
                        <>
                          <div className={styles.lockedOverlay50}></div>
                          <span className={styles.itemLevel}>50</span>
                          <img src={LockIcon} alt="" className={styles.lockIcon} />
                        </>
                      )}

                    {item.item_premium_level !== 'pro' && _item.item_premium_level === 'pro' && !item.is_bought && (
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
      }

      {item.level === 50 ? (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>{t('s27')}</p>
          <img src={LockIcon} alt="" />
        </div>
      ) : profile && profile.growth_tree_stage_id > item.level ? (
        <div className={styles.actions}>
          <Button
            onClick={handleUsdtPayment}
            disabled={
              itemLevel === 50 ||
              itemLevel === 100 ||
              itemLevel === 150 ||
              isLoading ||
              isItemsLoading ||
              isLoading ||
              isUpdateLoading
            }
          >
            {formatAbbreviation(nextLevelItem?.items[0].price_usdt || 0, 'currency', {
              locale: locale,
            })}
          </Button>
          <Button
            className={classNames(
              clsx(
                item.item_rarity === 'yellow'
                  ? styles.upgradeItemPurple
                  : item.item_rarity === 'green' && styles.upgradeItemRed,
              ),
              { [styles.disabledBtn]: !isAffordable },
            )}
            disabled={
              itemLevel === 50 ||
              itemLevel === 100 ||
              itemLevel === 150 ||
              isLoading ||
              isItemsLoading ||
              isUpdateLoading ||
              !isAffordable
            }
            onClick={() => handleBuyItem(price ?? '')}
          >
            <>
              {formatAbbreviation(price || 0, 'number', {
                locale: locale,
              })}{' '}
              <img className={styles.imgCoints} src={!isAffordable ? CointsGrey : CoinIcon} alt="" />
            </>
          </Button>

          <Button
            disabled={idDisabled}
            onClick={() => {
              vibrate();
              removeItem({ items_to_remove: [{ id: item.id }] });
            }}
          >
            <img src={idDisabled ? ListDisableIcon : ListIcon} alt="Tasks" />
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
