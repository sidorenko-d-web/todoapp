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


interface IntegrationStatsMiniProps {
  views: number;
  subscribers: number;
  income: string;
}


export const IntegrationStatsMini: React.FC<IntegrationStatsMiniProps> = ({ views, subscribers, income }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation('integrations');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  return (
    <div className={styles.statsUnderTitleWrp}>
      <div className={styles.toCenterStats} />
      <div className={styles.statsUnderTitle}>
        <div className={styles.statWrp}>
          <p className={styles.stat}>{formatAbbreviation(views, 'number', {locale:locale})}</p>
          <img src={viewsIcon} height={14} width={14} alt="" />
        </div>
        <div className={styles.statWrp}>
          <p className={styles.stat}>{formatAbbreviation(subscribers, 'number', {locale:locale})}</p>
          <img src={subscribersIcon} height={14} width={14} alt="" />
        </div>
        <div className={styles.statWrp}>
          <p className={styles.stat}>+ {formatAbbreviation(income, 'number', {locale:locale})}</p>
          <img src={coin} height={14} width={14} alt="" />
        </div>
      </div>
      <TrackedButton trackingData={{eventType: 'button', eventPlace: 'К статистике - Интеграции'}} onClick={() => navigate(AppRoute.Statistics)} className={styles.seeStatsButton}></TrackedButton>
    </div>
  );
};