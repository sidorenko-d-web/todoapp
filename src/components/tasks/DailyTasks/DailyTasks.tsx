import { TaskCard } from '../';
import giftIcon from '../../../assets/icons/gift.svg';

import s from '../styles.module.scss';
import { useState } from 'react';
import { ModalDailyTasks } from './ModalDailyTasks';

export const DailyTasks = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          onButtonClick={handleOpenModal} // Передаем обработчик клика
        />
      </div>
      {isModalOpen && <ModalDailyTasks onClose={handleCloseModal} />}
    </section>
  )
}