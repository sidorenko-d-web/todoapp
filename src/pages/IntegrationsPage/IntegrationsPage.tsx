import React from 'react';

import styles from './IntegrationsPage.module.scss';

export const IntegrationsPage: React.FC = () => {
    return (<div>
        <h1 className={styles.pageTitle}>Интеграции</h1>
        <div className={styles.statsUnderTitle}>
            <p>856,754 млн.</p>
            <p>223 567</p>
        </div>
    </div>);
}