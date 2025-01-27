import { FC } from 'react';
import BottomModal from '../../shared/BottomModal/BottomModal.tsx';
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
    <BottomModal modalId={modalId} title={'Создание интеграции'} onClose={onClose} titleIcon={integrationWhiteIcon}>
      todo content
    </BottomModal>
  );
};

export default CreatingIntegrationModal;