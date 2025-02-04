import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.scss';
import coinIcon from '../../../../src/assets/icons/coin.png';
import { ProgressBar } from './ProgressBar';

export const LoadingScreen = () => {
  const [dots, setDots] = useState('.');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  // Управление прогрессом
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.root}>
      <img className={styles.coin} src={coinIcon} alt="Coin"/>
      <div className={styles.loadingWrp}>
        <ProgressBar progress={progress} />
        <div className={styles.text}>Загрузка{dots}</div>
      </div>
    </div>
  );
};
