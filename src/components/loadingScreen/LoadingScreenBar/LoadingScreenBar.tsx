import { FC, useEffect, useState } from 'react';
import rocketIcon from '../../../assets/icons/rocket.svg';
import s from './LoadingScreenBar.module.scss';

import { useTranslation } from 'react-i18next';

const initialTime = 800;

export const LoadingScreenBar: FC<{ onLoadingComplete?: () => void }> = ({ onLoadingComplete }) => {
    const { t } = useTranslation('loading');
    const [timeLeft, setTimeLeft] = useState(initialTime);
    
    const calculateProgress = () => ((initialTime - timeLeft) / initialTime) * 100;
  
    useEffect(() => {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = Math.max(prevTime - 1, 0);
          if (newTime === 0 && onLoadingComplete) {
            onLoadingComplete();
          }
          return newTime;
        });
      }, 1000);
  
      return () => clearInterval(timerId);
    }, [onLoadingComplete]);
  
    return (
      <div className={`${s.loadingBar} ${s.elevated}`}>
        <div className={s.header}>
          <h2 className={s.title}>{t('loading')}</h2>
        </div>
        <div className={s.body}>
          <div className={s.progressBar}>
            <div
              className={s.progressBarInner}
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>
        {timeLeft > 0 && (
          <button onClick={() => setTimeLeft(prev => Math.max(prev - 5, 0))}>
            <img src={rocketIcon} alt="rocket" />
          </button>
        )}
      </div>
    );
  };
  