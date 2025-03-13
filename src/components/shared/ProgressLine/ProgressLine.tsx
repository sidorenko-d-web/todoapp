import React from 'react';
import styles from './ProgressLine.module.scss';

interface ProgressLineProps {
  level: number;
  color: 'red' | 'blue' | 'purple';
}

export const ProgressLine: React.FC<ProgressLineProps> = ({ level, color }) => {
  const progressWidth = `${Math.max((level / 5) * 100, 5)}%`;

  return (
    <div className={styles.progressContainer}>
      {color === 'red' ? (
        <div className={styles.progressBarRed} style={{ width: progressWidth }} />
      ) : color === 'blue' ? (
        <div className={styles.progressBarBlue} style={{ width: 0 }} />
      ) : (
        <div className={styles.progressBarPurple} style={{ width: progressWidth }} />
      )}
    </div>
  );
};
