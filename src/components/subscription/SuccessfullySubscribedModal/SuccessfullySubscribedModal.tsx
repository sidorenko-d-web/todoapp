import { FC } from 'react';
import CentralModal from '../../shared/CentralModal/CentralModal';
import integrationWhiteIcon from '../../../assets/icons/integration-white.svg';
import spinnerBlueIcon from '../../../assets/icons/spinner-blue.svg';

import s from './SuccessfullySubscribedModal.module.scss';

interface SuccessfullySubscribedModalProps {
  modalId: string;
  onClose: () => void;
}

export const SuccessfullySubscribedModal: FC<SuccessfullySubscribedModalProps> = ({
                                                                                    modalId,
                                                                                    onClose,
                                                                                  }: SuccessfullySubscribedModalProps) => {
  return (
    <CentralModal modalId={modalId} title={'Подписка оформлена!'} onClose={onClose}>
      <div className={s.content}>
        <div className={s.reward}>
          <span className={s.badge}>+5 <img src={integrationWhiteIcon} height={24} width={24}
                                            alt={'Integration'} /></span>
          <img className={s.spinner} src={spinnerBlueIcon} alt="Spinner" width={162} height={162} />
        </div>

        <div className={s.info}>
          <div className={s.progress}>
            <div className={s.progressInfo}>
              <span>Подписка</span>
              <span className={s.progressIcon}>5/5 <img src={integrationWhiteIcon} height={12} width={12}
                                                        alt={'Integration'} /></span>
            </div>
            <div className={s.progressBar}>
              <div className={s.progressBarInner} style={{ width: `100%` }} />
            </div>
          </div>
          <span
            className={s.description}
          >
            Поздравляем! Подписка оформлена. Теперь вы можете сделать 5 интеграций!
          </span>
        </div>

        <button className={s.button} onClick={onClose}>Отлично!</button>
      </div>
    </CentralModal>
  );
};
