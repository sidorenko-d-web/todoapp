import React from 'react';

import styles from './IntegrationStats.module.scss';

import subscribersIcon from '../../../assets/icons/subscribers.png';
import viewsIcon from '../../../assets/icons/views.png';
import coinIcon from '../../../assets/icons/coin.png';
import { formatAbbreviation } from '../../../helpers';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { useTranslation } from 'react-i18next';

interface IntegrationStatsProps {
    subscribers: number;
    views: number;
    income: string;
}

export const IntegrationStats: React.FC<IntegrationStatsProps> = ({subscribers, views, income}) => {
  const { t, i18n } = useTranslation('integrations');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
    const elevateStats = useSelector((state: RootState) => state.guide.elevateIntegrationStats);

    return (
        <div className={styles.IntegrationStatsWrp}>
            <div className={`${styles.IntegrationStat} ${elevateStats ? styles.elevated : ''}`}>
                <p className={styles.amount}>{formatAbbreviation(subscribers, 'number', {locale: locale})}</p>
                <div className={styles.typeWrp}>
                    <img src={subscribersIcon} width={12} height={12}/>
                    <p className={styles.type}>{t('i5')}</p>
                </div>
            </div>
            <div className={`${styles.IntegrationStat} ${elevateStats ? styles.elevated : ''}`}>
                <p className={styles.amount}>{formatAbbreviation(views, 'number', {locale: locale})}</p>
                <div className={styles.typeWrp}>
                    <img src={viewsIcon} width={12} height={12}/>
                    <p className={styles.type}>{t('i6')}</p>
                </div>
            </div>
            <div className={`${styles.IntegrationStat} ${elevateStats ? styles.elevated : ''}`}>
                <p className={styles.amount}>{formatAbbreviation(income, 'number', {locale: locale})}</p>
                <div className={styles.typeWrp}>
                    <img src={coinIcon} width={12} height={12}/>
                    <p className={styles.type}>{t('i7')}</p>
                </div>
            </div>
        </div>
    );
}