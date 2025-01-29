import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StatisticsPage.module.scss';
import views from '../../assets/Icons/views.svg';
import subscribers from '../../assets/Icons/subscribers.svg';
import logo from '../../assets/Icons/logo.svg';
import StatisticsCard from '../../components/statistics/statisticsCard/StatisticsCard';

import { useGetAllIntegrationsQuery, useGetCurrentUserProfileInfoQuery } from '../../redux';

const StatisticsPage: FC = () => {
  const navigate = useNavigate();
  const { data: statisticData, isLoading } = useGetAllIntegrationsQuery();
  const { data: userProfileData, isLoading: isUserLoading} = useGetCurrentUserProfileInfoQuery();

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Статистика</h1>
        <div className={styles.scores}>
          <div className={styles.scoresItem}>
            <p>{userProfileData?.total_views}</p>
            <img src={views} alt="views" />
          </div>
          <div className={styles.scoresItem}>
            <p>{userProfileData?.subscribers}</p>
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
        {isLoading && isUserLoading ? (
          <p className={styles.info}>Загрузка...</p>
        ) : statisticData?.count != 0 ? (
          statisticData?.integrations.map(integration => (
            <StatisticsCard
              key={integration.id}
              id={integration.id}
              views={integration.views}
              points={integration.income}
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
