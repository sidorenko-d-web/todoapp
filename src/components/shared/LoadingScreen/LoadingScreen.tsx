import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.scss';
import loadingImage from '../../../assets/icons/loading.svg';
import Lottie from 'lottie-react';
import { coinsAnim } from '../../../assets/animations';
import { LoadingScreenBar } from '../../loadingScreen/LoadingScreenBar/LoadingScreenBar';

export const LoadingScreen = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [loadingFast, setLoadingFast] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, loadingFast ? 500 : 1500);

    return () => clearTimeout(timer);
  }, [loadingFast]);

  return (
    <div className={styles.root} onClick={() => setLoadingFast(true)}>
      <div />
      {showAnimation ? (
        <Lottie
          animationData={coinsAnim}
          loop={false}
          autoPlay={true}
          style={{ zIndex: '10000' }}
        />
      ) : (
        <LoadingScreenBar accelerate={() => setLoadingFast(true)} />
      )}
      <img className={styles.coin} src={loadingImage} alt="Coin" />
    </div>
  );
};
