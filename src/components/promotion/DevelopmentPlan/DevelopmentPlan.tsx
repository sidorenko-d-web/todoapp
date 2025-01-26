import lockOpen from '../../../assets/icons/lockOpen.svg';
import tickCircle from '../../../assets/icons/tickCircle.svg';
import s from './DevelopmentPlan.module.scss';
import classNames from 'classnames';

export const DevelopmentPlan = () => {
  return (
    <>
      <div className={s.headerDevelopment}>
        <span className={s.textName}>План развития Apusher</span>
        <span className={s.badge}>2/11</span>
      </div>
      <section className={s.component}>
        <ul className={s.list}>
          <li className={s.wrapperList}>
            <div className={s.infoUser}>
              <h3 className={s.namePlan}><span>Добро пожаловать!</span> <img src={tickCircle} height={17} width={17}
                                                                             alt="tickCircle" /></h3>
              <span className={s.text}>#1</span>
            </div>
            <div className={s.users}>
              <img src={lockOpen} height={14} width={14} alt="lockOpen" />
              <span className={classNames(s.countUsers, s.text)}>250 пользователей</span>
            </div>
            <p className={s.textInfoPlan}>
              Welcome-бонус: 500 баллов каждому новому пользователю. Приобретите подписку в Apusher и оборудование,
              чтобы сделать свою первую интеграцию! Доступ к магазину для покупки первого оборудования и базовых
              улучшений комнаты.
            </p>
          </li>
        </ul>
        <ul className={s.list}>
          <li className={s.wrapperList}>
            <div className={s.topRow}>
                <span className={s.title}>
                  Новые скины и уникальная кампания от Apusher!
                </span>
              <input className={s.inputRadio} type="radio" />
            </div>
            <div className={s.userBlock}>
              <img src={lockOpen} height={14} width={14} alt="lockOpen" />
              <span className={s.userCount}>10&nbsp;000 пользователей</span>
            </div>
            <p className={s.info}>*****</p>
          </li>
        </ul>
      </section>
    </>
  );
};
