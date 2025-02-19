import React from 'react';
import styles from './ProgressLine.module.scss';

interface ProgressLineProps {
  level: number;
  color: 'red' | 'blue' | 'purple'; // Добавлен цвет purple
}

export const ProgressLine: React.FC<ProgressLineProps> = ({ level, color }) => {
  const progressWidth = `${Math.max((level / 5) * 100, 10)}%`;

  return (
    <div className={styles.progressContainer}>
      {color === 'red' ? (
        <div className={styles.progressBarRed} style={{ width: progressWidth }} />
      ) : color === 'blue' ? (
        <div className={styles.progressBarBlue} style={{ width: progressWidth }} />
      ) : (
        <div className={styles.progressBarPurple} style={{ width: progressWidth }} /> // Добавлено условие для purple
      )}
    </div>
  );
};
