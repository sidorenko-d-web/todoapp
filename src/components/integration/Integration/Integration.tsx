import React from "react"

import styles from './Integration.module.scss';

import integrationPlaceholder from '../../../assets/icons/integration-placeholder.svg';
import { Room } from "../../main";

export const Integration: React.FC = () => {
    return (
        <div className={styles.integration}>
            <Room mode="me"/>
        </div>
    )
}