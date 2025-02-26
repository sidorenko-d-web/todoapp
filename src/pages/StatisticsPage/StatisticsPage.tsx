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
import { Button } from '../../components/shared';
import { useTranslation } from 'react-i18next';
import { Loader } from '../../components';

const StatisticsPage: FC = () => {
  const { t, i18n } = useTranslation('statistics');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const navigate = useNavigate();
  const { data: statisticData, isLoading: isAllIntegrationsLoading } = useGetAllIntegrationsQuery();
  const { data: userProfileData, isLoading: isUserLoading } = useGetCurrentUserProfileInfoQuery();

  const isLoading = (
    isAllIntegrationsLoading ||
    isUserLoading
  );

  if (isLoading) return <Loader />;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Button className={styles.backButton} onClick={() => navigate(-1)}><img src={back} alt="Back" width={22}
                                                                                height={22} /></Button>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>{t('s1')}</h1>
          <div className={styles.scores}>
            <div className={styles.topScores}>
              <div className={styles.scoresItem}>
                <p>{formatAbbreviation(userProfileData?.total_views || 0, 'number', { locale: locale })}</p>
                <img src={views} height={18} width={18} alt="views" />
              </div>
              <div className={styles.scoresItem}>
                <p>{formatAbbreviation(userProfileData?.subscribers || 0, 'number', { locale: locale })}</p>
                <img src={subscribers} alt="subscribers" />
              </div>
            </div>
            <div className={styles.scoresItem}>
              <p>+ {formatAbbreviation(userProfileData?.points || 0, 'number', { locale: locale })}</p>
              <img src={coin} height={18} width={18} alt="" />
            </div>
          </div>
        </div>
        <div className={styles.placeholder} />
      </header>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{t('s2')}</h2>
        <div className={styles.sectionCount}>
          <p>{statisticData?.count || 0}</p>
          <img src={logo} alt="logo" width={18} height={18} />
        </div>
      </div>
      <div className={styles.integrationsWrapper}>
        {isLoading && isUserLoading ? (
          <p className={styles.info}>{t('s3')}</p>
        ) : statisticData?.count != 0 ? (
          statisticData?.integrations.map(integration => (
            <StatisticsCard
              key={integration.id}
              id={integration.id}
              views={integration.views}
              points={integration.income}
              companyName={integration.campaign.company_name}
              number={integration?.number}
              onClick={() => navigate(`/integrations/${integration.id}`)}
            />
          ))
        ) : (
          <p className={styles.info}>{t('s3')}</p>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
