import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.scss';

export const LoadingScreen = () => {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.root}>
      <img className={styles.coin} src="/coin.svg" alt="Coin" />
      <div className={styles.text}>
        Загрузка{dots}
      </div>
    </div>
  );
};
