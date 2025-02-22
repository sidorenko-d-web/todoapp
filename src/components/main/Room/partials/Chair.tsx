import styles from './Partials.module.scss';
import ChairImg from '../../../../assets/images/start-room/chair.svg';

export const Chair = () => {
  return <img src={ChairImg} className={styles.chair} alt="" />;
};
