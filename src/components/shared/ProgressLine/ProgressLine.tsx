import React from 'react';
import styles from './ProgressLine.module.scss';

interface ProgressLineProps {
  level: number;
  color: 'red' | 'blue';
}

const ProgressLine: React.FC<ProgressLineProps> = ({ level, color }) => {
  const progressWidth = `${Math.max((level / 5) * 100, 10)}%`;

  return (
    <div className={styles.progressContainer}>
      {
        color === 'red' ?
          <>
            <div className={styles.progressBarRed} style={{ width: progressWidth }} /></> :
          <>
            <div className={styles.progressBarBlue} style={{ width: progressWidth }} />
          </>
      }
    </div>
  );
};

export default ProgressLine;
