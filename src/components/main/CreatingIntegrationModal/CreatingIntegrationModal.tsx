import { FC } from 'react';
import integrationWhiteIcon from '../../../assets/icons/integration-white.svg';
import { CentralModal } from '../../shared';
import { useTranslation } from 'react-i18next';

interface CreatingIntegrationModalProps {
  modalId: string;
  onClose: () => void;
}

const CreatingIntegrationModal: FC<CreatingIntegrationModalProps> = ({
  modalId,
  onClose,
}: CreatingIntegrationModalProps) => {
  const { t } = useTranslation('integrations');
  return (
    <CentralModal modalId={modalId} title={t('i11')} onClose={onClose} titleIcon={integrationWhiteIcon}>
      todo content
    </CentralModal>
  );
};

export default CreatingIntegrationModal;
