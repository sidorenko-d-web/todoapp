import { FC, useEffect, useMemo, useState } from 'react';
import { TaskCard } from '../';
import giftIcon from '../../../assets/icons/gift.svg';
import { useModal } from '../../../hooks';
import { Task } from '../../../redux/api/tasks/dto';
import s from '../styles.module.scss';
import { ModalDailyTasks } from './ModalDailyTasks';
import { useTranslation } from 'react-i18next';
import { MODALS } from '../../../constants/modals';
import GetGift from '../../../pages/DevModals/GetGift/GetGift';
import { useGetQuizRewardMutation } from '../../../redux/api/tasks/api';

type QuestionState = 'solved' | 'current' | 'closed';

type DailyTasksProps = {
  task: Task;
};

export const DailyTasks: FC<DailyTasksProps> = ({ task }) => {
  const { t } = useTranslation('quests');
  const { openModal, closeModal } = useModal();
  const [getQuizReward] = useGetQuizRewardMutation();
  const [questionStates, setQuestionStates] = useState<QuestionState[]>([]);
  const [quizPoints, setQuizPoints] = useState<string | null>(null);

  useEffect(() => {
    // Пытаемся получить сохраненную награду при монтировании
    const savedPoints = localStorage.getItem(`quiz_reward_${task.id}`);
    if (savedPoints) {
      setQuizPoints(savedPoints);
    }
  }, [task.id]);

  useEffect(() => {
    setQuestionStates(Array(task.stages).fill('closed').map((state, index) =>
      index === 0 ? 'current' : state,
    ));
  }, [task]);

  const completedCount = useMemo(() => {
    return questionStates.filter(state => state === 'solved').length;
  }, [questionStates]);

  const handleOpenDailyTasks = async () => {
    if (task.is_completed && !task.is_reward_given) {
      try {
        if (quizPoints) {
          // Используем сохраненные points
          openModal(MODALS.GET_GIFT, { 
            points: quizPoints,
            boost: task.boost
          });
        } else {
          // Получаем новые points
          const result = await getQuizReward(task.id).unwrap();
          localStorage.setItem(`quiz_reward_${task.id}`, result.points);
          setQuizPoints(result.points);
          openModal(MODALS.GET_GIFT, { 
            points: result.points,
            boost: task.boost
          });
        }
        return;
      } catch (error) {
        console.error('Error getting quiz reward:', error);
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
          disabled={task.is_reward_given}
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
        totalSteps={task.stages}
        boost={task.boost}
        task={task}
      />
      <GetGift 
        // points={Number(quizPoints) || 0}
      />
    </section>
  );
};