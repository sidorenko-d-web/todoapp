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
  TypeItemQuality,
  selectVolume,
  useGetCurrentUserProfileInfoQuery,
  useGetShopItemsQuery,
  useUpgradeItemMutation,
} from '../../../redux';
import CoinIcon from '../../../assets/icons/coin.png';
import SubscriberCoin from '../../../assets/icons/subscribers.png';
import LockIcon from '../../../assets/icons/lock_icon.svg';
import ViewsIcon from '../../../assets/icons/views.png';
import { localStorageConsts, MODALS, SOUNDS, svgHeadersString } from '../../../constants';
import { useModal } from '../../../hooks';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import useSound from 'use-sound';
import { useSelector } from 'react-redux';
import { Button } from '../../shared';
import { useDispatch } from 'react-redux';
import { setPoints } from '../../../redux/slices/point.ts';

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
    (a, b) =>
      getPremiumLevelOrder(a.item_premium_level) -
      getPremiumLevelOrder(b.item_premium_level),
  );
}

export const InventoryCard: FC<Props> = ({
                                           disabled,
                                           isBlocked,
                                           isUpgradeEnabled = true,
                                           item,
                                           isB,
                                         }) => {

  const { t,i18n } = useTranslation('shop');
  const [ upgradeItem, { isLoading } ] = useUpgradeItemMutation();
  const dispatch = useDispatch();
  const { data, isFetching } = useGetShopItemsQuery({
    level: item.level === 50 ? 50 : item.level + 1,
    name: item.name,
  });
  const { data: itemsForImages } = useGetShopItemsQuery({
    name: item.name,
    level: 1,
    item_rarity: item.item_rarity,
  });
  const { refetch } = useGetCurrentUserProfileInfoQuery();

  const { openModal } = useModal();

  const [playLvlSound] = useSound(SOUNDS.levelUp, {volume: useSelector(selectVolume)});

  const handleBuyItem = async () => {
    try {
      const res = await upgradeItem({ payment_method: 'internal_wallet', id: item.id });

      if (!res.error) {
        playLvlSound();
        refetch();
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
    } catch (error) {}
  };

  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  return (
    <div className={styles.storeCard}>
      <div className={styles.header}>
        <div
          className={clsx(
            styles.image,
            item.item_rarity === 'yellow'
              ? styles.purpleImage
              : item.item_rarity === 'green' && styles.redImage,
          )}
        >
          <img
            src={item.image_url + '?response-content-type=image%2Fsvg%2Bxml'}
            className={clsx(isBlocked && styles.disabledImage)}
            alt=""
          />
          {/* <div style={{width: 60, height: 60}}>
            <SpineAnimation
              name={item.name}
              skin={item.item_premium_level}
              jsonUrl="https://storage.yandexcloud.net/miniapp-v2-dev/Камера любительская-1.json"
              atlasUrl="https://storage.yandexcloud.net/miniapp-v2-dev/Камера любительская-1atlas.txt"
            />
          </div> */}
          {isBlocked && <LockIconSvg className={styles.disabledImageIcon} />}
          {!isBlocked && (
            <p>
              {item.item_premium_level === 'advanced' ? 'adv' : item.item_premium_level}
            </p>
          )}
        </div>
        <div className={styles.title}>
          {/* <div className={styles.headline}>
            <h3>{item.name}</h3>
            https://www.figma.com/design/EitKuxyKAwTD4SJen3OO91?node-id=1892-284353&m=dev#1121983015
            {item.item_rarity === 'red' ? (
              <div className={styles.variant}>
                <p>{t('s14')}</p>
              </div>
            ) : item.item_rarity === 'yellow' ? (
              <div className={styles.variantPurple}>
                <p>{t('s15')}</p>
              </div>
            ) : (
              <div className={styles.variantRed}>
                <p>{t('s16')}</p>
              </div>
            )}
          </div> */}
          <p
            className={
              item.item_rarity === 'green'
                ? styles.colorRed
                : item.item_rarity === 'yellow'
                ? styles.colorPurple
                : styles.level
            }
          >
            {t('s20')} {item.level} {isB && t("s21")}
          </p>
          <div
            className={clsx(
              styles.stats,
              (isBlocked || disabled) && styles.disabledStats,
            )}
          >
            <div className={styles.statsItem}>
              <p>+{formatAbbreviation(item.boost.views,'number', { locale: locale })}</p>
              <img src={ViewsIcon} />
            </div>
            <div className={styles.statsItem}>
              <p>+{formatAbbreviation(item.boost.subscribers,'number', { locale: locale })}</p>
              <img src={SubscriberCoin} alt="" />
            </div>
            <div className={styles.statsItem}>
              <p>+{formatAbbreviation(item.boost.income_per_second, 'number', { locale: locale })}</p>
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
            <span
              className={
                item.item_rarity === 'yellow'
                  ? styles.itemNameBlue
                  : styles.itemNamePurple
              }
            >
              Компьютерный стул - Base
            </span>
            ”. {t('s23')}
          </p>
        ) : (
          <div className={styles.progress}>
            <div className={styles.text}>
              <p>{item.level}/50 {t('s24')} </p>
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
              {itemsForImages?.items &&
                sortByPremiumLevel(itemsForImages?.items).map((_item, index) => (
                  <div
                    className={clsx(
                      item.item_rarity === 'red'
                        ? styles.item
                        : item.item_rarity === 'yellow'
                        ? styles.itemPurple
                        : styles.itemRed,
                      item.item_premium_level === 'advanced'
                        ? index > 1 && styles.itemLocked
                        : item.item_premium_level === 'base' &&
                            index > 0 &&
                            styles.itemLocked,
                    )}
                    key={_item.id}
                  >
                    <img
                      src={_item.image_url + svgHeadersString}
                      className={styles.itemImage}
                      alt=""
                    />
                    <img src={LockIcon} className={styles.lock} alt="" />
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
      ) : item.level === 50 ? (
        <div className={styles.disabledUpgradeActions}>
          <img src={LockIcon} alt="" />
          <p>{t('s27')}</p>
          <img src={LockIcon} alt="" />
        </div>
      ) : disabled ? (
        <Button className={styles.disabledActions}>
          <p>{t('s28')}</p>
        </Button>
      ) : isUpgradeEnabled ? (
        <div className={styles.actions}>
          <Button>
            {formatAbbreviation(data?.items[0].price_usdt || 0, 'currency', { locale: locale })}
          </Button>
          <Button
            className={clsx(
              item.item_rarity === 'yellow'
                ? styles.upgradeItemPurple
                : item.item_rarity === 'green' && styles.upgradeItemRed,
            )}
            disabled={item.level === 50}
            onClick={handleBuyItem}
          >
            {isLoading || isFetching ? (
              <p>loading</p>
            ) : (
              <>
                {formatAbbreviation(data?.items[0].price_internal || 0,'number', { locale: locale })}{' '}
                <img src={CoinIcon} alt="" />
              </>
            )}
          </Button>
          <Button
            onClick={() =>
              openModal(MODALS.UPGRADED_ITEM, {
                item,
                mode: 'item',
                reward: 'reward of item',
              })
            }
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
