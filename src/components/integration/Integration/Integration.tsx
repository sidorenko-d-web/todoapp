import React from "react"

import styles from './Integration.module.scss';

import integrationPlaceholder from '../../../assets/icons/integration-placeholder.svg';

export const Integration: React.FC = () => {
    return (
        <div className={styles.integration}>
            <img src={integrationPlaceholder} />
        </div>
    )
}