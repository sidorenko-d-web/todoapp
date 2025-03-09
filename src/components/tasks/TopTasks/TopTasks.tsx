import { FC, useState } from 'react';
import { TaskCard } from '../TaskCard';
import magicBallIcon from '../../../assets/icons/magic-ball.png';
import chestIconPurple from '../../../assets/icons/chest-purple.svg';
import { MODALS } from '../../../constants/modals';
import { useModal } from '../../../hooks';
import s from '../styles.module.scss';
import { ModalTopTasks } from './ModalTopTasks';
import { Task } from '../../../redux/api/tasks/dto';
import { useTranslation } from 'react-i18next';
import GetRewardChestModal from '../../../pages/DevModals/GetRewardChestModal/GetRewardChestModal';
import { useClaimChestRewardMutation } from '../../../redux';

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
  const { t, i18n } = useTranslation('quests');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { openModal, closeModal } = useModal();
  const [claimChestReward] = useClaimChestRewardMutation();

  const [taskState, setTaskState] = useState<TaskState>({
    currentStep: task.completed_stages,
    totalSteps: task.stages,
    completed: task.is_completed,
    hasError: false
  });

  const handleOpenTopTasks = async () => {
    console.log('Task completion status:', task.is_completed);
    console.log('Is reward given:', task.is_reward_given);
    console.log('Current step:', task.completed_stages);

    if (task.is_completed && !task.is_reward_given) {
      openModal(MODALS.TASK_CHEST, {
        points: 0,
        subscribers: 0,
        freezes: 0,
      });

      try {
        const result = await claimChestReward({ chest_reward_reason: 'create_channel_assignment' }).unwrap();
        console.log('Reward claimed:', result);

        openModal(MODALS.TASK_CHEST, {
          points: result.reward.points,
          subscribers: result.reward.subscribers,
          freezes: result.reward.freezes,
        });
      } catch (error) {
        console.error('Error getting reward:', error);
      }
      return;
    } else if (task.completed_stages === 3 || !task.is_completed) {
      openModal(MODALS.TOP_TASK);
    }
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

  const getChestIcon = () => {
    return taskState.currentStep === 3 ? chestIconPurple : chestIconPurple;
  };

  const getButtonText = () => {
    if (task.is_completed && !task.is_reward_given) {
      return t('q33'); // "Забрать награду"
    }
    if (task.is_completed) {
      return t('q15'); // "Выполнено"
    }
    return t('q13'); // "Выполнить"
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
          progressRewardIcon={getChestIcon()}
          onClick={handleOpenTopTasks}
          disabled={task.is_reward_given}
          buttonText={getButtonText()}
          errorText={taskState.hasError ? 'Ошибка: повторите попытку' : undefined}
          isCompleted={task.is_completed}
          isRewardGiven={task.is_reward_given}
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
      <GetRewardChestModal onClose={() => closeModal(MODALS.TASK_CHEST)} />
    </section>
  );
};