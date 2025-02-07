import { FC, useState } from 'react';
import { TaskCard } from '../TaskCard';
import magicBallIcon from '../../../assets/icons/magic-ball.png';
import chestIcon from '../../../assets/icons/chest-purple.svg';
import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import s from '../styles.module.scss';
import { ModalTopTasks } from './ModalTopTasks';


interface TaskState {
  currentStep: number;
  totalSteps: number;
  completed: boolean;
  hasError?: boolean;
}

export const TopTasks: FC = () => {
  const { openModal, closeModal } = useModal();
  const [taskState, setTaskState] = useState<TaskState>({
    currentStep: 0,
    totalSteps: 4,
    completed: false,
    hasError: false
  });

  const handleOpenTopTasks = () => {
    openModal(MODALS.TOP_TASK);
  };

  const handleCloseModal = () => {
    closeModal(MODALS.TOP_TASK);
  };

  const handleStateChange = (newState: TaskState) => {
    setTaskState(newState);
  };

  const progress = (taskState.currentStep / taskState.totalSteps) * 100;

  const getButtonText = () => {
    if (taskState.completed) return 'Забрать награду';
    if (taskState.currentStep > 0) return 'Продолжить выполнение';
    return 'Выполнить';
  };

  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>Топ-задания</h2>
        <span className={s.count}>{taskState.completed ? '1' : '0'}/1</span>
      </div>
      <div className={s.tasksList}>
        <TaskCard
          title="Создайте личный канал"
          description="Продвигайтесь и получайте награды."
          icon={magicBallIcon}
          buttonType="secondary"
          income={150}
          subscribers={10}
          passiveIncome={5}
          showProgressBar
          progress={progress}
          totalSteps={taskState.totalSteps}
          currentStep={taskState.currentStep}
          progressReward="Драгоценный сундук"
          progressRewardIcon={chestIcon}
          onClick={handleOpenTopTasks}
          disabled={taskState.completed}
          buttonText={getButtonText()}
          errorText={taskState.hasError ? 'Ошибка: повторите попытку' : undefined}
          isCompleted={taskState.completed}
          isTopTask={true}
        />
      </div>
      <ModalTopTasks
        modalId={MODALS.TOP_TASK}
        onClose={handleCloseModal}
        onStateChange={handleStateChange}
      />
    </section>
  );
};