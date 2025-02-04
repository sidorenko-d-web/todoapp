import React from 'react';

import classNames from 'classnames';

import s from './ReferralCard.module.scss';
import subscribersIcon from '../../../assets/icons/subscribers.png';

import profileIconPlaceholder from '../../../assets/icons/referral-icon-placeholder.svg';

interface ReferralCardProps {
  position: number;
  name: string;
  total_invited: number;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({ position, name, total_invited }) => {
  return (
    <>
      <div className={s.userCard}>
        <div className={s.userCardTop}>
          <div className={s.infoUser}>
            <div className={s.userCardAvatar}>
              <img src={profileIconPlaceholder} width={17.5} height={24} />
            </div>
            <div className={classNames(s.userCardUsername, s.text)}>{name}</div>
          </div>
          <div className={classNames(s.userCardRank, s.text)}>{`#${position}`}</div>
        </div>
        <div className={s.userCardBottom}>
          <div className={s.userCardBonus}>
                        <span className={s.badge}>
                            +120 <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
                        </span>
            <span className={classNames(s.level, s.text)}>1ур.</span>
          </div>
          <div className={s.userCardBonus}>
                        <span className={s.badge}>
                            +40 <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
                        </span>
            <span className={classNames(s.level, s.text)}>2ур.</span>
          </div>
          <button className={classNames(s.userCardRefs, s.text)}>
            {`(ещё ${total_invited} реф.)`}
          </button>
        </div>
      </div>
    </>
  );
};