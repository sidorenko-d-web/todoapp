import { FC } from 'react';
import integrationWhiteIcon from '../../../assets/icons/integration-white.svg';
import coinIcon from '../../../assets/icons/coin.png';
import { RootState, setSubscribeGuideShown, useBuySubscriptionMutation } from '../../../redux';

import s from './SubscribeModal.module.scss';
import { getSubscriptionPurchased, isGuideShown, setGuideShown, setSubscriptionPurchased } from '../../../utils';
import { formatAbbreviation } from '../../../helpers';
import { Button, CentralModal } from '../../shared';
import { GUIDE_ITEMS, MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import { useTranslation } from 'react-i18next';
import list from '../../../assets/icons/list.svg';
import { SubscrieGuide } from '../../guide';
import { useDispatch, useSelector } from 'react-redux';

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
  const { t } = useTranslation('guide');
  const [ buySubscription ] = useBuySubscriptionMutation();

  const buyBtnGlowing = getSubscriptionPurchased();

  const { openModal, closeModal } = useModal();

  const handleBuySubscription = () => {
    setSubscriptionPurchased();
    buySubscription().unwrap().then(() => onSuccess());
    if(!isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN)) {
      openModal(MODALS.SUCCESSFULLY_SUBSCRIBED);
    }
  };

  const dispatch = useDispatch();
  const showGuide = useSelector((state: RootState) => !state.guide.subscribeGuideShown);


  return (
    <CentralModal modalId={modalId} title={`+ 5 ${t('g74')}`} onClose={onClose} titleIcon={integrationWhiteIcon}>
      <div className={s.content}>
        <div className={s.info}>
          <div className={s.progress}>
            <div className={s.progressInfo}>
              <span>{t('g76')}</span>
              <span className={s.progressIcon}>0/5 <img src={integrationWhiteIcon} height={18} width={18}
                                                        alt={'Integration'} /></span>
            </div>
            <div className={s.progressBar}>
              <div className={s.progressBarInner} style={{ width: `0%` }} />
            </div>
          </div>
          <span
            className={s.description}
          >
            {t('g75')}
          </span>
        </div>
        <div className={s.buttons}>
          <Button className={s.button} disabled>{formatAbbreviation(1.99, 'currency')}</Button>
          <Button className={`${s.button} ${!buyBtnGlowing ? s.glowing : ''}`} onClick={handleBuySubscription}>
              {formatAbbreviation(15000000)} <img src={coinIcon} height={14} width={14} alt={'Coin'} /></Button>
          <Button className={s.button + ' ' + s.gray}><img src={list} height={16} width={16} alt={'list'} /></Button>
        </div>
      </div>

      {showGuide && <SubscrieGuide
            onClose={() => {
              closeModal(MODALS.SUBSCRIBE);
              dispatch(setSubscribeGuideShown(true));
              setGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIBE_MODAL_OPENED);
            }}
            top="65%"
            zIndex={1500}
            description={
              <>
                {t('g14')} <span style={{ color: '#2F80ED' }}>{t('g15')}</span>
                <br />
                <br />
                {t('g16')}
              </>
            }
          />}
    </CentralModal>
  );
};
