import { FC } from 'react';
import CentralModal from '../../shared/CentralModal/CentralModal';

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
        content
      </div>
    </CentralModal>
  );
};
