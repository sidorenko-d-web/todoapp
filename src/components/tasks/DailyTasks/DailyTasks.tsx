import { FC, useState, useMemo } from 'react';
import { TaskCard } from '../';
import giftIcon from '../../../assets/icons/gift.svg';
import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import s from '../styles.module.scss';
import { ModalDailyTasks } from './ModalDailyTasks';
import { useTranslation } from 'react-i18next';

type QuestionState = 'solved' | 'current' | 'closed';

export const DailyTasks: FC = () => {
  const { t } = useTranslation('quests');

  const { openModal, closeModal } = useModal();
  const [questionStates, setQuestionStates] = useState<QuestionState[]>(['current', 'closed', 'closed']);

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