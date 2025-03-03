import { useEffect, useState, useRef } from 'react';
import styles from './LoadingScreen.module.scss';
import loadingVid from '../../../assets/gif/loading.mp4';
// import Lottie from 'lottie-react';
// import { coinsAnim } from '../../../assets/animations';
import { LoadingScreenBar, LoadingScreenBarRef } from '../../loadingScreen/LoadingScreenBar/LoadingScreenBar';
import useSound from 'use-sound';
import { GUIDE_ITEMS, SOUNDS } from '../../../constants';
import { useSelector } from 'react-redux';
import { selectVolume } from '../../../redux';

interface LoadingScreenProps {
  onAnimationComplete: () => void;
  isAuthComplete: boolean;
}

export const LoadingScreen = ({ onAnimationComplete, isAuthComplete }: LoadingScreenProps) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [forceLoadingTimePassed, setForceLoadingTimePassed] = useState(false);
  const [playAccelerateSound] = useSound(SOUNDS.speedUp, { volume: useSelector(selectVolume) });
  const loadingScreenBarRef = useRef<LoadingScreenBarRef>(null);

  //TODO убрать когда надо будет отображать гайды
  useEffect(() => {
    Object.values(GUIDE_ITEMS).forEach(category => {
      Object.values(category).forEach(value => {
        console.log('setting value of ', value, ' to 1' )
        localStorage.setItem(value, '1');
      });
    });
  }, []);

  useEffect(() => {
    const minLoadingTimeout = setTimeout(() => {
      setForceLoadingTimePassed(true);
    }, 2300);

    return () => clearTimeout(minLoadingTimeout);
  }, []);

  useEffect(() => {
    if (isAuthComplete && forceLoadingTimePassed) {
      setSpeedMultiplier(4);
    }
  }, [isAuthComplete, forceLoadingTimePassed]);

  useEffect(() => {
    if (progress >= 99) {
      setProgress(100);
      setTimeout(() => {
        setShowAnimation(true);
      }, 100);
    }
  }, [progress]);

  const handleAccelerate = () => {
    if (!showAnimation) {
      playAccelerateSound();
      setSpeedMultiplier(prev => prev * 1.5);

      if (loadingScreenBarRef.current) {
        loadingScreenBarRef.current.createParticles();
      }
    }
  };

  useEffect(() => {
    if (showAnimation) {
      const animationTimeout = setTimeout(() => {
        onAnimationComplete();
      }, 100);

      return () => clearTimeout(animationTimeout);
    }
  }, [showAnimation]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 2;

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.warn('Autoplay blocked:', error));
      }
    }
  }, []);

  return (
    <div className={styles.root} onClick={handleAccelerate}>
      <div />
      <div className={styles.clickableArea}></div>
      {showAnimation ? (
        // <Lottie animationData={coinsAnim} loop={false} autoPlay={true} style={{ zIndex: '10000' }} />
        <></>
      ) : (
        <LoadingScreenBar 
          ref={loadingScreenBarRef}
          speedMultiplier={speedMultiplier} 
          progress={progress} 
          setProgress={setProgress} 
          isAuthComplete={isAuthComplete} 
        />
      )}
      <video ref={videoRef} className={styles.coin} 
        src={loadingVid} autoPlay muted loop playsInline preload="auto" width={410} height={420} />
    </div>
  );
};