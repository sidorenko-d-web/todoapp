import styles from './ItemUpgradedModal.module.scss';
import { MODALS } from '../../../../constants';
import { useModal } from '../../../../hooks';
import CentralModal from '../../../shared/CentralModal/CentralModal';
import { IShopItem } from '../../../../redux';
import Button from '../partials/Button';
import ViewsIcon from '../../../../assets/icons/views.svg';
import SubsIcon from '../../../../assets/icons/subscriber_coin.svg';
import CoinIcon from '../../../../assets/icons/coin.svg';
import BlueChest from '../../../../assets/icons/chest-blue.svg';
import Chair1 from '../../../../assets/icons/chair-1.svg';
import Chair2 from '../../../../assets/icons/chair-2.svg';
// import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Lottie from 'lottie-react';
import { blueLight, purpleLight, redLight } from '../../../../assets/animations';

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
        <Lottie
          animationData={isPrem ? purpleLight : isPro ? redLight : blueLight}
          loop={true}
          className={styles.bgLight}
        />
        <div className={clsx(styles.itemImage, isPrem && styles.itemImagePurple, isPro && styles.itemImageRed)}>
          {/* <img src={state.args?.item.image_url} alt="item-image" /> */}
          <img src={Chair1} alt="item-image" className={styles.imageOld} />
          <img src={Chair2} alt="item-image" className={styles.imageNew} />
          <p className={isPrem ? styles.purple : isPro ? styles.red : styles.blue}>
            {state.args?.item.name.split(' ')[1] ?? 'bad status'}
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
