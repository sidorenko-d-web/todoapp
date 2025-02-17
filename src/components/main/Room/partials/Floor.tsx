import styles from './Partials.module.scss';
import TreshinaRight from '../../../../assets/images/start-room/treshina-right.svg';
import TreshinaLeft from '../../../../assets/images/start-room/treshina-left.svg';

export const Floor = () => {
  return (
    <>
      <img className={styles.treshinaLeft} src={TreshinaLeft} alt="" />
      <img className={styles.treshinaRight} src={TreshinaRight} alt="" />
      <div className={styles.floorWrapper}>
        <div className={styles.floor}></div>
      </div>
    </>
  );
};
