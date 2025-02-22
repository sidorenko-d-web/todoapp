import styles from './Partials.module.scss';
import TableImg from '../../../../assets/images/start-room/table.svg';

export const Table = () => {
  return <img src={TableImg} className={styles.table} alt="table" />;
};
