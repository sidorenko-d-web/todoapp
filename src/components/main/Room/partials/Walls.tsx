import styles from './Partials.module.scss';
export const Walls = () => {
  return (
    <div className={styles.wallsWrapper}>
      <div className={styles.wallLeft}></div>
      <div className={styles.wallRight}></div>
    </div>
  );
};
