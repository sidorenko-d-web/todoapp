import React from 'react';

import styles from './ProfileStatsMini.module.scss';

import clanIcon from '../../../assets/icons/clan-red.svg';
import subscriberIcon from '../../../assets/icons/subscribers.svg';
import fireIcon from '../../../assets/icons/fire-red.svg';
import { Link } from "react-router-dom";

interface ProfileStatsMiniProps {
  subscribers: number;
  daysInARow: number;
  position: number;
  onlyBadges?: boolean;
}

export const ProfileStatsMini: React.FC<ProfileStatsMiniProps> = ({
                                                                    subscribers,
                                                                    daysInARow,
                                                                    position,
                                                                    onlyBadges,
                                                                  }) => {
  console.log(styles.wrp + ' ' + (onlyBadges ? styles.justifyCenter : styles.justifyBetween));
  return (
    <div className={styles.wrp + ' ' + (onlyBadges ? styles.justifyCenter : '')}>
      {!onlyBadges && <div className={styles.toCenterStats} />}

      <div className={styles.statsWrp}>
        <div className={styles.statWrp}>
          <p className={styles.stat}>{`#${position}`}</p>
          <img src={clanIcon} width={14} height={14} />
        </div>

        <div className={styles.statWrp}>
          <span className={styles.stat}>{subscribers}</span>
          <img src={subscriberIcon} width={14} height={14} />
        </div>

        <div className={styles.statWrp}>
          <p className={styles.stat}>{daysInARow}</p>
          <img src={fireIcon} width={14} height={14} />
        </div>
      </div>

      {!onlyBadges && (
        <Link to={'../wardrobe'}>
          <div className={styles.wardrobeButton}/>
        </Link>
      )}
    </div>
  );
};