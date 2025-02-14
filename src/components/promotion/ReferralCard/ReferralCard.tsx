import React from 'react';

import classNames from 'classnames';

import s from './ReferralCard.module.scss';
import subscribersIcon from '../../../assets/icons/subscribers.png';
import fireBlueIcon from '../../../assets/icons/fire-blue.svg';
import fireGrayIcon from '../../../assets/icons/fire-gray.svg';
import infoIcon from '../../../assets/icons/info.svg';
import infoRedIcon from '../../../assets/icons/info-red.svg';

import profileIconPlaceholder from '../../../assets/icons/referral-icon-placeholder.svg';
import { formatAbbreviation } from '../../../helpers';
import { Button } from '../../shared';
import { useTranslation } from 'react-i18next';

interface ReferralCardProps {
  position: number;
  name: string;
  total_invited: number;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({ position, name, total_invited }) => {
  const { t, i18n } = useTranslation('promotion');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  // TODO: Добавить логику когда она будет на бэке
  const streak = 12;
  const daysOff = position - 1;

  return (
    <>
      <div className={s.userCard}>
        <div className={s.userCardTop}>
          <div className={s.infoUser}>
            <div className={s.userCardAvatar}>
              <img src={profileIconPlaceholder} width={17.5} height={24} />
            </div>
            <div className={s.nameAndStreakWrapper}>
              <span className={s.text}>{name}</span>
              <div className={s.streakWrapper}>
                <span className={s.streakBadge}>{streak} <img src={daysOff > 0 ? fireGrayIcon : fireBlueIcon} width={12}
                                                              height={12} alt={'Streak'} /></span>
                {daysOff > 0 &&
                  <span className={classNames(s.streakBadge, daysOff > 1 ? s.notInDays : s.notToday)}>{daysOff > 1 ? (
                    <>
                      <img src={infoIcon} width={12} height={12} alt="Info" /> {t("p52")}
                    </>
                  ) : `${t("p52")} :/`}</span>}
              </div>
            </div>
          </div>
          <div className={classNames(s.userCardRank, s.text)}>{`#${position}`}</div>
        </div>
        <div className={s.userCardBottom}>
          <div className={s.userCardBonus}>
                        <span className={s.badge}>
                            +{formatAbbreviation(120, 'number', {locale: locale})} <img src={subscribersIcon} height={14} width={14}
                                                            alt="Подписчики" />
                        </span>
            <span className={classNames(s.level, s.text)}>1{t('p4')}.</span>
          </div>
          <div className={s.userCardBonus}>
                        <span className={s.badge}>
                            +{formatAbbreviation(40, 'number', {locale: locale})} <img src={subscribersIcon} height={14} width={14}
                                                           alt="Подписчики" />
                        </span>
            <span className={classNames(s.level, s.text)}>2{t('p4')}.</span>
          </div>
          <Button className={classNames(s.userCardRefs, s.text)}>
            {`(${t("p54")} ${total_invited} ${t("p55")}.)`}
          </Button>
        </div>
        {daysOff > 1 && (
          <div className={s.streakWarningWrapper}>
            <span className={classNames(s.streakBadge, s.warning)}>
              <img
                src={infoRedIcon}
                width={12}
                height={12}
                alt="Info"
              /> {t('p56')}
            </span>
            <Button className={s.warningButton}>{t('p57')}</Button>
          </div>
        )}
      </div>
    </>
  );
};