import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './StatisticsPage.module.scss';
import views from '../../../public/img/views.svg';
import subscribers from '../../../public/img/subscribers.svg';
import logo from '../../../public/img/logo.svg';
import StatisticsCard from '../../components/statistics/statisticsCard/StatisticsCard';

import { useGetIntegrationQuery, useGetAllIntegrationsQuery } from '../../redux/api/integrations/api';

const StatisticsPage: FC = () => {
  const { integrationId } = useParams<{ integrationId: string }>();

  const { data, error, isLoading } = useGetAllIntegrationsQuery();
  useEffect(() => {
    if (!isLoading && data) {
      console.log('Data loaded:', data);
    }
    if (error) {
      console.error('Error loading data:', error);
    }
  }, [isLoading, data, error]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Статистика</h1>
        <div className={styles.scores}>
          <div className={styles.scoresItem}>
            <p>856,754 млн.</p>
            <img src={views} />
          </div>
          <div className={styles.scoresItem}>
            <p>223 567</p>
            <img src={subscribers} />
          </div>
        </div>
      </div>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Все интеграции</h2>
        <div className={styles.sectionCount}>
          <p>3</p>
          <img src={logo} />
        </div>
      </div>
      <div className={styles.integrationsWrapper}>
        <StatisticsCard />
        <StatisticsCard />
        <StatisticsCard />
      </div>
    </div>
  );
};

export default StatisticsPage;
