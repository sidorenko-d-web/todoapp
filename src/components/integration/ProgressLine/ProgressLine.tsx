import React from 'react';
import styles from './ProgressLine.module.scss';

interface ProgressLineProps {
  level: number; 
}

const ProgressLine: React.FC<ProgressLineProps> = ({ level }) => {
  const progressWidth = `${Math.max((level / 5) * 100, 10)}%`;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar} style={{ width: progressWidth }} />
    </div>
  );
};

export default ProgressLine;
