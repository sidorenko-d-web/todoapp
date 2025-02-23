import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.scss';
import loadingImage from '../../../assets/icons/loading.svg';
import Lottie from 'lottie-react';
import { coinsAnim } from '../../../assets/animations';
import { LoadingScreenBar } from '../../loadingScreen/LoadingScreenBar/LoadingScreenBar';

const LOADING_DURATION = 1500;

export const LoadingScreen = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const switchToAnimation = setTimeout(() => {
      setShowAnimation(true);
    }, LOADING_DURATION);

    return () => clearTimeout(switchToAnimation);
  }, []);

  return (
    <div className={styles.root}>
      <div />
      {showAnimation ? (
        <Lottie animationData={coinsAnim} loop={false} autoPlay={true} style={{ zIndex: '10000' }} />
      ) : (
        <LoadingScreenBar />
      )}
      <img className={styles.coin} src={loadingImage} alt="Coin" />
    </div>
  );
};
