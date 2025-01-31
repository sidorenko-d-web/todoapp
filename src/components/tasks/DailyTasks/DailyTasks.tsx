import { TaskCard } from '../';
import giftIcon from '../../../assets/icons/gift.svg';
import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';

import s from '../styles.module.scss';
import { ModalDailyTasks } from './ModalDailyTasks';

export const DailyTasks = () => {
  const { openModal, closeModal } = useModal();

  const handleOpenGift = () => {
    openModal(MODALS.DAILY_TASKS);
  };

  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>Ежедневное</h2>
        <span className={s.count}>0/1</span>
      </div>
      <div className={s.tasksList}>
        <TaskCard
          title={'Ежедневный подарок'}
          description={'Ответьте на 3 вопроса, чтобы открыть.'}
          type={'progress'}
          icon={giftIcon}
          buttonText={'Открыть подарок'}
          onClick={handleOpenGift}
        />
      </div>
      <ModalDailyTasks
        modalId={MODALS.DAILY_TASKS}
        onClose={() => closeModal(MODALS.DAILY_TASKS)}
      />
    </section>
  );
};