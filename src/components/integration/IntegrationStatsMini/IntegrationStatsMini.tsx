import React from 'react';

import styles from './IntegrationStatsMini.module.scss';

import coin from '../../../assets/icons/coin.png';
import viewsIcon from '../../../assets/icons/views.png';
import subscribersIcon from '../../../assets/icons/subscribers.png';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../../../constants';
import { formatAbbreviation } from '../../../helpers';
import { TrackedButton } from '../..';
import { useTranslation } from 'react-i18next';
import { useIncrementingIntegrationStats } from '../../../hooks/useIncrementingIntegrationStats.ts';
import { usePushLineStatus } from '../../../hooks';

interface IntegrationStatsMiniProps {
  views: number;
  subscribers: number;
  income: string;
  futureStatistics?: {
    subscribers: number;
    views: number;
    income: string;
  };
  lastUpdatedAt?: string;
}

export const IntegrationStatsMini: React.FC<IntegrationStatsMiniProps> = ({
                                                                            subscribers: initialSubscribers,
                                                                            views: initialViews,
                                                                            income: initialIncome,
                                                                            futureStatistics,
                                                                            lastUpdatedAt
                                                                          }) => {

  const navigate = useNavigate();
  const { i18n } = useTranslation('integrations');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const integrationId = window.location.pathname.split('/').pop() || '';

  const {in_streak} = usePushLineStatus()

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
    <div className={styles.statsUnderTitleWrp}>
      <div className={styles.toCenterStats} />
      <div className={styles.statsUnderTitle}>
        <div className={styles.topStats}>
          <div className={styles.statWrp}>
            <p className={styles.stat}>{formatAbbreviation(views, 'number', { locale: locale })}</p>
            <img src={viewsIcon} height={18} width={18} alt="" />
          </div>
          <div className={styles.statWrp}>
            <p className={styles.stat}>{formatAbbreviation(subscribers, 'number', { locale: locale })}</p>
            <img src={subscribersIcon} height={18} width={18} alt="" />
          </div>
          <div className={styles.statWrp}>
          <p className={styles.stat}>+ {formatAbbreviation(income, 'number', { locale: locale })}</p>
          <img src={coin} height={18} width={18} alt="" />
        </div>
        </div>
      </div>
      <TrackedButton trackingData={{ eventType: 'button', eventPlace: 'К статистике - Интеграции' }}
                     onClick={() => navigate(AppRoute.Statistics)} className={styles.seeStatsButton}></TrackedButton>
    </div>
  );
};