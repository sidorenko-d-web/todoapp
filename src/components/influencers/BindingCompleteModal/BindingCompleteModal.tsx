import { CentralModal } from '../../shared';
import s from './BindingCompleteModal.module.scss';

type BindingCompleteModalProps = {
  modalId: string;
  onClose: () => void;
};

export const BindingCompleteModal = ({
                                       modalId,
                                       onClose,
                                     }: BindingCompleteModalProps) => {
  return (
    <CentralModal modalId={modalId} title="Рейтинг инфлюенсеров" onClose={onClose}>
      <div className={s.content}></div>
    </CentralModal>
  );
};