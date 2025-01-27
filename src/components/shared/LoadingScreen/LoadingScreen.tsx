import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.scss';
import coinIcon from '../../../../src/assets/icons/coin.svg';
import { ProgressBar } from './ProgressBar';
export const LoadingScreen = () => {
  const [dots, setDots] = useState('.');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 1));
    }, 100);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className={styles.root}>
      <img className={styles.coin} src={coinIcon} alt="Coin" />
      <div className={styles.loadingWrp}>
        <ProgressBar progress={progress}/>
        <div className={styles.text}>Загрузка{dots}</div>
      </div>
    </div>
  );
};
