import { FC, useState, useMemo, useEffect } from 'react';
import { TaskCard } from '../';
import giftIcon from '../../../assets/icons/gift.svg';
import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import { useGetTasksQuery } from '../../../redux/api/tasks/api';
import { Task } from '../../../redux/api/tasks/dto';
import s from '../styles.module.scss';
import { ModalDailyTasks } from './ModalDailyTasks';

type QuestionState = 'solved' | 'current' | 'closed';

export const DailyTasks: FC = () => {
  const { openModal, closeModal } = useModal();
  const { data: tasksData } = useGetTasksQuery();
  const [questionStates, setQuestionStates] = useState<QuestionState[]>([]);

  const dailyTask = useMemo(() => {
    if (!tasksData?.assignments) return null;
    const dailyTasks = tasksData.assignments.filter(task => task.category === 'daily');
    return dailyTasks[dailyTasks.length - 1];
  }, [tasksData]);

  // Инициализируем состояния на основе количества этапов из API
  useEffect(() => {
    if (dailyTask) {
      setQuestionStates(Array(dailyTask.stages).fill('closed').map((state, index) => 
        index === 0 ? 'current' : state
      ));
    }
  }, [dailyTask]);

  const completedCount = useMemo(() => {
    return questionStates.filter(state => state === 'solved').length;
  }, [questionStates]);

  const handleOpenGift = () => {
    if (dailyTask) {
      openModal(MODALS.DAILY_TASKS);
    }
  };

  const handleCloseModal = () => {
    closeModal(MODALS.DAILY_TASKS);
  };

  const handleQuestionStatesChange = (newStates: QuestionState[]) => {
    setQuestionStates(newStates);
  };

  const isCompleted = dailyTask?.is_completed || questionStates.every(state => state === 'solved');

  if (!dailyTask) {
    return null;
  }

  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>Ежедневное</h2>
        <span className={s.count}>{completedCount}/{dailyTask.stages}</span>
      </div>
      <div className={s.tasksList}>
        <TaskCard
          title={dailyTask.title}
          description={dailyTask.description}
          type="progress"
          icon={giftIcon}
          buttonText={isCompleted ? 'Забрать награду' : 'Открыть подарок'}
          disabled={isCompleted}
          onClick={handleOpenGift}
          questionStates={questionStates}
          boost={dailyTask.boost}
          totalSteps={dailyTask.stages}
          completedSteps={dailyTask.completed_stages}
        />
      </div>
      <ModalDailyTasks
        modalId={MODALS.DAILY_TASKS}
        onClose={handleCloseModal}
        onStateChange={handleQuestionStatesChange}
        taskId={dailyTask.id}
        totalSteps={dailyTask.stages}
        boost={dailyTask.boost}
      />
    </section>
  );
};