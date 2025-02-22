import styles from './NewItemModal.module.scss';
import { AppRoute, MODALS, SOUNDS, svgHeadersString } from '../../../../constants';
import { useAutoPlaySound, useModal } from '../../../../hooks';
import { IShopItem } from '../../../../redux';
import Button from '../partials/Button';
import ViewsIcon from '../../../../assets/icons/views.png';
import SubsIcon from '../../../../assets/icons/subscriber_coin.svg';
import CoinIcon from '../../../../assets/icons/coin.png';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Lottie from 'lottie-react';
import { blueLight, purpleLight, redLight } from '../../../../assets/animations';
import { useDispatch } from 'react-redux';
import { setItemBought } from '../../../../redux/slices/guideSlice';
import { CentralModal } from '../../../shared';
import { useTranslation } from 'react-i18next';


export const NewItemModal: React.FC = () => {
  const { closeModal, getModalState } = useModal();
  const { t } = useTranslation('shop');

  const state = getModalState<{ item: IShopItem; mode: 'skin' | 'item' }>(
    MODALS.NEW_ITEM,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => {
    closeModal(MODALS.NEW_ITEM);
    dispatch(setItemBought(true));
    navigate(AppRoute.ShopInventory);
  };

  const isPrem = state.args?.item.item_rarity === 'yellow';
  const isPro = state.args?.item.item_rarity === 'green';


  useAutoPlaySound(MODALS.NEW_ITEM, SOUNDS.upgradeOrBuyItem);

  return (
    <CentralModal
      title={t('s43')}
      onClose={handleClose}
      modalId={MODALS.NEW_ITEM}
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
          <img src={state.args?.item.image_url + svgHeadersString} alt="item-image" />
        </div>
      </div>
      {state.args?.mode === 'item' && (
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
      )}
      <div className={styles.text}>
        {state.args?.mode === 'skin' ? (
          <p>
            {t('s48')}{' '}
            <span className={clsx(isPrem ? styles.spanPurple : isPro && styles.spanRed)}>
              {state.args?.item.name}!
            </span>{' '}
            {t('s49')}
          </p>
        ) : (
          <p>
            {t('s50')}{' '}
            <span className={clsx(isPrem ? styles.spanPurple : isPro && styles.spanRed)}>
              {state.args?.item.name}!
            </span>{' '}
            {t('s51')}
          </p>
        )}
      </div>
      <Button onClick={handleClose} variant="blue">
        {state.args?.mode === 'skin' ? t('s52') : t('s53')}
      </Button>
    </CentralModal>
  );
};
