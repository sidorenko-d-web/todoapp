import { Walls } from './partials';
import { Floor } from './partials/Floor';
import styles from './partials/Partials.module.scss';

export const Room = () => {
  return (
    <div className={styles.room}>
      <Walls />
      <Floor />
    </div>
  );
};
