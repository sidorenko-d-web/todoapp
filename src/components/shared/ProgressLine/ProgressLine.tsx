import React from 'react';
import styles from './ProgressLine.module.scss';

interface ProgressLineProps {
  level: number;
  color: 'red' | 'blue' | 'purple';
}

export const ProgressLine: React.FC<ProgressLineProps> = ({ level, color }) => {

  const safeLevel = typeof level === 'number' && !isNaN(level) 
    ? Math.max(0, Math.min(5, level)) 
    : 0;
  
  const progressWidth = `${(safeLevel / 5) * 100}%`;
  
  const colorClass = color === 'red' 
    ? styles.progressBarRed 
    : color === 'blue' 
      ? styles.progressBarBlue 
      : styles.progressBarPurple;

  return (
    <div className={styles.progressContainer}>
      <div className={colorClass} style={{ width: progressWidth }} />
    </div>
  );
};