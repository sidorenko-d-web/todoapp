import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StatisticsPage.module.scss';
import views from '../../assets/icons/views.png';
import subscribersIcon from '../../assets/icons/subscribers.svg';
import logo from '../../assets/icons/dot.png';
import back from '../../assets/icons/arrow-back.svg';
import StatisticsCard from '../../components/statistics/statisticsCard/StatisticsCard';
import coin from '../../assets/icons/coin.png';
import { useGetAllIntegrationsQuery, useGetProfileMeQuery } from '../../redux';
import { formatAbbreviation } from '../../helpers';
import { Button } from '../../components/shared';
import { useTranslation } from 'react-i18next';
import { Loader } from '../../components';
import { useIncrementingProfileStats } from '../../hooks/useIncrementingProfileStats.ts';
import { usePushLineStatus } from '../../hooks/usePushLineStatus.ts';

const StatisticsPage: FC = () => {
  // Все хуки вызываются на верхнем уровне
  const { t, i18n } = useTranslation('statistics');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const navigate = useNavigate();
  const { data: statisticData, isLoading: isAllIntegrationsLoading } = useGetAllIntegrationsQuery();
  const { data: userProfileData, isLoading: isUserLoading } = useGetProfileMeQuery();
  const {
    points: displayedPoints,
    subscribers: displayedSubscribers,
    totalViews: displayedTotalViews,
  } = useIncrementingProfileStats({
    profileId: userProfileData?.id || '',
    basePoints: userProfileData?.points || '0',
    baseSubscribers: userProfileData?.subscribers || 0,
    baseTotalViews: userProfileData?.total_views || 0,
    baseTotalEarned: userProfileData?.total_earned || '0',
    futureStatistics: userProfileData?.future_statistics,
    lastUpdatedAt: userProfileData?.updated_at,
  });

  const { in_streak } = usePushLineStatus(); // Хук вызывается на верхнем уровне

  const isLoading = isAllIntegrationsLoading || isUserLoading;

  // Условная логика использования данных
  const points = in_streak ? displayedPoints : userProfileData?.points || '0';
  const subscribers = in_streak ? displayedSubscribers : userProfileData?.subscribers || 0;
  const totalViews = in_streak ? displayedTotalViews : userProfileData?.total_views || 0;

  // Условный рендеринг после всех хуков
  if (isLoading) return <Loader />;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Button className={styles.backButton} onClick={() => navigate(-1)}>
          <img src={back} alt="Back" width={22} height={22} />
        </Button>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>{t('s1')}</h1>
          <div className={styles.scores}>
            <div className={styles.topScores}>
              <div className={styles.scoresItem}>
                <p>{formatAbbreviation(totalViews, 'number', { locale: locale })}</p>
                <img src={views} height={18} width={18} alt="views" />
              </div>
              <div className={styles.scoresItem}>
                <p>{formatAbbreviation(subscribers, 'number', { locale: locale })}</p>
                <img src={subscribersIcon} alt="subscribers" />
              </div>
            </div>
            <div className={styles.scoresItem}>
              <p>+ {formatAbbreviation(points, 'number', { locale: locale })}</p>
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
          statisticData?.integrations
            .filter(item => item.status === 'published')
            .map(integration => (
              <StatisticsCard
                key={integration.id}
                id={integration.id}
                views={integration.views}
                campaign={integration.campaign}
                points={integration.income}
                futureStatistics={integration.future_statistics}
                lastUpdatedAt={integration.updated_at}
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
