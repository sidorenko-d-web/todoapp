import styles from './ProgressBar.module.scss';

export const ProgressBar = ({ progress = 30 }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={styles.progressBar}>
      <div className={styles.progressFill} style={{ width: `${clampedProgress}%` }} />
    </div>
  );
};

