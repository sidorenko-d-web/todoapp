import React from 'react';

import styles from './IntegrationsPage.module.scss';

export const IntegrationsPage: React.FC = () => {
    return (
        <div className={styles.wrp}>
            <h1 className={styles.pageTitle}>Интеграции</h1>
            <div className={styles.statsUnderTitleWrp}>
                <div className={styles.toCenterStats}/>
                <div className={styles.statsUnderTitle}>
                    <p className={styles.stat}>856,754 млн.</p>
                    <p className={styles.stat}>223 567</p>
                </div>
                <button className={styles.seeStatsButton}></button>
            </div>
            <div className={styles.integrationNameWrp}>
                <p className={styles.integrationTitle}>Интеграция 3</p>
                <p className={styles.integrationLevel}>Brilliant</p>
            </div>

            <div className={styles.integration}>

            </div>

            <div className={styles.integrationStatsWrp}>
                <div className={styles.integrationStat}>
                    <p className={styles.amount}>223 567</p>
                    <p className={styles.type}>Подписчики</p>
                </div>
                <div className={styles.integrationStat}>
                    <p className={styles.amount}>856,754 млн.</p>
                    <p className={styles.type}>Просмотры</p>
                </div>
                <div className={styles.integrationStat}>
                    <p className={styles.amount}>223 567</p>
                    <p className={styles.type}>Доход</p>
                </div>
            </div>
        </div>);
}