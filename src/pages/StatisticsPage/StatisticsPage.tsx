import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StatisticsPage.module.scss';
import views from '../../assets/icons/views.png';
import subscribers from '../../assets/icons/subscribers.svg';
import logo from '../../assets/icons/dot.png';
import back from '../../assets/icons/arrow-back.svg';
import StatisticsCard from '../../components/statistics/statisticsCard/StatisticsCard';
import coin from '../../assets/icons/coin.png';
import { useGetAllIntegrationsQuery, useGetCurrentUserProfileInfoQuery } from '../../redux';
import { formatAbbreviation } from '../../helpers';

const StatisticsPage: FC = () => {
  const navigate = useNavigate();
  const { data: statisticData, isLoading } = useGetAllIntegrationsQuery();
  const { data: userProfileData, isLoading: isUserLoading } = useGetCurrentUserProfileInfoQuery();

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}><img src={back} alt="Back" width={22}
                                                                                height={22} /></button>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Статистика</h1>
          <div className={styles.scores}>
            <div className={styles.scoresItem}>
              <p>{formatAbbreviation(userProfileData?.total_views)}</p>
              <img src={views} alt="views" />
            </div>
            <div className={styles.scoresItem}>
              <p>{formatAbbreviation(userProfileData?.subscribers)}</p>
              <img src={subscribers} alt="subscribers" />
            </div>
            <div className={styles.scoresItem}>
              <p>+ {formatAbbreviation(userProfileData?.points)}</p>
              <img src={coin} height={14} width={14} alt="" />
            </div>
          </div>
        </div>
        <div className={styles.placeholder}/>
      </header>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Все интеграции</h2>
        <div className={styles.sectionCount}>
          <p>{statisticData?.count || 0}</p>
          <img src={logo} alt="logo" width={14} height={14}/>
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
