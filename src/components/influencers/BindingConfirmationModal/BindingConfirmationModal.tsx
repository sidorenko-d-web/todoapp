import CentralModal from '../../shared/CentralModal/CentralModal';

import s from './BindingConfirmationModal.module.scss';

type BindingConfirmationModalProps = {
  modalId: string;
  onClose: () => void;
};

export const BindingConfirmationModal = ({
                                           modalId,
                                           onClose,
                                         }: BindingConfirmationModalProps) => {
  return (
    <CentralModal modalId={modalId} title="Рейтинг инфлюенсеров" onClose={onClose}>
      <div className={s.content}></div>
    </CentralModal>
  );
};