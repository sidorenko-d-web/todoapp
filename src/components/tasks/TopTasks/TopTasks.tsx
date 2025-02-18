import { FC, useState } from 'react';
import { TaskCard } from '../TaskCard';
import magicBallIcon from '../../../assets/icons/magic-ball.png';
import chestIcon from '../../../assets/icons/chest-purple.svg';
import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import s from '../styles.module.scss';
import { ModalTopTasks } from './ModalTopTasks';
import { Task } from '../../../redux/api/tasks/dto';

interface TaskState {
  currentStep: number;
  totalSteps: number;
  completed: boolean;
  hasError?: boolean;
}

type TopTasksProps = {
  task: Task;
};

export const TopTasks: FC<TopTasksProps> = ({ task }) => {
  const { openModal, closeModal } = useModal();
  const [taskState, setTaskState] = useState<TaskState>({
    currentStep: task.completed_stages,
    totalSteps: task.stages,
    completed: task.is_completed,
    hasError: false
  });

  const handleOpenTopTasks = () => {
    openModal(MODALS.TOP_TASK);
  };

  const handleCloseModal = () => {
    closeModal(MODALS.TOP_TASK);
  };

  const handleStateChange = (newState: TaskState) => {
    setTaskState(prev => ({
      ...prev,
      currentStep: newState.currentStep,
      totalSteps: newState.totalSteps,
      completed: newState.completed,
    }));
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
        <span className={s.count}>
          {taskState.currentStep}/{taskState.totalSteps}
        </span>
      </div>
      <div className={s.tasksList}>
        <TaskCard
          title={task.title}
          description={task.description}
          icon={magicBallIcon}
          buttonType="secondary"
          income={Number(task.boost.income_per_second)}
          subscribers={task.boost.subscribers}
          passiveIncome={Number(task.boost.income_per_second)}
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
        taskId={task.id}
        onClose={handleCloseModal}
        onStateChange={handleStateChange}
        task={task}
      />
    </section>
  );
};