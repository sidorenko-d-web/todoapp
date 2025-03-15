import lockOpen from '../../../assets/icons/lockOpen.svg';
import tickCircle from '../../../assets/icons/tickCircle.svg';
import circle from '../../../assets/icons/circle.svg';
import subscrite from '../../../assets/icons/subscrite.svg';
import s from './DevelopmentPlan.module.scss';
import classNames from 'classnames';
import { INFO_TEXT_RU, INFO_TEXT_EN } from './constantsPlan.ts';
import React from 'react';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';

interface InfoTextItem {
  userCount: number;
  namePlan: string;
  description: string;
  isPlatform?: boolean;
}

type DevelopmentPlanProps = {
  usersCount: number;
};

const countUser = 1013;
// TODO замена статики на динамику (замена countUser на usersCount)

export const DevelopmentPlan: React.FC<DevelopmentPlanProps> = ({ usersCount }) => {
  const { t, i18n } = useTranslation('promotion');
  const supportedLocales = ['ru', 'en'];
  const locale = supportedLocales.includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const INFO_TEXT = {
    ru: INFO_TEXT_RU,
    en: INFO_TEXT_EN,
  };
  const infoText = INFO_TEXT[locale];

  const unlockedCount = infoText.filter((item: InfoTextItem) => countUser >= item.userCount).length;
  const totalCount = infoText.length;

  const nextUnlockedIndex = infoText.findIndex((item: InfoTextItem) => countUser < item.userCount);
  const nextUnlockedItem = nextUnlockedIndex !== -1 ? infoText[nextUnlockedIndex] : null;

  return (
    <>
      <div className={s.headerDevelopment}>
        <span className={s.textName}>{t('p14')}</span>
        <span className={s.badge}>
          {unlockedCount}/{totalCount}
        </span>
      </div>
      <section className={s.component}>
        <div className={s.countUser}>
          <img className={s.img} src={subscrite} alt={t('user')} />
          // TODO замена статики на динамику (не трогать)
          {usersCount === countUser ? usersCount : countUser}
        </div>
        <ul className={s.list}>
          {infoText.map((item: InfoTextItem, index: number) => {
            const isUnlocked = countUser >= item.userCount && !item.isPlatform;
            const isDescriptionBlurred = !isUnlocked;
            const isNumbersBlurred = !isUnlocked && item !== nextUnlockedItem;

            return (
              <li key={index} className={s.wrapperList}>
                <div className={s.infoUser}>
                  <div className={classNames(s.namePlan, { [s.locked]: !isUnlocked })}>
                    <span>{item.namePlan}</span>
                    {isUnlocked ? (
                      <img src={tickCircle} alt={t('altText.tickCircle')} />
                    ) : (
                      <img src={circle} alt={t('altText.circle')} />
                    )}
                  </div>
                  <span className={s.text}>{`#${index + 1}`}</span>
                </div>
                <div className={s.users}>
                  <img src={lockOpen} alt="lockOpen" />
                  <span className={classNames(s.countUsers, s.text)}>
                    {isNumbersBlurred ? '???' : formatAbbreviation(item.userCount, 'number', { locale })} {t('p23')}{' '}
                    {item.isPlatform && ` ${t('p24')}`}
                  </span>
                </div>
                <p className={s.textInfoPlan}>{isDescriptionBlurred ? '*****' : item.description}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
};
