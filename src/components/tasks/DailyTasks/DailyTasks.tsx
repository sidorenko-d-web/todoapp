import { FC, useEffect, useMemo, useState } from 'react';
import { TaskCard } from '../';
import giftIcon from '../../../assets/icons/gift.svg';
import { useModal } from '../../../hooks';
import { Task } from '../../../redux/api/tasks';
import s from '../styles.module.scss';
import { ModalDailyTasks } from './ModalDailyTasks';
import { useTranslation } from 'react-i18next';
import { MODALS } from '../../../constants';

type QuestionState = 'solved' | 'current' | 'closed';

type DailyTasksProps = {
  task: Task;
};

export const DailyTasks: FC<DailyTasksProps> = ({ task }) => {
  const { t } = useTranslation('quests');

  const { openModal, closeModal } = useModal();
  const [ questionStates, setQuestionStates ] = useState<QuestionState[]>([]);

  // Инициализируем состояния на основе количества этапов из API
  useEffect(() => {
    setQuestionStates(Array(task.stages).fill('closed').map((state, index) =>
      index === 0 ? 'current' : state,
    ));
  }, [ task ]);

  const completedCount = useMemo(() => {
    return questionStates.filter(state => state === 'solved').length;
  }, [ questionStates ]);

  const handleOpenGift = () => {
    if (task.is_completed || questionStates.every(state => state === 'solved') && !task.is_reward_given) {
      openModal(MODALS.GET_GIFT);
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
        <h2 className={s.sectionTitle}>{t('q2')}</h2>
        <span className={s.count}>{completedCount}/3</span>
      </div>
      <div className={s.tasksList}>
        <TaskCard
          title={t('q3')}
          description={t('q4')}
          type="progress"
          icon={giftIcon}
          buttonText={isCompleted && !task.is_reward_given ? t('q33') : isCompleted ? t('q15') : t('q5')}
          disabled={task.is_reward_given}
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