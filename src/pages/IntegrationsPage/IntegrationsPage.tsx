import React from 'react';

import styles from './IntegrationsPage.module.scss';

import subscribersIcon from '../../assets/icons/subscribers.svg';
import viewsIcon from '../../assets/icons/views.svg';
import coinIcon from '../../assets/icons/coin.svg';
import brilliantIcon from '../../assets/icons/integration_brilliant.svg';

import { IntegrationComment } from '../../components/integrations/IntegrationComment';

const commentsData = [
    { id: '1', username: 'user1', comment: 'comment text 1', isPositive: true, level: 0, reward: 100 },
    { id: '2', username: 'user2', comment: 'comment text 2', isPositive: false, level: 2, reward: 200 },
    { id: '3', username: 'user3', comment: 'comment text 3', isPositive: true, level: 3, reward: 300 },
    { id: '4', username: 'user4', comment: 'comment text 4', isPositive: false, level: 4, reward: 400 },
    { id: '5', username: 'user5', comment: 'comment text 5', isPositive: true, level: 5, reward: 500 }
];


export const IntegrationsPage: React.FC = () => {
    return (
        <div className={styles.wrp}>
            <h1 className={styles.pageTitle}>Интеграции</h1>
            <div className={styles.statsUnderTitleWrp}>
                <div className={styles.toCenterStats} />
                <div className={styles.statsUnderTitle}>
                    <div className={styles.statWrp}>
                        <p className={styles.stat}>856,754 млн. </p>
                        <img src={viewsIcon} height={12} width={12} />
                    </div>

                    <div className={styles.statWrp}>
                        <p className={styles.stat}>223 567 </p>
                        <img src={subscribersIcon} height={12} width={12} />
                    </div>
                </div>
                <button className={styles.seeStatsButton}></button>
            </div>
            <div className={styles.integrationNameWrp}>
                <p className={styles.integrationTitle}>Интеграция 3</p>
                <div className={styles.integrationLevelWrp}>
                    <p className={styles.integrationLevel}>Brilliant</p>
                    <img src={brilliantIcon} />
                </div>
            </div>

            <div className={styles.integration}>

            </div>

            <div className={styles.integrationStatsWrp}>
                <div className={styles.integrationStat}>
                    <p className={styles.amount}>223 567</p>
                    <div className={styles.typeWrp}>
                        <img src={subscribersIcon} />
                        <p className={styles.type}>  Подписчики</p>
                    </div>
                </div>
                <div className={styles.integrationStat}>
                    <p className={styles.amount}>856,754 млн.</p>
                    <div className={styles.typeWrp}>
                        <img src={viewsIcon} />
                        <p className={styles.type}>Просмотры</p>
                    </div>
                </div>
                <div className={styles.integrationStat}>
                    <p className={styles.amount}>223 567</p>
                    <div className={styles.typeWrp}>
                        <img src={coinIcon} />
                        <p className={styles.type}>Доход</p>
                    </div>
                </div>
            </div>
            <div className={styles.commentsSectionTitleWrp}>
                <p className={styles.commentsSectionTitle}>Комментарии</p>
                <p className={styles.commentsAmount}>{commentsData.length}/20</p>
            </div>

            <div className={styles.commentsWrp}>
                {commentsData.map(comment => (
                    <IntegrationComment key={comment.id} {...comment} />
                ))}
            </div>

        </div>);
}