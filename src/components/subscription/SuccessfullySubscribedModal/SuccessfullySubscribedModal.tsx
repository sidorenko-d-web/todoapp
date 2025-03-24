import { FC } from 'react';
import integrationWhiteIcon from '../../../assets/icons/integration-white.svg';
import spinnerBlueIcon from '../../../assets/icons/spinner-blue.svg';

import s from './SuccessfullySubscribedModal.module.scss';
import { Button, CentralModal } from '../../shared';
import { useTranslation } from 'react-i18next';

interface SuccessfullySubscribedModalProps {
  modalId: string;
  onClose: () => void;
}

export const SuccessfullySubscribedModal: FC<SuccessfullySubscribedModalProps> = ({
                                                                                    modalId,
                                                                                    onClose,
                                                                                  }: SuccessfullySubscribedModalProps) => {
  const { t } = useTranslation('guide');
  return (
    <CentralModal modalId={modalId} title={`${t('g78')}`} onClose={onClose}>
      <div className={s.content}>
        <div className={s.reward}>
          <span className={s.badge}>+5 <img src={integrationWhiteIcon} height={24} width={24}
                                            alt={'Integration'} /></span>
          <img className={s.spinner} src={spinnerBlueIcon} alt="Spinner" width={162} height={162} />
        </div>

        <div className={s.info}>
          <div className={s.progress}>
            <div className={s.progressInfo}>
              <span>{t('g76')}</span>
              <span className={s.progressIcon}>5/5 <img src={integrationWhiteIcon} height={18} width={18}
                                                        alt={'Integration'} /></span>
            </div>
            <div className={s.progressBar}>
              <div className={s.progressBarInner} style={{ width: `100%` }} />
            </div>
          </div>
          <span
            className={s.description}
          >
            {t('g79')}
          </span>
        </div>

        <Button className={s.button} onClick={onClose}>{t('g17')}</Button>
      </div>
    </CentralModal>
  );
};
