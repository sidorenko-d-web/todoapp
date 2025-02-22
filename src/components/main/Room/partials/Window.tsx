import styles from './Partials.module.scss';
import WindowImg from '../../../../assets/images/start-room/window.svg';

export const Window = () => {
  return <img src={WindowImg} className={styles.window} alt="window" />;
};
