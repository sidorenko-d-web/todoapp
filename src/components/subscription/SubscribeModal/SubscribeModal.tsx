import { FC } from 'react';
import CentralModal from '../../shared/CentralModal/CentralModal';
import integrationWhiteIcon from '../../../assets/icons/integration-white.svg';

import s from './SubscribeModal.module.scss';

interface SubscribeModalProps {
  modalId: string;
  onClose: () => void;
}

export const SubscribeModal: FC<SubscribeModalProps> = ({
                                                          modalId,
                                                          onClose,
                                                        }: SubscribeModalProps) => {
  return (
    <CentralModal modalId={modalId} title={'+ 5 интеграций'} onClose={onClose} titleIcon={integrationWhiteIcon}>
      <div className={s.content}>
        content
      </div>
    </CentralModal>
  );
};
