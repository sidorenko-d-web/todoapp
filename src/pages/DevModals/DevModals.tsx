import { MODALS } from '../../constants';
import { useModal } from '../../hooks';
import DaysInARowModal from './DaysInARowModal/DaysInARowModal';
import RewardForIntegrationModal from './RewardForIntegrationModal/RewardForIntegrationModal';
import GetRewardModal from './GetRewardModal/GetRewardModal';
import TaskCompletedModal from './TaskCompletedModal/TaskCompletedModal';
import GetRewardChestModal from './GetRewardChestModal/GetRewardChestModal';

export default function DevModals() {
  const { openModal } = useModal();
  return (
    <>
      <div>
        <button onClick={() => openModal(MODALS.DAYS_IN_A_ROW)}>days in a row</button>
        <DaysInARowModal />
      </div>
      <div>
        <button onClick={() => openModal(MODALS.INTEGRATION_REWARD)}>REWARD Integration</button>
        <RewardForIntegrationModal />
      </div>
      <div>
        <button onClick={() => openModal(MODALS.GET_REWARD)}>Get Reward</button>
        <GetRewardModal />
      </div>
      <div>
        <button onClick={() => openModal(MODALS.TASK_COMPLETED)}>Task Completed</button>
        <TaskCompletedModal />
      </div>
      <div>
        <button onClick={() => openModal(MODALS.TASK_CHEST)}>Task Chest</button>
        <GetRewardChestModal />
      </div>
    </>
  );
}
