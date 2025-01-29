import { FC } from 'react';
import CentralModal from '../../../shared/CentralModal/CentralModal.tsx';
import integrationWhiteIcon from '../../../../assets/icons/integration-white.svg';

interface InviteFriendProps {
  modalId: string;
  onClose: () => void;
}

export const InviteFriend: FC<InviteFriendProps> = ({
                                                      modalId,
                                                      onClose,
                                                    }: InviteFriendProps) => {
  return (
    <CentralModal modalId={modalId} title={'Пригласить друга'} onClose={onClose} titleIcon={integrationWhiteIcon}>
      todo content
    </CentralModal>
  );
};