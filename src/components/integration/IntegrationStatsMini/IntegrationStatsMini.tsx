import React from "react"

import styles from './IntegrationStatsMini.module.scss';

import viewsIcon from '../../../assets/icons/views.svg';
import subscribersIcon from '../../../assets/icons/subscribers.svg';


interface IntegrationStatsMiniProps {
    views: number;
    subscribers: number;
}


export const IntegrationStatsMini:React.FC<IntegrationStatsMiniProps> = ({views, subscribers}) => {
    return (
        <div className={styles.statsUnderTitleWrp}>
            <div className={styles.toCenterStats} />
            <div className={styles.statsUnderTitle}>
                <div className={styles.statWrp}>
                    <p className={styles.stat}>{views}</p>
                    <img src={viewsIcon} height={12} width={12} />
                </div>

                <div className={styles.statWrp}>
                    <p className={styles.stat}>{subscribers}</p>
                    <img src={subscribersIcon} height={12} width={12} />
                </div>
            </div>
            <button className={styles.seeStatsButton}></button>
        </div>
    )
}