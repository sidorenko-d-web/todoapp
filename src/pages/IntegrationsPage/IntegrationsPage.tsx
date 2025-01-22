import React from 'react';

import styles from './IntegrationsPage.module.scss';

export const IntegrationsPage: React.FC = () => {
    return (
    <div className={styles.wrp}>
        <h1 className={styles.pageTitle}>Интеграции</h1>
        <div className={styles.statsUnderTitle}>
            <p className={styles.stat}>856,754 млн.</p>
            <p className={styles.stat}>223 567</p>
        </div>
        <div className={styles.integrationNameWrp}>
            <p className={styles.integrationTitle}>Интеграция 3</p>
            <p className={styles.integrationLevel}>Brilliant</p>
        </div>
    </div>);
}