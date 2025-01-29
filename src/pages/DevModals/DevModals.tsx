import { MODALS } from '../../constants';
import { useModal } from '../../hooks';
import DaysInARowModal from './DaysInARowModal/DaysInARowModal';

export default function DevModals() {
  const { openModal } = useModal();
  return (
    <div>
      <button onClick={() => openModal(MODALS.DAYS_IN_A_ROW)}>days in a row</button>
      <DaysInARowModal />
    </div>
  );
}
