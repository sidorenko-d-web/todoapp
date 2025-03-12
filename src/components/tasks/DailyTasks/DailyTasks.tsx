import { FC, useEffect, useMemo, useState } from 'react';
import { TaskCard } from '../';
import giftIcon from '../../../assets/icons/gift.svg';
import { useModal } from '../../../hooks';
import { Task } from '../../../redux/api/tasks';
import s from '../styles.module.scss';
import { ModalDailyTasks } from './ModalDailyTasks';
import { useTranslation } from 'react-i18next';
import { MODALS } from '../../../constants';
import GetGift from '../../../pages/DevModals/GetGift/GetGift';
import { useGetAssignmentRewardMutation } from '../../../redux/api/tasks/api';

type QuestionState = 'solved' | 'current' | 'closed';

type DailyTasksProps = {
  task: Task;
};

export const DailyTasks: FC<DailyTasksProps> = ({ task }) => {
  const { t } = useTranslation('quests');
  const { openModal, closeModal } = useModal();
  const [getAssignmentReward] = useGetAssignmentRewardMutation();
  const [questionStates, setQuestionStates] = useState<QuestionState[]>([]);

  useEffect(() => {
    setQuestionStates(
      Array(task.stages)
        .fill('closed')
        .map((state, index) => (index === 0 ? 'current' : state)),
    );
  }, [task]);

  const completedCount = useMemo(() => {
    return questionStates.filter(state => state === 'solved').length;
  }, [questionStates]);

  const handleOpenDailyTasks = async () => {
    if (task.is_completed && !task.is_reward_given) {
      try {
        await getAssignmentReward({
          category: task.category,
          assignmentId: task.id,
        }).unwrap();

        openModal(MODALS.GET_GIFT);
        return;
      } catch (error) {
        console.error('Error getting assignment reward:', error);
      }
    }
    openModal(MODALS.DAILY_TASKS);
  };

  const handleCloseModal = () => {
    closeModal(MODALS.DAILY_TASKS);
  };

  const handleQuestionStatesChange = (states: QuestionState[]) => {
    setQuestionStates(states);
  };

  const isCompleted = task.is_completed || questionStates.every(state => state === 'solved');

  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>{t('q2')}</h2>
        <span className={s.count}>{completedCount}/3</span>
      </div>
      <div className={s.tasksList}>
        <TaskCard
          id={task.id}
          title={t('q3')}
          description={t('q4')}
          type="progress"
          icon={giftIcon}
          buttonText={isCompleted && !task.is_reward_given ? t('q33') : isCompleted ? t('q15') : t('q5')}
          disabled={!task.is_reward_given}
          onClick={handleOpenDailyTasks}
          questionStates={questionStates}
          boost={task.boost}
          totalSteps={task.stages}
          isCompleted={isCompleted}
          isRewardGiven={task.is_reward_given}
          isDailyTask={true}
        />
      </div>
      <ModalDailyTasks
        modalId={MODALS.DAILY_TASKS}
        onClose={handleCloseModal}
        onStateChange={handleQuestionStatesChange}
        taskId={task.id}
        task={task}
      />
      <GetGift />
    </section>
  );
};
