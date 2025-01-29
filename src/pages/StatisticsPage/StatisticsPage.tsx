import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StatisticsPage.module.scss';
import views from '../../../public/img/views.svg';
import subscribers from '../../../public/img/subscribers.svg';
import logo from '../../../public/img/logo.svg';
import StatisticsCard from '../../components/statistics/statisticsCard/StatisticsCard';

import { useGetAllIntegrationsQuery } from '../../redux';

const StatisticsPage: FC = () => {
  const navigate = useNavigate();
  const { data: statisticData, isLoading } = useGetAllIntegrationsQuery();

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Статистика</h1>
        <div className={styles.scores}>
          <div className={styles.scoresItem}>
            <p>856,754 млн.</p>
            <img src={views} alt="views" />
          </div>
          <div className={styles.scoresItem}>
            <p>223 567</p>
            <img src={subscribers} alt="subscribers" />
          </div>
        </div>
      </div>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Все интеграции</h2>
        <div className={styles.sectionCount}>
          <p>{statisticData?.count || 0}</p>
          <img src={logo} alt="logo" />
        </div>
      </div>
      <div className={styles.integrationsWrapper}>
        {isLoading ? (
          <p className={styles.info}>Загрузка...</p>
        ) : statisticData?.count != 0 ? (
          statisticData?.integrations.map(integration => (
            <StatisticsCard
              key={integration.id}
              id={integration.id}
              views={integration.views}
              subscribers={integration.subscribers}
              companyName={integration.campaign.company_name}
              onClick={() => navigate(`/integrations/${integration.id}`)}
            />
          ))
        ) : (
          <p className={styles.info}>Нет доступных интеграций</p>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
