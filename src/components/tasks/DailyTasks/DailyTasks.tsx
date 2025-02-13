import { FC, useState, useMemo, useEffect } from 'react';
import { TaskCard } from '../';
import giftIcon from '../../../assets/icons/gift.svg';
import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import { useGetTasksQuery } from '../../../redux/api/tasks/api';
import s from '../styles.module.scss';
import { ModalDailyTasks } from './ModalDailyTasks';

type QuestionState = 'solved' | 'current' | 'closed';

export const DailyTasks: FC = () => {
  const { openModal, closeModal } = useModal();
  const { data: tasksData } = useGetTasksQuery();
  const [questionStates, setQuestionStates] = useState<QuestionState[]>(['current', 'closed', 'closed']);

  useEffect(() => {
    const dailyTasks = tasksData?.assignments.filter(task => task.category === 'daily');
    console.log('Daily Tasks:', dailyTasks);
  }, [tasksData]);

  const completedCount = useMemo(() => {
    return questionStates.filter(state => state === 'solved').length;
  }, [questionStates]);

  const handleOpenGift = () => {
    openModal(MODALS.DAILY_TASKS);
  };

  const handleCloseModal = () => {
    closeModal(MODALS.DAILY_TASKS);
  };

  const handleQuestionStatesChange = (newStates: QuestionState[]) => {
    setQuestionStates(newStates);
  };

  const isCompleted = questionStates.every(state => state === 'solved');

  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>Ежедневное</h2>
        <span className={s.count}>{completedCount}/3</span>
      </div>
      <div className={s.tasksList}>
        <TaskCard
          title="Ежедневный подарок"
          description="Ответьте на 3 вопроса, чтобы открыть."
          type="progress"
          icon={giftIcon}
          buttonText={isCompleted ? 'Забрать награду' : 'Открыть подарок'}
          disabled={isCompleted}
          onClick={handleOpenGift}
          questionStates={questionStates}
        />
      </div>
      <ModalDailyTasks
        modalId={MODALS.DAILY_TASKS}
        onClose={handleCloseModal}
        onStateChange={handleQuestionStatesChange}
      />
    </section>
  );
};