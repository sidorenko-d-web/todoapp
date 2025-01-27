import { FC } from 'react';
import CentralModal from '../../shared/CentralModal/CentralModal.tsx';

interface CreatingIntegrationModalProps {
  modalId: string;
  onClose: () => void;
}

const CreatingIntegrationModal: FC<CreatingIntegrationModalProps> = ({modalId, onClose}: CreatingIntegrationModalProps) => {


  return (
    <>
      <CentralModal modalId={modalId} title={'Создание интеграции'} onClose={onClose}>

      </CentralModal>
    </>
  );
};

export default CreatingIntegrationModal;