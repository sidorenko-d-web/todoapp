import styles from './Partials.module.scss';
import floor from '../../../../assets/images/start-room/floor.svg';

export const Floor = () => {
  return <img src={floor} alt="" className={styles.floor} />;
};
