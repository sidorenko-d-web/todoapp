import styles from './ShopUpgradedModal.module.scss';
import { AppRoute, MODALS, SOUNDS } from '../../../../constants';
import { useAutoPlaySound, useModal } from '../../../../hooks';
import { IShopItem } from '../../../../redux';
import Button from '../partials/Button';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ShopIcon } from '../../../../assets/Icons/shop';
import Lottie from 'lottie-react';
import { purpleLight, redLight } from '../../../../assets/animations';
import { CentralModal } from '../../../shared';

export const ShopUpgradedModal = () => {
  const { closeModal, getModalState } = useModal();

  const state = getModalState<{ item: IShopItem; isYellow: boolean }>(MODALS.UPGRADED_SHOP);
  const navigate = useNavigate();

  const handleClose = () => {
    closeModal(MODALS.UPGRADED_SHOP);
    navigate(AppRoute.Shop);
  };

  const isYellow = state.args?.isYellow;

  
  useAutoPlaySound(MODALS.UPGRADED_SHOP, SOUNDS.upgradeOrBuyItem);

  return (
    <CentralModal
      title="Новый предмет!"
      onClose={() => closeModal(MODALS.UPGRADED_SHOP)}
      modalId={MODALS.UPGRADED_SHOP}
    >
      <div className={styles.images}>
        <Lottie animationData={isYellow ? purpleLight : redLight} loop={true} className={styles.bgLight} />
        <div className={clsx(styles.itemImage, isYellow ? styles.itemImagePurple : styles.itemImageRed)}>
          <ShopIcon />
          <p className={isYellow ? styles.purple :styles.red}>{isYellow ? 'Премиум' : 'Люкс'}</p>
        </div>
      </div>

      <div className={styles.text}>
        <p>
          Поздравляем! Теперь вам доступен Новый раздел{' '}
          <span className={clsx(isYellow ? styles.spanPurple : styles.spanRed)}>
            {isYellow ? 'Премиум' : 'Люкс'}{' '}
          </span>
          в магазине с более крутыми предметами!
        </p>
      </div>
      <Button onClick={handleClose} variant="blue">
        Открыть магазин
      </Button>
    </CentralModal>
  );
};
