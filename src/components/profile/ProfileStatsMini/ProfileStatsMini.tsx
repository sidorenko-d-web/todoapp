import React from 'react';

import styles from './ProfileStatsMini.module.scss';

import clanIcon from '../../../assets/icons/clan-red.svg';
import subscriberIcon from '../../../assets/icons/subscribers.png';
import viewsIcon from '../../../assets/icons/views.png';
import fireIcon from '../../../assets/icons/fire-red.svg';
import { Link } from 'react-router-dom';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared';

interface ProfileStatsMiniProps {
  subscribers: number;
  daysInARow: number;
  position: number;
  onlyBadges?: boolean;
  totalViews: number
}

export const ProfileStatsMini: React.FC<ProfileStatsMiniProps> = ({
                                                                    subscribers,
                                                                    daysInARow,
                                                                    position,
                                                                    onlyBadges,
                                                                    totalViews,
                                                                  }) => {
  const {  i18n } = useTranslation('shop');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  return (
    <div className={styles.wrp + ' ' + (onlyBadges ? styles.justifyCenter : '')}>
      {!onlyBadges && <div className={styles.toCenterStats} />}

      <div className={styles.statsWrp}>
        <div className={styles.statWrp}>
          <p className={styles.stat}>{`#${position}`}</p>
          <img src={clanIcon} width={14} height={14} />
        </div>

        <div className={styles.statWrp}>
          <span className={styles.stat}>{formatAbbreviation(subscribers,'number', { locale: locale })}</span>
          <img src={subscriberIcon} width={14} height={14} />
        </div>

        <div className={styles.statWrp}>
          <span className={styles.stat}>{formatAbbreviation(totalViews,'number', { locale: locale })}</span>
          <img src={viewsIcon} width={14} height={14} />
        </div>

        <div className={styles.statWrp}>
          <p className={styles.stat}>{daysInARow}</p>
          <img src={fireIcon} width={14} height={14} />
        </div>
      </div>

      {!onlyBadges && (
        <Link to={'../wardrobe'}>
          <Button onClick={() => {}} className={styles.wardrobeButton}/>
        </Link>
      )}
    </div>
  );
};