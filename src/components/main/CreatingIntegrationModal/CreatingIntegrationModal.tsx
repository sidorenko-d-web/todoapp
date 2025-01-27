import { FC } from 'react';
import CentralModal from '../../shared/CentralModal/CentralModal.tsx';
import integrationWhiteIcon from '../../../assets/icons/integration-white.svg';

interface CreatingIntegrationModalProps {
  modalId: string;
  onClose: () => void;
}

const CreatingIntegrationModal: FC<CreatingIntegrationModalProps> = ({
                                                                       modalId,
                                                                       onClose,
                                                                     }: CreatingIntegrationModalProps) => {


  return (
    <CentralModal modalId={modalId} title={'Создание интеграции'} onClose={onClose} titleIcon={integrationWhiteIcon}>
      todo content
    </CentralModal>
  );
};

export default CreatingIntegrationModal;