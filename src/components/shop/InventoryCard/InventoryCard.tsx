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
  selectVolume,
  setItemUpgraded,
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
  buildLink,
  buildMode,
  GUIDE_ITEMS,
  localStorageConsts,
  MODALS,
  SOUNDS,
  svgHeadersString,
} from '../../../constants';
import { useModal } from '../../../hooks';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import useSound from 'use-sound';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../shared';
import GetGift from '../../../pages/DevModals/GetGift/GetGift';
import { useRoomItemsSlots } from '../../../../translate/items/items.ts';
import { isGuideShown, setGuideShown } from '../../../utils';
import classNames from 'classnames';
import useUsdtPayment from '../../../hooks/useUsdtPayment.ts';

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
  }[level]);

function sortByPremiumLevel(items: IShopItem[]) {
  return [...items].sort(
    (a, b) => getPremiumLevelOrder(a.item_premium_level) - getPremiumLevelOrder(b.item_premium_level),
  );
}

export const InventoryCard: FC<Props> = ({ disabled, isBlocked, isUpgradeEnabled = true, item, isB }) => {
  const RoomItemsSlots = useRoomItemsSlots();

  const itemLevel =
    item.item_premium_level === 'advanced'
      ? item.level + 50
      : item.item_premium_level === 'pro'
      ? item.level + 100
      : item.level;

  const [idDisabled] = useState(true);
  const { t, i18n } = useTranslation('shop');
  const { data: pointsUser } = useGetProfileMeQuery();
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
  const [showEquipButton, setShowEquipButton] = useState(false);

  const dispatch = useDispatch();

  const [price, setPrice] = useState('');

  const isAffordable = !!pointsUser && +pointsUser.points >= +item.price_internal;

  useEffect(() => {
    if (data) {
      const desiredItem = data.items.find(item_ => item_.item_premium_level === item.item_premium_level);
      setPrice('' + desiredItem?.price_internal);
    }
  }, [data, isItemsLoading]);

  const [equipItem] = useAddItemToRoomMutation();
  const [removeItem] = useRemoveItemFromRoomMutation();
  const { data: equipedItems, refetch: refetchEquipped } = useGetEquipedQuery();
  const { openModal } = useModal();

  const { data: profile, refetch } = useGetProfileMeQuery();

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

  const handleBuyItem = async (itemPoints: string) => {
    if (profile && +profile?.points < +itemPoints) return;

    try {
      dispatch(setItemUpgraded(true));
      setGuideShown(GUIDE_ITEMS.shopPageSecondVisit.ITEM_UPGRADED);

      setIsUpdateLoading(true);
      const res = await upgradeItem({ payment_method: 'internal_wallet', id: item.id });
      localStorage.setItem('giftName', res.data?.chest.chest_name || '');

      if (!res.error) {
        playLvlSound();
        refetch();
        refetchEquipped();
        if (item.item_premium_level === 'pro') {
          openModal(MODALS.UPGRADED_SHOP, {
            item,
            isYellow: item.item_rarity === 'red',
          });
        } else {
          if (res.data.level % 10 === 0) {
            localStorage.setItem(localStorageConsts.IS_NEED_TO_OPEN_CHEST, 'true');
            localStorage.setItem(localStorageConsts.CHEST_TO_OPEN_ID, res.data.id);
          }

          openModal(MODALS.UPGRADED_ITEM, {
            item: res.data,
            mode: 'item',
            reward: 'reward of item',
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      await refetchEquipped().then(() => {
        setIsUpdateLoading(false);
      });
      //setIsUpdateLoading(false);
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
      await equipItem({ equipped_items: [{ id: item.id, slot }] });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      item.name_eng.toLowerCase().trim() === 'typewriter' &&
      !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE)
    ) {
      void handleEquipItem();
    }
  }, []);

  const slot = Object.values(RoomItemsSlots).find(_item =>
    _item.name.find((__item: string) => item.name.includes(__item)),
  )?.slot;
  const isEquipped = equipedItems?.equipped_items.find(_item => _item.id === item.id);

  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const { processPayment } = useUsdtPayment();

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
              localStorage.setItem('giftName', res.data?.chest.chest_name || '');

              if (!res.error) {
                playLvlSound();
                refetch();
                refetchEquipped();
                if (item.item_premium_level === 'pro') {
                  openModal(MODALS.UPGRADED_SHOP, {
                    item,
                    isYellow: item.item_rarity === 'red',
                  });
                } else {
                  if (res.data.level % 10 === 0) {
                    localStorage.setItem(localStorageConsts.IS_NEED_TO_OPEN_CHEST, 'true');
                    localStorage.setItem(localStorageConsts.CHEST_TO_OPEN_ID, res.data.id);
                  }

                  openModal(MODALS.UPGRADED_ITEM, {
                    item: res.data,
                    mode: 'item',
                    reward: 'reward of item',
                  });
                }
              }
            } catch (error) {
              console.log(error);
            } finally {
              await refetchEquipped().then(() => {
                setIsUpdateLoading(false);
              });
              //setIsUpdateLoading(false);
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

  useEffect(() => {
    if (!isUpdateLoading && !isEquipped) {
      // Delay showing the button to ensure `equipedItems` is updated
      const timeout = setTimeout(() => {
        setShowEquipButton(true);
      }, 1500); // Adjust the delay as needed (e.g., 500ms)
      return () => clearTimeout(timeout); // Clear the timer on unmount or re-render
    } else {
      setShowEquipButton(false); // Hide the button if the item is equipped or the upgrade is in progress
    }
  }, [isUpdateLoading, isEquipped]);

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

  const getImage = (url: string) =>
    buildMode === 'production'
      ? buildLink()?.svgShop(url).replace('https://', 'https://storage.yandexcloud.net/')
      : buildLink()?.svgShop(url);

  return (
    <div
      className={`${styles.storeCard} ${
        !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) ? styles.animated : ''
      }`}
    >
      {<GetGift giftColor={localStorage.getItem('giftName') ?? ''} />}
      <div className={styles.header}>
        <div
          className={clsx(
            styles.image,
            item.item_rarity === 'yellow' ? styles.purpleImage : item.item_rarity === 'green' && styles.redImage,
          )}
        >
          <img
            src={getImage(item.image_url) + svgHeadersString}
            className={clsx(isBlocked && styles.disabledImage)}
            alt=""
          />
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
            {t('s20')} {itemLevel} {isB && t('s21')}
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
                {itemLevel}/{levelCap} {t('s24')}{' '}
              </p>
              {
                <div className={styles.goal}>
                  <p>{locale === 'ru' ? item.chest.chest_name : item.chest.chest_name_eng}</p>
                  <img src={item.chest.chest_image_url || GiftIcon} alt="Reward" />
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
        ))}

      {isBlocked ? (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>{t('s26')}</p>
          <img src={LockIcon} alt="" />
        </div>
      ) : showEquipButton ? (
        <Button
          onClick={handleEquipItem}
          className={styles.disabledActions}
          disabled={itemLevel === 50 || isLoading || isItemsLoading || isLoading || isUpdateLoading}
        >
          {<p>{t('s28')}</p>}
        </Button>
      ) : itemLevel === 50 ? (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>{t('s27')}</p>
          <img src={LockIcon} alt="" />
        </div>
      ) : isUpgradeEnabled && profile && profile.growth_tree_stage_id > item.level ? (
        <div className={styles.actions}>
          <Button
            onClick={handleUsdtPayment}
            disabled={itemLevel === 50 || isLoading || isItemsLoading || isLoading || isUpdateLoading}
          >
            {formatAbbreviation(data?.items[0].price_usdt || 0, 'currency', {
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
            disabled={itemLevel === 50 || isLoading || isItemsLoading || isUpdateLoading || !isAffordable}
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
