import React from 'react';
import s from './ModalDailyTasks.module.scss';

type ModalDailyTasksProps = {
  onClose: () => void;
};

export const ModalDailyTasks: React.FC<ModalDailyTasksProps> = ({ onClose }) => {
  return (
    <div className={s.modalOverlay}>
      <div className={s.modal}>
        <h2>Ежедневные задания</h2>
        <p>Здесь будет контент модального окна.</p>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};