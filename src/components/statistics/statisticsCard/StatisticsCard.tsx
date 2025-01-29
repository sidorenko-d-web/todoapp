import { FC } from 'react';
import { useParams } from 'react-router-dom';
import styles from './StatisticsCard.module.scss';
import coin from '../../../../public/img/coin.svg';
import view from '../../../../public/img/views.svg';
import logo from '../../../../public/img/logo.svg';
import integrations from '../../../../public/img/integrations.svg';

interface Props {
  id: string;
  views: number;
  subscribers: number;
  companyName: string;
  onClick: () => void;
}

const StatisticsCard: FC<Props> = ({ views, subscribers, companyName, onClick }) => {
  return (
    <>
      <div className={styles.statisticsCard} onClick={onClick} style={{ cursor: 'pointer' }}>
        <div className={styles.left}>
          <img src={integrations} />
        </div>
        <div className={styles.right}>
          <div className={styles.header}>
            <p className={styles.title}>Интеграция 1</p>
            <div className={styles.logo}>
              <p>{companyName}</p>
              <img src={logo} />
            </div>
          </div>
          <div className={styles.scores}>
            <div className={styles.item}>
              <p>{views}</p>
              <img src={view} />
            </div>
            <div className={styles.item}>
              <p>{subscribers}</p>
              <img src={coin} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatisticsCard;
