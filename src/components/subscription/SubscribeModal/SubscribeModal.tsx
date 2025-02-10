import { FC } from 'react';
import CentralModal from '../../shared/CentralModal/CentralModal';
import integrationWhiteIcon from '../../../assets/icons/integration-white.svg';
import coinIcon from '../../../assets/icons/coin.png';
import { useBuySubscriptionMutation } from '../../../redux';

import s from './SubscribeModal.module.scss';
import { getSubscriptionPurchased } from '../../../utils';
import { formatAbbreviation } from '../../../helpers';

interface SubscribeModalProps {
  modalId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubscribeModal: FC<SubscribeModalProps> = ({
                                                          modalId,
                                                          onClose,
                                                          onSuccess,
                                                        }: SubscribeModalProps) => {
  const [ buySubscription ] = useBuySubscriptionMutation();

  const buyBtnGlowing = getSubscriptionPurchased();

  const handleBuySubscription = () => {
    buySubscription().unwrap().then(() => onSuccess());
  };

  return (
    <CentralModal modalId={modalId} title={'+ 5 интеграций'} onClose={onClose} titleIcon={integrationWhiteIcon}>
      <div className={s.content}>
        <div className={s.info}>
          <div className={s.progress}>
            <div className={s.progressInfo}>
              <span>Подписка</span>
              <span className={s.progressIcon}>0/5 <img src={integrationWhiteIcon} height={12} width={12}
                                                        alt={'Integration'} /></span>
            </div>
            <div className={s.progressBar}>
              <div className={s.progressBarInner} style={{ width: `0%` }} />
            </div>
          </div>
          <span
            className={s.description}
          >
            Интеграции закончились. Пополните подписку и приступайте к созданию интеграций!
          </span>
        </div>
        <div className={s.buttons}>
          <button className={`${s.button} ${!buyBtnGlowing ? s.glowing : ''}`} onClick={handleBuySubscription}>{formatAbbreviation(450)} <img src={coinIcon} height={14} width={14}
                                                                                alt={'Coin'} /></button>
          <button className={s.button} onClick={handleBuySubscription}>{formatAbbreviation(450)} <img src={coinIcon}
                                                                                                      height={14}
                                                                                                      width={14}
                                                                                                      alt={'Coin'} />
          </button>
          <button className={s.button + ' ' + s.gray}>Задание</button>
          <button className={s.button} disabled>{formatAbbreviation(1.99, 'currency')}</button>
        </div>
      </div>
    </CentralModal>
  );
};
