import { FC, useState } from 'react';
import { TaskCard } from '../TaskCard';
import magicBallIcon from '../../../assets/icons/magic-ball.png';
import chestIcon from '../../../assets/icons/chest-purple.svg';
import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import s from '../styles.module.scss';
import { ModalTopTasks } from './ModalTopTasks';
import { Task } from '../../../redux/api/tasks/dto';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('quests');
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
    if (taskState.completed) return t('q14');
    if (taskState.currentStep > 0) return t('q11');
    return t('q13');
  };

  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>{t('q6')}</h2>
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
          progressReward={t('q10')}
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