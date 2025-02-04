import { useEffect, useState } from 'react';
import s from './Tree.module.scss';
import classNames from 'classnames';
import tickCircle from '../../assets/icons/tickCircle.svg';
import circle from '../../assets/icons/circle.svg';
import gift from '../../assets/icons/gift.svg';

export const Tree = () => {
  const [currentLevel, setCurrentLevel] = useState(5);
  const [progress, setProgress] = useState(0);

  const maxProgressPerLevel = 100;

  useEffect(() => {
    if (progress < maxProgressPerLevel) {
      const timer = setTimeout(() => {
        setProgress((prev) => Math.min(prev + 2, maxProgressPerLevel));
      }, 30);

      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div className={s.container}>
      <div className={s.progressBar}>
        <div
          className={s.progressFill}
          style={{ height: `${(progress / maxProgressPerLevel) * 45}%` }}
        />
        <div className={s.levelMarker} style={{ bottom: '20%' }}>
          <div className={classNames(s.levelCircle, { [s.active]: progress >= maxProgressPerLevel })}>
            {progress >= maxProgressPerLevel
              ? <img src={tickCircle} height={16} width={16} alt="tickCircle" />
              : <img src={circle} height={16} width={16} alt="circle" />}{' '}
            {currentLevel}
          </div>
        </div>
        <div className={s.levelMarker} style={{ bottom: '80%' }}>
          <div className={s.levelCircle}>
            <div className={s.imgPrize}>
              <div className={s.blur}/>
              <img src={gift} height={20} width={20} alt="gift" />
            </div>
            <div className={s.prize}>
              <p className={s.text}>1000<br/>
                подписчиков</p>
            </div>
            <img src={circle} height={16} width={16} alt="circle" /> {currentLevel + 1}
          </div>
        </div>
      </div>
    </div>
  );
};