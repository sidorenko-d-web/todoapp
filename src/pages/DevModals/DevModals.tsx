import { MODALS } from '../../constants';
import { useModal } from '../../hooks';
import DaysInARowModal from './DaysInARowModal/DaysInARowModal';
import RewardForIntegrationModal from './RewardForIntegrationModal/RewardForIntegrationModal';
import GetRewardModal from './GetRewardModal/GetRewardModal';
import TaskCompletedModal from './TaskCompletedModal/TaskCompletedModal';
import GetRewardChestModal from './GetRewardChestModal/GetRewardChestModal';
import LossOfProgress from './LossOfProgress/LossOfProgress';
import GetGift from './GetGift/GetGift';
import { useDispatch, useSelector } from 'react-redux';
import { selectTrack, selectVolume, setTrack, setVolume } from '../../redux';

export default function DevModals() {
  const { openModal } = useModal();
  // const [playSound] = useSound(SOUNDS.chestOpen, { volume });
  const volume = useSelector(selectVolume);
  const track = useSelector(selectTrack);

  const dispatch = useDispatch();

  return (
    <>
      <button onClick={() => dispatch(setVolume(volume > 0.01 ? volume - 0.05 : 0.0))}>
        -
      </button>
      <button onClick={() => dispatch(setTrack(track === 1 ? 2 : track === 2 ? 3 : 1))}>
        change track
      </button>
      <button onClick={() => dispatch(setVolume(volume < 1 ? volume + 0.05 : 1))}>
        +
      </button>
      {/* <button onClick={() => playSound()}>upgrade item</button> */}
      {/* <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button> */}
      <div>
        <button onClick={() => openModal(MODALS.DAYS_IN_A_ROW)}>days in a row</button>
        <DaysInARowModal />
      </div>
      <div>
        <button onClick={() => openModal(MODALS.INTEGRATION_REWARD)}>
          REWARD Integration
        </button>
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
      <div>
        <button onClick={() => openModal(MODALS.LOSS_PROGRESS)}>Loss Progress</button>
        <LossOfProgress />
      </div>
      <div>
        <button onClick={() => openModal(MODALS.GET_GIFT)}>Get Gift</button>
        <GetGift />
      </div>
    </>
  );
}
