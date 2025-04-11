import { useModal } from '../../../hooks';

interface props {
  modalId: string;
  component: React.ReactElement;
}

export const WithModal = ({ modalId, component }: props) => {
  const { getModalState } = useModal();
  const { isOpen } = getModalState(modalId);
  return isOpen && component;
};
