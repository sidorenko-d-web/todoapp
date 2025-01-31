import styles from './ShopUpgradedModal.module.scss';
import { AppRoute, MODALS } from '../../../../constants';
import { useModal } from '../../../../hooks';
import CentralModal from '../../../shared/CentralModal/CentralModal';
import PurpleLight from '../../../../assets/icons/bg-light-purple.svg';
import RedLight from '../../../../assets/icons/bg-light-red.svg';
import { IShopItem } from '../../../../redux';
import Button from '../partials/Button';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ShopIcon } from '../../../../assets/icons/shop';

export const ShopUpgradedModal = () => {
  const { closeModal, getModalState } = useModal();

  const state = getModalState<{ item: IShopItem; mode: 'skin' | 'item'; reward: string }>(MODALS.UPGRADED_SHOP);
  const navigate = useNavigate();

  const handleClose = () => {
    closeModal(MODALS.UPGRADED_SHOP);
    navigate(AppRoute.Shop);
  };

  const isPrem = state.args?.item.name.includes('Prem');
  const isPro = state.args?.item.name.includes('Pro');

  return (
    <CentralModal
      title="Новый предмет!"
      onClose={() => closeModal(MODALS.UPGRADED_SHOP)}
      modalId={MODALS.UPGRADED_SHOP}
    >
      <div className={styles.images}>
        <img src={isPrem ? PurpleLight : isPro ? RedLight : RedLight} className={clsx(styles.bgLight)} alt="bg-light" />
        <div className={clsx(styles.itemImage, isPrem && styles.itemImagePurple, isPro && styles.itemImageRed)}>
          <ShopIcon />
          <p className={isPrem ? styles.purple : isPro ? styles.red : styles.red}>{isPrem ? 'Премиум' : 'Люкс'}</p>
        </div>
      </div>

      <div className={styles.text}>
        <p>
          Поздравляем! Теперь вам доступен Новый раздел{' '}
          <span className={clsx(isPrem ? styles.spanPurple : isPro && styles.spanRed)}>
            {isPrem ? 'Премиум' : 'Люкс'}{' '}
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
