import { FC } from 'react';
import styles from './StatisticsCard.module.scss';
import coin from '../../../../public/img/coin.svg';
import views from '../../../../public/img/views.svg';
import logo from '../../../../public/img/logo.svg';
import integrations from '../../../../public/img/integrations.svg';

const StatisticsCard: FC = () => {
  return (
    <>
      <div className={styles.statisticsCard}>
        <div className={styles.left}>
          <img src={integrations} />
        </div>
        <div className={styles.right}>
          <div className={styles.header}>
            <p className={styles.title}>Интеграция 1</p>
            <div className={styles.logo}>
              <p>Brilliant</p>
              <img src={logo} />
            </div>
          </div>
          <div className={styles.scores}>
            <div className={styles.item}>
              <p>566 345</p>
              <img src={views} />
            </div>
            <div className={styles.item}>
              <p>11 345</p>
              <img src={coin} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatisticsCard;
