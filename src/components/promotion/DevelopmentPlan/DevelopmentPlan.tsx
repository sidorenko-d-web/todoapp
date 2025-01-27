import lockOpen from '../../../assets/icons/lockOpen.svg';
import tickCircle from '../../../assets/icons/tickCircle.svg';
import s from './DevelopmentPlan.module.scss';
import classNames from 'classnames';
import { INFO_TEXT } from './constantsPlan.ts';

export const DevelopmentPlan = () => {
  return (
    <>
      <div className={s.headerDevelopment}>
        <span className={s.textName}>План развития Apusher</span>
        <span className={s.badge}>2/11</span>
      </div>
      <section className={s.component}>
        <ul className={s.list}>
          {INFO_TEXT.map((item) =>
            item.closed ? (
              <li key={item.id} className={s.wrapperList}>
                <div className={s.infoUser}>
                  <h3 className={s.namePlan}>
                    <span>{item.namePlan}</span>
                    <img src={tickCircle} height={17} width={17} alt="tickCircle" />
                  </h3>
                  <span className={s.text}>{item.number}</span>
                </div>
                <div className={s.users}>
                  <img src={lockOpen} height={14} width={14} alt="lockOpen" />
                  <span className={classNames(s.countUsers, s.text)}>
              {item.userCount} пользователей
            </span>
                </div>
                <p className={s.textInfoPlan}>{item.description}</p>
              </li>
            ) : (
              <li key={item.id} className={s.wrapperList}>
                <div className={s.headerPlan}>
                  <div className={s.topRow}>
                    <span className={s.title}>{item.namePlan}</span>
                    <div className={s.circle}>
                      <input className={s.inputRadio} type="radio" />
                    </div>
                  </div>
                  <p className={s.text}>{item.number}</p>
                </div>
                <div className={s.userBlock}>
                  <img src={lockOpen} height={14} width={14} alt="lockOpen" />
                  <span className={s.userCount}>{item.userCount} пользователей</span>
                </div>
                <p className={s.info}>{item.description}</p>
              </li>
            ),
          )}
        </ul>
      </section>
    </>
  );
};
