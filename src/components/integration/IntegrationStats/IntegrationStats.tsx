import React from "react";

import styles from './IntegrationStats.module.scss';

import subscribersIcon from '../../../assets/icons/subscribers.svg';
import viewsIcon from '../../../assets/icons/views.svg';
import coinIcon from '../../../assets/icons/coin.svg';

interface IntegrationStatsProps {
    subscribers: number;
    views: number;
    income: string;
}

export const IntegrationStats: React.FC<IntegrationStatsProps> = ({subscribers, views, income}) => {
    return (
        <div className={styles.IntegrationStatsWrp}>
            <div className={styles.IntegrationStat}>
                <p className={styles.amount}>{subscribers}</p>
                <div className={styles.typeWrp}>
                    <img src={subscribersIcon} />
                    <p className={styles.type}>  Подписчики</p>
                </div>
            </div>
            <div className={styles.IntegrationStat}>
                <p className={styles.amount}>{views}</p>
                <div className={styles.typeWrp}>
                    <img src={viewsIcon} />
                    <p className={styles.type}>Просмотры</p>
                </div>
            </div>
            <div className={styles.IntegrationStat}>
                <p className={styles.amount}>{income}</p>
                <div className={styles.typeWrp}>
                    <img src={coinIcon} />
                    <p className={styles.type}>Доход</p>
                </div>
            </div>
        </div>
    );
}