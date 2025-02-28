import { FC } from 'react';
import styles from './InventoryCard.module.scss';
import clsx from 'clsx';
//@ts-ignore
import LockIconSvg from '@icons/lock-closed.tsx';
import ChestBlueIcon from '@icons/chest-blue.svg';
import ChestPurpleIcon from '@icons/chest-purple.svg';
import ChestRedIcon from '@icons/chest-red.svg';
import ListIcon from '@icons/list.svg';
import {
  IShopItem,
  RoomItemsSlots,
  selectVolume,
  setPoints,
  useAddItemToRoomMutation,
  useGetCurrentUserProfileInfoQuery,
  useGetEquipedQuery,
  useGetShopItemsQuery,
  useRemoveItemFromRoomMutation,
  useUpgradeItemMutation,
} from '../../../redux';
import CoinIcon from '../../../assets/icons/coin.png';
import SubscriberCoin from '../../../assets/icons/subscribers.png';
import LockIcon from '../../../assets/icons/lock_icon.svg';
import ViewsIcon from '../../../assets/icons/views.png';
import { localStorageConsts, MODALS, SOUNDS, svgHeadersString } from '../../../constants';
import { useModal } from '../../../hooks';
import { formatAbbreviation, sortByPremiumLevel } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import useSound from 'use-sound';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../shared';

interface Props {
  disabled?: boolean;
  isUpgradeEnabled?: boolean;
  isBlocked?: boolean;
  isB?: boolean;

  item: IShopItem;
}

export const InventoryCard: FC<Props> = ({ disabled, isBlocked, isUpgradeEnabled = true, item, isB }) => {
  const { t, i18n } = useTranslation('shop');
  const [upgradeItem, { isLoading }] = useUpgradeItemMutation();
  const dispatch = useDispatch();
  const { data, isLoading: isItemsLoading, isFetching } = useGetShopItemsQuery({
    level: item.level === 50 ? 50 : item.level + 1,
    name: item.name,
  });
  const { refetch, isLoading: isCurrentProfileLoading } = useGetCurrentUserProfileInfoQuery();
  const [equipItem, { isLoading: isEquipItemLoading }] = useAddItemToRoomMutation();
  const [removeItem, { isLoading: isRemoveItemLoading }] = useRemoveItemFromRoomMutation();
  const { data: equipedItems, refetch: refetchEquipped, isLoading: isEquippedLoading } = useGetEquipedQuery();
  const { openModal } = useModal();
  const [playLvlSound] = useSound(SOUNDS.levelUp, { volume: useSelector(selectVolume) });

  const handleBuyItem = async () => {
    try {
      const res = await upgradeItem({ payment_method: 'internal_wallet', id: item.id });

      if (!res.error) {
        playLvlSound();
        refetch();
        refetchEquipped();
        dispatch(setPoints((prevPoints: number) => prevPoints + 1));
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
    }
  };

  const handleEquipItem = async () => {
    if (!slot && slot !== 0)
      throw new Error('error while getting slot for item, check names in "redux/api/room/dto.ts - RoomItemsSlots"');

    const isSlotNotEmpty = equipedItems?.equipped_items.find(item => item.slot === slot);

    try {
      if (isSlotNotEmpty) {
        removeItem({ items_to_remove: [{ id: isSlotNotEmpty.id }] });
      }
      const res = await equipItem({ equipped_items: [{ id: item.id, slot }] });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };
  const slot = Object.values(RoomItemsSlots).find(_item => _item.name.find(__item => item.name.includes(__item)))?.slot;
  const isEquipped = equipedItems?.equipped_items.find(_item => _item.id === item.id);

  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  return (
    <div className={styles.storeCard}>
      <div className={styles.header}>
        <div
          className={clsx(
            styles.image,
            item.item_rarity === 'yellow' ? styles.purpleImage : item.item_rarity === 'green' && styles.redImage,
          )}
        >
          <img src={item.image_url + svgHeadersString} className={clsx(isBlocked && styles.disabledImage)} alt="" />

          {isBlocked && <LockIconSvg className={styles.disabledImageIcon} />}
          {!isBlocked && <p>{item.item_premium_level === 'advanced' ? 'adv' : item.item_premium_level}</p>}
        </div>
        <div className={styles.title}>
          <div className={styles.headline}>
            <h3>{item.name}</h3>
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

      {!isBlocked && (
        <div className={styles.progress}>
          <div className={styles.text}>
            <p>
              {item.level}/50 {t('s24')}{' '}
            </p>
            <div className={styles.goal}>
              <p>{t('s25')}</p>
              <img
                src={
                  item.item_rarity === 'red'
                    ? ChestBlueIcon
                    : item.item_rarity === 'yellow'
                    ? ChestPurpleIcon
                    : ChestRedIcon
                }
                alt=""
              />
            </div>
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
              style={{ width: item.level * 2 + '%' }}
            />
          </div>

          <div className={styles.items}>
            {data?.items &&
              sortByPremiumLevel(data?.items).map((_item, index) => (
                <div
                  className={clsx(
                    item.item_rarity === 'red'
                      ? styles.item
                      : item.item_rarity === 'yellow'
                      ? styles.itemPurple
                      : styles.itemRed,
                    item.item_premium_level === 'advanced'
                      ? index > 1 && styles.itemLocked
                      : item.item_premium_level === 'base' && index > 0 && styles.itemLocked,
                  )}
                  key={_item.id}
                >
                  <img src={_item.image_url + svgHeadersString} className={styles.itemImage} alt="" />
                  <img src={LockIcon} className={styles.lock} alt="" />
                </div>
              ))}
          </div>
        </div>
      )}

      {isEquipItemLoading ||
      isLoading ||
      isItemsLoading ||
      isRemoveItemLoading ||
      isEquippedLoading ||
      isCurrentProfileLoading ? (
        <p style={{color: '#fff', fontSize: 16, padding: '16px 0', textAlign: 'center'}}>Loading</p>
      ) : isBlocked ? (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>{t('s26')}</p>
          <img src={LockIcon} alt="" />
        </div>
      ) : item.level === 50 ? (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>{t('s27')}</p>
          <img src={LockIcon} alt="" />
        </div>
      ) : !isEquipped ? (
        <Button onClick={handleEquipItem} className={styles.disabledActions}>
          {isEquipItemLoading || isRemoveItemLoading ? <p>loading</p> : <p>{t('s28')}</p>}
        </Button>
      ) : isUpgradeEnabled ? (
        <div className={styles.actions}>
          <Button>
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
            disabled={item.level === 50 || isLoading || isFetching}
            onClick={handleBuyItem}
          >
            {formatAbbreviation(data?.items[0].price_internal || 0, 'number', {
              locale: locale,
            })}{' '}
            <img src={CoinIcon} alt="" />
          </Button>

          <Button
            disabled={false}
            onClick={() => {
              console.log('object');
              removeItem({ items_to_remove: [{ id: item.id }] });
            }}
          >
            <img src={ListIcon} alt="Tasks" />
          </Button>
        </div>
      ) : (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>{t('s18')} 7</p>
          <img src={LockIcon} alt="" />
        </div>
      )}
    </div>
  );
};
