import React from 'react';

import styles from './IntegrationStats.module.scss';

import subscribersIcon from '../../../assets/icons/subscribers.png';
import viewsIcon from '../../../assets/icons/views.png';
import coinIcon from '../../../assets/icons/coin.png';
import { formatAbbreviation } from '../../../helpers';

interface IntegrationStatsProps {
    subscribers: number;
    views: number;
    income: string;
}

export const IntegrationStats: React.FC<IntegrationStatsProps> = ({subscribers, views, income}) => {
    return (
        <div className={styles.IntegrationStatsWrp}>
            <div className={styles.IntegrationStat}>
                <p className={styles.amount}>{formatAbbreviation(subscribers)}</p>
                <div className={styles.typeWrp}>
                    <img src={subscribersIcon} width={12} height={12}/>
                    <p className={styles.type}>Подписчики</p>
                </div>
            </div>
            <div className={styles.IntegrationStat}>
                <p className={styles.amount}>{formatAbbreviation(views)}</p>
                <div className={styles.typeWrp}>
                    <img src={viewsIcon} width={12} height={12}/>
                    <p className={styles.type}>Просмотры</p>
                </div>
            </div>
            <div className={styles.IntegrationStat}>
                <p className={styles.amount}>{formatAbbreviation(income)}</p>
                <div className={styles.typeWrp}>
                    <img src={coinIcon} width={12} height={12}/>
                    <p className={styles.type}>Доход</p>
                </div>
            </div>
        </div>
    );
}