import styles from './ItemUpgradedModal.module.scss';
import { MODALS } from '../../../../constants';
import { useModal } from '../../../../hooks';
import CentralModal from '../../../shared/CentralModal/CentralModal';
import BlueLight from '../../../../assets/icons/bg-light-blue.svg';
import PurpleLight from '../../../../assets/icons/bg-light-purple.svg';
import RedLight from '../../../../assets/icons/bg-light-red.svg';
import { IShopItem } from '../../../../redux';
import Button from '../partials/Button';
import ViewsIcon from '../../../../assets/icons/views.svg';
import SubsIcon from '../../../../assets/icons/subscriber_coin.svg';
import CoinIcon from '../../../../assets/icons/coin.svg';
import BlueChest from '../../../../assets/icons/chest-blue.svg';
// import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export const ItemUpgradedModal = () => {
  const { closeModal, getModalState } = useModal();

  const state = getModalState<{ item: IShopItem; mode: 'skin' | 'item'; reward: string }>(MODALS.UPGRADED_ITEM);
  // const navigate = useNavigate();

  const handleClose = () => {
    closeModal(MODALS.UPGRADED_ITEM);
  };

  const isPrem = state.args?.item.name.includes('Prem');
  const isPro = state.args?.item.name.includes('Pro');

  return (
    <CentralModal
      title="Новый предмет!"
      onClose={() => closeModal(MODALS.UPGRADED_ITEM)}
      modalId={MODALS.UPGRADED_ITEM}
    >
      <div className={styles.images}>
        <img
          src={isPrem ? PurpleLight : isPro ? RedLight : BlueLight}
          className={clsx(styles.bgLight)}
          alt="bg-light"
        />
        <div className={clsx(styles.itemImage, isPrem && styles.itemImagePurple, isPro && styles.itemImageRed)}>
          <img src={state.args?.item.image_url} alt="item-image" />
          <p className={isPrem ? styles.purple : isPro ? styles.red : styles.blue}>
            {state.args?.item.name.split(' ')[1]}
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
          <p>/cек</p>
        </div>
        <div className={styles.statItem}>
          <p>+</p>
          <img src={BlueChest} alt="blue chest icon" />
        </div>
      </div>
      <div className={styles.text}>
        <p>
          Поздравляем! Получен новый облик на{' '}
          <span className={clsx(isPrem ? styles.spanPurple : isPro && styles.spanRed)}>{state.args?.item.name}!</span>!
          Показатели увеличены, получен{' '}
          <span className={clsx(isPrem ? styles.spanPurple : isPro && styles.spanRed)}>{state.args?.reward}</span>!
        </p>
      </div>
      <Button onClick={handleClose} variant="blue">
        Открыть сундук!
      </Button>
    </CentralModal>
  );
};
