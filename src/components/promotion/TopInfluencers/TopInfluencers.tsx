import cup from '../../../assets/icons/cup.svg';
import chest from '../../../assets/icons/chest-purple.svg';
import { SliderSelect } from './Slider';

import s from './TopInfluencers.module.scss';
import classNames from 'classnames';

export const TopInfluencers = () => {
  return (
    <>
      <h2 className={s.headerInfluencers}>
        <span className={s.textName}>Лучшие инфлюенсеры</span>
        <span className={s.badge}>
          <span>Топ 10 000</span><img src={cup} height={14} width={14} alt="cup" />
        </span>
      </h2>
      <section className={s.wrapperInfo}>
        <SliderSelect />
        <div className={s.contentChest}>
          <div className={s.chestText}>
            <span className={classNames(s.infoName, s.text)}>#345</span>
            <div className={classNames(s.infoName, s.text)}>
              <span>Драгоценный сундук</span>
              <img src={chest} height={14} width={14} alt="chest" />
            </div>
          </div>
          <div className={s.progressBar}>
            <span className={s.progress} style={{ width: '15%' }}></span>
          </div>
        </div>
        <p className={s.textInfo}>
          Войдите в топ #100 инфлюенсеров по количеству подписчиков на этой неделе, чтобы получить Драгоценный сундук!
          <span className={s.textDay}> До выдачи призов осталось 3д.</span>
        </p>
        <button className={classNames(s.buttonContainer, s.text)}>
          Смотреть список
        </button>
      </section>
    </>
  );
};