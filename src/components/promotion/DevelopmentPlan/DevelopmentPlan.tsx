import lockOpen from '../../../assets/icons/lockOpen.svg';
import tickCircle from '../../../assets/icons/tickCircle.svg';
import circle from '../../../assets/icons/circle.svg';
import s from './DevelopmentPlan.module.scss';
import classNames from 'classnames';
import { INFO_TEXT } from './constantsPlan.ts';
import React from 'react';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';

type DevelopmentPlanProps = {
  usersCount: number;
};

export const DevelopmentPlan: React.FC<DevelopmentPlanProps> = ({ usersCount }) => {
  const { t, i18n } = useTranslation('promotion');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const unlockedCount = INFO_TEXT.filter((item) => usersCount >= item.userCount).length;
  const totalCount = INFO_TEXT.length;

  return (
    <>
      <div className={s.headerDevelopment}>
        <span className={s.textName}>{t("p14")}</span>
        <span className={s.badge}>{unlockedCount}/{totalCount}</span>
      </div>
      <section className={s.component}>
        <ul className={s.list}>
          {INFO_TEXT.map((item, index) => {
            const isUnlocked = usersCount >= item.userCount && !item.isPlatform;
            const isDescriptionUnlocked = index <= 4;

            return (
              <li key={index} className={s.wrapperList}>
                <div className={s.infoUser}>
                  <div
                    className={classNames(s.namePlan, {
                      [s.locked]: !isUnlocked,
                    })}
                  >
                    <span>{item.namePlan}</span>
                    {isUnlocked && <img src={tickCircle}  />}
                    {!isUnlocked && <img src={circle}  />}
                  </div>
                  <span className={s.text}>{`#${index + 1}`}</span>
                </div>
                <div className={s.users}>
                  <img src={lockOpen} alt="lockOpen" />
                  <span
                    className={classNames(s.countUsers, s.text)}>{formatAbbreviation(item.userCount, 'number', {locale: locale})} {t('p23')} {item.isPlatform && ` ${t('p24')}`}</span>
                </div>
                <p className={s.textInfoPlan}>{isDescriptionUnlocked ? item.description : '*****'}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
};
