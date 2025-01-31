import lockOpen from '../../../assets/icons/lockOpen.svg';
import tickCircle from '../../../assets/icons/tickCircle.svg';
import circle from '../../../assets/icons/circle.svg';
import s from './DevelopmentPlan.module.scss';
import classNames from 'classnames';
import { INFO_TEXT } from './constantsPlan.ts';
import React from 'react';

type DevelopmentPlanProps = {
  usersCount: number;
};

export const DevelopmentPlan: React.FC<DevelopmentPlanProps> = ({ usersCount }) => {
  const unlockedCount = INFO_TEXT.filter((item) => usersCount >= item.userCount).length;
  const totalCount = INFO_TEXT.length;

  return (
    <>
      <div className={s.headerDevelopment}>
        <span className={s.textName}>План развития Apusher</span>
        <span className={s.badge}>{unlockedCount}/{totalCount}</span>
      </div>
      <section className={s.component}>
        <ul className={s.list}>
          {INFO_TEXT.map((item, index) => {
            const isUnlocked = usersCount >= item.userCount && !item.isPlatform;

            return (
              <li key={index} className={s.wrapperList}>
                <div className={s.infoUser}>
                <div
                  className={classNames(s.namePlan, {
                    [s.locked]: !isUnlocked,
                  })}
                >
                    <span>{item.namePlan}</span>
                    {isUnlocked && <img src={tickCircle} height={17} width={17} />}
                    {!isUnlocked && <img src={circle} height={17} width={17} />}
                  </div>
                  <span className={s.text}>{`#${index+1}`}</span>
                </div>
                <div className={s.users}>
                  <img src={lockOpen} height={14} width={14} alt="lockOpen" />
                  <span className={classNames(s.countUsers, s.text)}>{item.userCount} пользователей {item.isPlatform && ' на платформе'}</span>
                </div>
                <p className={s.textInfoPlan}>{isUnlocked ? item.description : '*****'}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
};
