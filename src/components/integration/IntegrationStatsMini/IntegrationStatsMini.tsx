import React from 'react';

import styles from './IntegrationStatsMini.module.scss';

import coin from '../../../assets/icons/coin.svg';
import viewsIcon from '../../../assets/icons/views.svg';
import subscribersIcon from '../../../assets/icons/subscribers.svg';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../../../constants';


interface IntegrationStatsMiniProps {
    views: number;
    subscribers: number;
    income: string;
}


export const IntegrationStatsMini:React.FC<IntegrationStatsMiniProps> = ({views, subscribers, income}) => {
  const navigate = useNavigate();
  return (
        <div className={styles.statsUnderTitleWrp}>
            <div className={styles.toCenterStats} />
            <div className={styles.statsUnderTitle}>
                <div className={styles.statWrp}>
                    <p className={styles.stat}>{views}</p>
                    <img src={viewsIcon} height={14} width={14} alt=''/>
                </div>
                <div className={styles.statWrp}>
                    <p className={styles.stat}>{subscribers}</p>
                    <img src={subscribersIcon} height={14} width={14} alt=''/>
                </div>
              <div className={styles.statWrp}>
                <p className={styles.stat}>+ {income}</p>
                <img src={coin} height={14} width={14} alt="" />
                </div>
            </div>
            <button onClick={() => navigate(AppRoute.Statistics)} className={styles.seeStatsButton}></button>
        </div>
    )
}