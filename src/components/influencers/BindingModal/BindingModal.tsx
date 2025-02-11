import CentralModal from '../../shared/CentralModal/CentralModal';

import s from './BindingModal.module.scss';

type BindingModalProps = {
  modalId: string;
  onClose: () => void;
};

export const BindingModal = ({
                               modalId,
                               onClose,
                             }: BindingModalProps) => {
  return (
    <CentralModal modalId={modalId} title="Рейтинг инфлюенсеров" onClose={onClose}>
      <div className={s.content}></div>
    </CentralModal>
  );
};