import { useGetEquipedQuery } from '../../../../redux';
import styles from './Partials.module.scss';
export const Walls = () => {
  const { data } = useGetEquipedQuery();
  console.log(data);

  return (
    <div className={styles.wallsWrapper}>
      <div className={styles.wallLeft}></div>
      <div className={styles.wallRight}></div>
    </div>
  );
};
