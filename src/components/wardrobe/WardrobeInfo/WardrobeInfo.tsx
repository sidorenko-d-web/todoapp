import React from 'react';
import styles from './WardrobeInfo.module.scss';
import { Link } from 'react-router-dom';

import skinPlaceholder from '../../../assets/icons/skin-placeholder.svg';
import coin from '../../../assets/icons/coin.svg';
import statusInactive from '../../../assets/icons/status-inactive.svg';

export const WardrobeInfo: React.FC = () => {
    return (
        <div className={styles.wrp}>
            <Link to='/profile'>
                <button className={styles.backBtn}/>
            </Link>

            <div className={styles.infoWrp}>
                <h1 className={styles.title}>Гардероб</h1>
                <div className={styles.statsWrp}>
                    <div className={styles.statWrp}>
                        <span className={styles.stat}>12</span>
                        <img src={skinPlaceholder} width={14} height={14}/>
                    </div>

                    <div className={styles.statWrp}>
                        <span className={styles.stat}>+1</span>
                        <img src={coin} width={14} height={14}/>
                        <span className={styles.stat}>/сек</span>
                    </div>
                </div>

                <div className={styles.statusWrp}>
                    <span className={styles.status}>без статуса</span>
                    <img src={statusInactive} height={14} width={14}/>
                </div>
            </div>

            <div className={styles.toCenterInfo}/>
        </div>
    )
}