import styles from './ItemUpgradedModal.module.scss';
import { buildLink, buildMode, localStorageConsts, MODALS, svgHeadersString } from '../../../../constants';
import { useAutoPlaySound, useModal } from '../../../../hooks';
import { IShopItem } from '../../../../redux';
import Button from '../partials/Button';
import ViewsIcon from '../../../../assets/icons/views.png';
import SubsIcon from '../../../../assets/icons/subscriber_coin.svg';
import CoinIcon from '../../../../assets/icons/coin.png';
import clsx from 'clsx';
import Lottie from 'lottie-react';
import { blueLight, purpleLight, redLight } from '../../../../assets/animations';
import { SOUNDS } from '../../../../constants/sounds';
import { CentralModal } from '../../../shared';
import { useTranslation } from 'react-i18next';

export const ItemUpgradedModal = () => {
  const { closeModal, getModalState, openModal } = useModal();
  const { t } = useTranslation('shop');

  const state = getModalState<{ item: IShopItem; mode: 'skin' | 'item'; reward: string }>(
    MODALS.UPGRADED_ITEM,
  );

  const isPrem = state.args?.item.item_rarity === 'yellow';
  const isPro = state.args?.item.item_rarity === 'green';

  useAutoPlaySound(MODALS.UPGRADED_ITEM, SOUNDS.upgradeOrBuyItem);

  const handleOpenChest = () => {
    closeModal(MODALS.UPGRADED_ITEM);

    if (localStorage.getItem(localStorageConsts.IS_NEED_TO_OPEN_CHEST)) {
      localStorage.removeItem(localStorageConsts.IS_NEED_TO_OPEN_CHEST);
      openModal(MODALS.TASK_CHEST);
    }
  };


  const getImage = (url: string) =>
    buildMode === 'production'
      ? buildLink()?.svgShop(url).replace('https://', 'https://storage.yandexcloud.net/')
      : buildLink()?.svgShop(url);

  return (
    <CentralModal
      title={t('s62')}
      onClose={handleOpenChest}
      modalId={MODALS.UPGRADED_ITEM}
    >
      <div className={styles.images}>
        <Lottie
          animationData={isPrem ? purpleLight : isPro ? redLight : blueLight}
          loop={true}
          className={styles.bgLight}
        />
        <div
          className={clsx(
            styles.itemImage,
            isPrem && styles.itemImagePurple,
            isPro && styles.itemImageRed,
          )}
        >
          <img
            src={getImage(state.args?.item.image_url ?? '') + svgHeadersString}
            alt="item-image"
            className={styles.imageNew}
          />
          <p className={isPrem ? styles.purple : isPro ? styles.red : styles.blue}>
            {state.args?.item.item_premium_level === 'base'
              ? 'Base'
              : state.args?.item.item_premium_level === 'advanced'
                ? 'Adv'
                : 'Pro'}
          </p>
        </div>
      </div>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <p>+{state.args?.item.boost.views}</p>
          <img src={ViewsIcon} alt="View icon" />
        </div>
        <div className={styles.statItem}>
          <p>+{state.args?.item.boost.subscribers}</p>
          <img src={SubsIcon} alt="Subscriber icon" />
        </div>
        <div className={styles.statItem}>
          <p>+{state.args?.item.boost.income_per_second}</p>
          <img src={CoinIcon} alt="Coin icon" />
          <p>{t('s44')}</p>
        </div>
      </div>
      <div className={styles.text}>
        <p>
          {t('s45')}{' '}
          <span className={clsx(isPrem ? styles.spanPurple : isPro && styles.spanRed)}>
            {state.args?.item.name}!
          </span>
          ! {t('s46')}{' '}
          <span className={clsx(isPrem ? styles.spanPurple : isPro && styles.spanRed)}>
            {state.args?.reward}
          </span>
          !
        </p>
      </div>
      <Button onClick={handleOpenChest} variant="blue">
        {t('s34')}
      </Button>
    </CentralModal>
  );
};
