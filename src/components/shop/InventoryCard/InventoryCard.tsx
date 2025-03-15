import { FC, useEffect, useRef, useState } from 'react';
import styles from './InventoryCard.module.scss';
import clsx from 'clsx';
//@ts-ignore
import LockIconSvg from '@icons/lock-closed.tsx';
import ChestBlueIcon from '@icons/chest-blue.svg';
import ChestPurpleIcon from '@icons/chest-purple.svg';
import ChestRedIcon from '@icons/chest-red.svg';
import ListIcon from '@icons/list.svg';
import ListDisableIcon from '@icons/list-disable.svg';
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
import {
  GUIDE_ITEMS,
  itemStoreString,
  localStorageConsts,
  MODALS,
  PROFILE_ME_POLLING_INTERVAL,
  SOUNDS,
  svgHeadersString,
} from '../../../constants';
import { useModal, useTonConnect } from '../../../hooks';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import useSound from 'use-sound';
import { useSelector } from 'react-redux';
import { Button } from '../../shared';
import GetGift from '../../../pages/DevModals/GetGift/GetGift';
import { useRoomItemsSlots } from '../../../../translate/items/items.ts';
import { isGuideShown } from '../../../utils/guide-functions.ts';

interface Props {
  disabled?: boolean;
  isUpgradeEnabled?: boolean;
  isBlocked?: boolean;
  isB?: boolean;

  item: IShopItem;
}

const getPremiumLevelOrder = (level: TypeItemQuality) =>
  ({
    base: 0,
    advanced: 1,
    pro: 2,
  })[level];

function sortByPremiumLevel(items: IShopItem[]) {
  return [...items].sort(
    (a, b) => getPremiumLevelOrder(a.item_premium_level) - getPremiumLevelOrder(b.item_premium_level),
  );
}

