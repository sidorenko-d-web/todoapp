import { FC, useState, useMemo, useEffect } from 'react';
import { TaskCard } from '../';
import giftIcon from '../../../assets/icons/gift.svg';
import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import { Task } from '../../../redux/api/tasks/dto';
import s from '../styles.module.scss';
import { ModalDailyTasks } from './ModalDailyTasks';
import { useGetDailyRewardQuery } from '../../../redux/api/tasks/api';
import { useTranslation } from 'react-i18next';

type QuestionState = 'solved' | 'current' | 'closed';

type DailyTasksProps = {
  task: Task;
};

export const DailyTasks: FC<DailyTasksProps> = ({ task }) => {
  const { t } = useTranslation('quests');

  const { openModal, closeModal } = useModal();
  const [questionStates, setQuestionStates] = useState<QuestionState[]>([]);
  const { refetch: getDailyReward } = useGetDailyRewardQuery(task.id, { skip: true });

  // Инициализируем состояния на основе количества этапов из API
  useEffect(() => {
    setQuestionStates(Array(task.stages).fill('closed').map((state, index) =>
      index === 0 ? 'current' : state
    ));
  }, [task]);

  const completedCount = useMemo(() => {
    return questionStates.filter(state => state === 'solved').length;
  }, [questionStates]);

  const handleOpenGift = async () => {
    if (task.is_completed && !task.is_reward_given) {
      console.log('Attempting to get daily reward for task:', task.id);
      try {
        const result = await getDailyReward();
        console.log('Daily Reward API Response:', result);
      } catch (error) {
        console.error('Error fetching daily reward:', error);
      }
      return;
    }
    openModal(MODALS.DAILY_TASKS);
  };

  const handleCloseModal = () => {
    closeModal(MODALS.DAILY_TASKS);
  };

  const handleQuestionStatesChange = (newStates: QuestionState[]) => {
    setQuestionStates(newStates);
  };

  const isCompleted = task.is_completed || questionStates.every(state => state === 'solved');

  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>{t("q2")}</h2>
        <span className={s.count}>{completedCount}/3</span>
      </div>
      <div className={s.tasksList}>
        <TaskCard
          title= {t('q3')}
          description= {t('q4')}
          type="progress"
          icon={giftIcon}
          buttonText={isCompleted ? t('q14') : t('q5')}
          disabled={isCompleted}
          onClick={handleOpenGift}
          questionStates={questionStates}
          boost={task.boost}
          totalSteps={task.stages}
          isCompleted={isCompleted}
          isDailyTask={true}
        />
      </div>
      <ModalDailyTasks
        modalId={MODALS.DAILY_TASKS}
        onClose={handleCloseModal}
        onStateChange={handleQuestionStatesChange}
        taskId={task.id}
        totalSteps={task.stages}
        boost={task.boost}
        task={task}
      />
    </section>
  );
};