import { FC } from 'react';
import integrationWhiteIcon from '../../../assets/icons/integration-white.svg';
import coinIcon from '../../../assets/icons/coin.png';
import { useBuySubscriptionMutation } from '../../../redux';

import s from './SubscribeModal.module.scss';
import { getSubscriptionPurchased } from '../../../utils';
import { formatAbbreviation } from '../../../helpers';
import { Button, CentralModal } from '../../shared';

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
          <Button className={`${s.button} ${!buyBtnGlowing ? s.glowing : ''}`} onClick={handleBuySubscription}>
              {formatAbbreviation(450)} <img src={coinIcon} height={14} width={14}
                                                                                  alt={'Coin'} /></Button>
       
          <Button className={s.button + ' ' + s.gray}>Задание</Button>
          <Button className={s.button} disabled>{formatAbbreviation(1.99, 'currency')}</Button>
        </div>
      </div>
    </CentralModal>
  );
};
