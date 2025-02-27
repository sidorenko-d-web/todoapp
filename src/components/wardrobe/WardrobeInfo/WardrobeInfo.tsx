import React from 'react';
import styles from './WardrobeInfo.module.scss';
import { Link } from 'react-router-dom';

import skinPlaceholder from '../../../assets/icons/skin-placeholder.svg';
import statusInactive from '../../../assets/icons/status-inactive.svg';
import { useGetInventorySkinsQuery } from '../../../redux/api/inventory/api';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared';

export const WardrobeInfo: React.FC = () => {
  const { t } = useTranslation('wardrobe');
  const { data, isLoading, error } = useGetInventorySkinsQuery();

  return (
    <>
      {isLoading && <p>Loading...</p>}

      {error && <p>Error loading profile data</p>}

      {data && (
        <div className={styles.wrp}>
          <Link to="/profile">
            <Button className={styles.backBtn} />
          </Link>

          <div className={styles.infoWrp}>
            <h1 className={styles.title}>{t('w1')}</h1>
            <div className={styles.statsWrp}>
              <div className={styles.statWrp}>
                <span className={styles.stat}>{data.count}</span>
                <img src={skinPlaceholder} width={14} height={14} />
              </div>

              <div className={styles.statusWrp}>
                <span className={styles.status}>{t('w2')}</span>
                <img src={statusInactive} height={14} width={14} />
              </div>
            </div>
          </div>

          <div className={styles.toCenterInfo} />
        </div>
      )}
    </>
  );
};
