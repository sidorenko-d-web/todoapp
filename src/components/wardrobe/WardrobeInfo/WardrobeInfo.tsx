import React from 'react';
import styles from './WardrobeInfo.module.scss';
import { Link } from 'react-router-dom';

import skinPlaceholder from '../../../assets/icons/skin-placeholder.svg';
import statusInactive from '../../../assets/icons/status-inactive.svg';
import { useGetInventorySkinsQuery } from '../../../redux/api/inventory/api';
import { Button } from '../../shared';

export const WardrobeInfo: React.FC = () => {

    const { data, isLoading, error } = useGetInventorySkinsQuery();


    return (
        <>
            {isLoading && <p>Загрузка...</p>}

            {error && <p>Ошибка при загрузке данных профиля</p>}

            {data && <div className={styles.wrp}>
                <Link to='/profile'>
                    <Button className={styles.backBtn} />
                </Link>

                <div className={styles.infoWrp}>
                    <h1 className={styles.title}>Гардероб</h1>
                    <div className={styles.statsWrp}>
                        <div className={styles.statWrp}>
                            <span className={styles.stat}>{data.count}</span>
                            <img src={skinPlaceholder} width={14} height={14} />
                        </div>

                        <div className={styles.statusWrp}>
                            <span className={styles.status}>без статуса</span>
                            <img src={statusInactive} height={14} width={14} />
                        </div>
                    </div>
                </div>

                <div className={styles.toCenterInfo} />
            </div>}
        </>
    )
}