export const InventoryCard: FC<Props> = ({ disabled, isBlocked, isUpgradeEnabled = true, item, isB }) => {
  let s25Key = '';
  if (item.level < 50) {
    s25Key = 's25';
  } else if (item.level >= 50 && item.level < 100) {
    s25Key = 's25_100';
  } else if (item.level >= 100 && item.level <= 150) {
    s25Key = 's25_150';
  }
  const RoomItemsSlots = useRoomItemsSlots();

  console.log('s25Key:', s25Key);
  // return s25Key;

  const { walletAddress, connectWallet } = useTonConnect();
  const [idDisabled] = useState(true);
  const { t, i18n } = useTranslation('shop');
  const [upgradeItem, { isLoading }] = useUpgradeItemMutation();
  const { data, isLoading: isItemsLoading } = useGetShopItemsQuery({
    level: item.level === 50 ? 50 : item.level + 1,
    name: item.name,
    item_rarity: item.item_rarity,
  });
  const { data: itemsForImages } = useGetShopItemsQuery({
    name: item.name,
    level: 1,
    item_rarity: item.item_rarity,
  });

  const [equipItem] = useAddItemToRoomMutation();
  const [removeItem] = useRemoveItemFromRoomMutation();
  const { data: equipedItems, refetch: refetchEquipped } = useGetEquipedQuery();
  const { openModal } = useModal();

  const { data: profile, refetch } = useGetProfileMeQuery(undefined, {
    pollingInterval: PROFILE_ME_POLLING_INTERVAL,
  });

  const [playLvlSound] = useSound(SOUNDS.levelUp, { volume: useSelector(selectVolume) });

  const prevLvl = useRef<number | null>(null);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const lastTriggeredLevel = Number(localStorage.getItem('lastTriggeredLevel')) || 0;
    const lvlGiftFromStorage = localStorage.getItem('lvlGift');

    if (prevLvl.current === null) {
      prevLvl.current = item.level;
      return;
    }

    if (
      (item.level === 50 || item.level === 100 || item.level === 150) &&
      item.level !== lastTriggeredLevel &&
      item.level !== prevLvl.current
    ) {
      openModal(MODALS.TASK_CHEST);
      localStorage.setItem('lastTriggeredLevel', String(item.level));
    } else if (lvlGiftFromStorage && lvlGiftFromStorage.includes(String(item.level))) {
      openModal(MODALS.GET_GIFT);
      localStorage.setItem('lastTriggeredLevel', String(item.level));
    }

    prevLvl.current = item.level;
  }, [item.level]);

  const handleBuyItem = async (itemPoints: string) => {
    if (profile && +profile?.points < +itemPoints) return;

    try {
      setIsUpdateLoading(true);
      const res = await upgradeItem({ payment_method: 'internal_wallet', id: item.id });
      localStorage.setItem('giftName', res.data.chest.chest_name);
      localStorage.setItem('lvlGift', res.data.chest.item_levels_to_give);

      if (!res.error) {
        playLvlSound();
        refetch();
        refetchEquipped();
        if (item.level === 49) {
          if (item.item_premium_level === 'pro') {
            openModal(MODALS.UPGRADED_SHOP, {
              item,
              isYellow: item.item_rarity === 'red',
            });
          } else {
            localStorage.setItem(localStorageConsts.IS_NEED_TO_OPEN_CHEST, 'true');
            openModal(MODALS.UPGRADED_ITEM, {
              item,
              mode: 'item',
              reward: 'reward of item',
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      await refetchEquipped();
      setIsUpdateLoading(false);
    }
  };

  const handleEquipItem = async () => {
    if (!slot && slot !== 0)
      throw new Error('error while getting slot for item, check names in "redux/api/room/dto.ts - RoomItemsSlots"');
    const isSlotNotEmpty = equipedItems?.equipped_items.find(item => item.slot === slot);

    try {
      if (isSlotNotEmpty) {
        await removeItem({ items_to_remove: [{ id: isSlotNotEmpty.id }] });
      }
      const res = await equipItem({ equipped_items: [{ id: item.id, slot }] });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      item.name_eng.toLowerCase().trim() === 'typewriter' &&
      !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE)
    ) {
      handleEquipItem();
    }
  }, []);

  const slot = Object.values(RoomItemsSlots).find(_item =>
    _item.name.find((__item: string) => item.name.includes(__item)),
  )?.slot;
  const isEquipped = equipedItems?.equipped_items.find(_item => _item.id === item.id);

  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const handleUsdtPayment = async () => {
    if (!walletAddress) {
      connectWallet();
      return;
    }
    openModal(MODALS.NEW_ITEM, { item: item, mode: 'item' });
  };

  const levelCap =
    item.level < 10
      ? 10
      : item.level < 20
        ? 20
        : item.level < 30
          ? 30
          : item.level < 40
            ? 40
            : item.level < 50
              ? 50
              : item.level < 60
                ? 60
                : item.level < 70
                  ? 70
                  : item.level < 80
                    ? 80
                    : item.level < 90
                      ? 90
                      : item.level < 100
                        ? 100
                        : item.level < 110
                          ? 110
                          : item.level < 120
                            ? 120
                            : item.level < 130
                              ? 130
                              : item.level < 140
                                ? 140
                                : 150;

  console.log(item.level);
  return (
    <div className={styles.storeCard}>
      {<GetGift giftColor={localStorage.getItem('giftName') ?? ''} />}
      <div className={styles.header}>
        <div
          className={clsx(
            styles.image,
            item.item_rarity === 'yellow' ? styles.purpleImage : item.item_rarity === 'green' && styles.redImage,
          )}
        >
          <img src={itemStoreString(item.image_url)} className={clsx(isBlocked && styles.disabledImage)} alt="" />
          {isBlocked && <LockIconSvg className={styles.disabledImageIcon} />}
          {!isBlocked && <p>{item.item_premium_level === 'advanced' ? 'adv' : item.item_premium_level}</p>}
        </div>
        <div className={styles.title}>
          <div className={styles.headline}>
            <h3>{locale === 'ru' ? item.name : item.name_eng}</h3>
            {/*https://www.figma.com/design/EitKuxyKAwTD4SJen3OO91?node-id=1892-284353&m=dev#1121983015*/}
            {/*{item.item_rarity === 'red' ? (*/}
            {/*  <div className={styles.variant}>*/}
            {/*    <p>{t('s14')}</p>*/}
            {/*  </div>*/}
            {/*) : item.item_rarity === 'yellow' ? (*/}
            {/*  <div className={styles.variantPurple}>*/}
            {/*    <p>{t('s15')}</p>*/}
            {/*  </div>*/}
            {/*) : (*/}
            {/*  <div className={styles.variantRed}>*/}
            {/*    <p>{t('s16')}</p>*/}
            {/*  </div>*/}
            {/*)}*/}
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
            {t('s20')} {item.level} {isB && t('s21')}
          </p>
          <div className={clsx(styles.stats, (isBlocked || disabled) && styles.disabledStats)}>
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

      {!isBlocked &&
        (disabled ? (
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
                {item.level}/{levelCap} {t('s24')}{' '}
              </p>
              {
                <div className={styles.goal}>
                  <p>{locale === 'ru' ? item.chest.chest_name : item.chest.chest_name_eng}</p>
                  <img
                    src={
                      item.level < 50
                        ? ChestBlueIcon
                        : item.level >= 50 && item.level < 100
                          ? ChestPurpleIcon
                          : item.level >= 100 && item.level <= 150
                            ? ChestRedIcon
                            : item.item_rarity === 'red'
                              ? ChestBlueIcon
                              : item.item_rarity === 'yellow'
                                ? ChestPurpleIcon
                                : ChestRedIcon
                    }
                    alt=""
                  />
                </div>
              }
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
                  width: `${Math.min(((item.level % 10) / 10) * 100, 100)}%`,
                }}
              />
            </div>

            <div className={styles.items}>
              {itemsForImages?.items &&
                sortByPremiumLevel(itemsForImages?.items).map((_item, index) => (
                  <div
                    className={clsx(
                      item.item_rarity === 'red'
                        ? styles.item
                        : item.item_rarity === 'yellow'
                          ? styles.itemPurple
                          : styles.itemRed,
                      _item.item_premium_level === 'advanced' && !item.is_bought ? styles.noBorder : '',
                      _item.item_premium_level === 'pro' && !item.is_bought ? styles.noBorder : '',
                      // item.item_premium_level === 'advanced'
                      //   ? index > 1 && styles.itemLocked
                      //   : item.item_premium_level === 'base' && index > 0 && styles.itemLocked,
                    )}
                    key={_item.id}
                    style={
                      item.level < 50 && index === 1
                        ? ({
                            '--lvl-height': `${(item.level / 50) * 100}%`,
                          } as React.CSSProperties)
                        : item.level >= 50 && index === 2
                          ? ({
                              '--lvl-height': `${((item.level - 50) / 50) * 100}%`,
                            } as React.CSSProperties)
                          : undefined
                    }
                  >
                    <img src={_item.image_url + svgHeadersString} className={styles.itemImage} alt="" />

                    {_item.item_premium_level === 'advanced' && !item.is_bought && (
                      <>
                        <div className={styles.lockedOverlay50}></div>
                        <span className={styles.itemLevel}>50</span>
                        <img src={LockIcon} alt="" className={styles.lockIcon} />
                      </>
                    )}

                    {_item.item_premium_level === 'pro' && !item.is_bought && (
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
        ))}

      {isBlocked ? (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>{t('s26')}</p>
          <img src={LockIcon} alt="" />
        </div>
      ) : !isEquipped ? (
        <Button
          onClick={handleEquipItem}
          className={styles.disabledActions}
          disabled={item.level === 50 || isLoading || isItemsLoading || isLoading || isUpdateLoading}
        >
          {<p>{t('s28')}</p>}
        </Button>
      ) : item.level === 50 ? (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>{t('s27')}</p>
          <img src={LockIcon} alt="" />
        </div>
      ) : isUpgradeEnabled && profile && profile.growth_tree_stage_id > item.level ? (
        <div className={styles.actions}>
          <Button
            onClick={handleUsdtPayment}
            disabled={item.level === 50 || isLoading || isItemsLoading || isLoading || isUpdateLoading}
          >
            {formatAbbreviation(data?.items[0].price_usdt || 0, 'currency', {
              locale: locale,
            })}
          </Button>
          <Button
            className={clsx(
              item.item_rarity === 'yellow'
                ? styles.upgradeItemPurple
                : item.item_rarity === 'green' && styles.upgradeItemRed,
            )}
            disabled={item.level === 50 || isLoading || isItemsLoading || isLoading || isUpdateLoading}
            onClick={() => handleBuyItem(data?.items[0].price_internal ?? '')}
          >
            <>
              {formatAbbreviation(data?.items[0].price_internal || 0, 'number', {
                locale: locale,
              })}{' '}
              <img src={CoinIcon} alt="" />
            </>
          </Button>

          <Button
            disabled={idDisabled}
            onClick={() => {
              console.log('object');
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
            {t('s18')} {profile && profile.growth_tree_stage_id}
          </p>
          <img src={LockIcon} alt="" />
        </div>
      )}
    </div>
  );
};
