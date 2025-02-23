import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.scss';
import loadingImage from '../../../assets/icons/loading.svg';
import Lottie from 'lottie-react';
import { coinsAnim } from '../../../assets/animations';
import { LoadingScreenBar } from '../../loadingScreen/LoadingScreenBar/LoadingScreenBar';

export const LoadingScreen = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.root}>
      {showAnimation ? (
        <Lottie
          animationData={coinsAnim}
          loop={false}
          autoPlay={true}
          style={{zIndex: '10000'}}
        />
      ) : (
        <LoadingScreenBar onLoadingComplete={() => {}} />
      )}
      <img className={styles.coin} src={loadingImage} alt="Coin" />
    </div>
  );
};
