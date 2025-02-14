import { FC, useState, useEffect } from 'react';
import { TaskCard } from '../TaskCard';
import magicBallIcon from '../../../assets/icons/magic-ball.png';
import chestIcon from '../../../assets/icons/chest-purple.svg';
import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import s from '../styles.module.scss';
import { ModalTopTasks } from './ModalTopTasks';
import { useGetTasksQuery } from '../../../redux/api/tasks/api';
import { useTranslation } from 'react-i18next';

interface TaskState {
  currentStep: number;
  totalSteps: number;
  completed: boolean;
  hasError?: boolean;
}

export const TopTasks: FC = () => {
  const { t } = useTranslation('quests');
  const { openModal, closeModal } = useModal();
  const { data: tasksData } = useGetTasksQuery();
  
  const channelTask = tasksData?.assignments.find(
    task => task.category === 'create_channel'
  );
  
  const [taskState, setTaskState] = useState<TaskState>({
    currentStep: 0,
    totalSteps: 4,
    completed: false,
    hasError: false
  });

  // Обновляем состояние когда получаем данные с сервера
  useEffect(() => {
    if (channelTask) {
      setTaskState(prev => ({
        ...prev,
        currentStep: channelTask.completed_stages,
        totalSteps: channelTask.stages,
        completed: channelTask.is_completed,
      }));
    }
  }, [channelTask]);

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

  if (!channelTask) {
    return null;
  }

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
          title={channelTask.title}
          description={channelTask.description}
          icon={magicBallIcon}
          buttonType="secondary"
          income={Number(channelTask.boost.income_per_second)}
          subscribers={channelTask.boost.subscribers}
          passiveIncome={Number(channelTask.boost.income_per_second)}
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
        taskId={channelTask.id}
        onClose={handleCloseModal}
        onStateChange={handleStateChange}
        task={channelTask}
      />
    </section>
  );
};