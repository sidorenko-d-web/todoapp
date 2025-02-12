import { Chair, Floor, Sofa, Table, Walls, Window } from './partials';
import styles from './partials/Partials.module.scss';

export const Room = () => {
  return (
    <div className={styles.room}>
      <Walls />
      <Sofa />
      <Chair />
      <Table />
      <Window />
      <Floor />
    </div>
  );
};
