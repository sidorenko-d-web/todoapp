import React  from 'react';
import styles from './IntegrationStats.module.scss';
import subscribersIcon from '../../../assets/icons/subscribers.png';
import viewsIcon from '../../../assets/icons/views.png';
import coinIcon from '../../../assets/icons/coin.png';
import { formatAbbreviation } from '../../../helpers';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { useTranslation } from 'react-i18next';
import { useIncrementingIntegrationStats } from '../../../hooks/useIncrementingIntegrationStats.ts';
import { usePushLineStatus } from '../../../hooks/index.ts';

interface IntegrationStatsProps {
  subscribers: number;
  views: number;
  income: string;
  futureStatistics?: {
    subscribers: number;
    views: number;
    income: string;
  };
  lastUpdatedAt?: string;
}

export const IntegrationStats: React.FC<IntegrationStatsProps> = ({
                                                                    subscribers: initialSubscribers,
                                                                    views: initialViews,
                                                                    income: initialIncome,
                                                                    futureStatistics,
                                                                    lastUpdatedAt
                                                                  }) => {
  const { t, i18n } = useTranslation('integrations');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const elevateStats = useSelector((state: RootState) => state.guide.elevateIntegrationStats);

  const integrationId = window.location.pathname.split('/').pop() || '';
  const {in_streak} = usePushLineStatus()

  // Use the custom hook for incrementing stats
  const { subscribers: displayedSubscribers, views: displayedViews, income: displayedIncome } = useIncrementingIntegrationStats({
    integrationId,
    baseSubscribers: initialSubscribers,
    baseViews: initialViews,
    baseIncome: initialIncome,
    futureStatistics,
    lastUpdatedAt
  });

  const subscribers = in_streak ? displayedSubscribers : initialSubscribers;
  const views = in_streak ? displayedViews : initialViews;
  const income = in_streak ? displayedIncome : initialIncome;

  return (
    <div className={styles.IntegrationStatsWrp}>
      <div className={`${styles.IntegrationStat} ${elevateStats ? styles.elevated : ''}`}>
        <p className={styles.amount}>{formatAbbreviation(Math.floor(subscribers), 'number', {locale: locale})}</p>
        <div className={styles.typeWrp}>
          <img src={subscribersIcon} width={14} height={14} alt="Subscribers"/>
          <p className={styles.type}>{t('i5')}</p>
        </div>
      </div>
      <div className={`${styles.IntegrationStat} ${elevateStats ? styles.elevated : ''}`}>
        <p className={styles.amount}>{formatAbbreviation(Math.floor(views), 'number', {locale: locale})}</p>
        <div className={styles.typeWrp}>
          <img src={viewsIcon} width={14} height={14} alt="Views"/>
          <p className={styles.type}>{t('i6')}</p>
        </div>
      </div>
      <div className={`${styles.IntegrationStat} ${elevateStats ? styles.elevated : ''}`}>
        <p className={styles.amount}>{formatAbbreviation(income, 'number', {locale: locale})}</p>
        <div className={styles.typeWrp}>
          <img src={coinIcon} width={14} height={14} alt="Income"/>
          <p className={styles.type}>{t('i7')}</p>
        </div>
      </div>
    </div>
  );
};