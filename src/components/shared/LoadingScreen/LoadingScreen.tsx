import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './LoadingScreen.module.scss';
import loadingVid from '../../../assets/gif/loading.mp4';
// import Lottie from 'lottie-react';
// import { coinsAnim } from '../../../assets/animations';
import { LoadingScreenBar, LoadingScreenBarRef } from '../../loadingScreen/LoadingScreenBar/LoadingScreenBar';
import useSound from 'use-sound';
import { SOUNDS, buildMode } from '../../../constants';
import { useSelector } from 'react-redux';
import { selectVolume } from '../../../redux';
import WhiteNoiseCanvas from '../../WhiteNoise/WhiteNoise';

import qr from '../../../assets/icons/qr.png';

interface LoadingScreenProps {
  onAnimationComplete: () => void;
  isAuthComplete: boolean;
}

export const LoadingScreen = ({ onAnimationComplete, isAuthComplete }: LoadingScreenProps) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [forceLoadingTimePassed, setForceLoadingTimePassed] = useState(false);
  const [playAccelerateSound] = useSound(SOUNDS.speedUp, { volume: useSelector(selectVolume) });
  const loadingScreenBarRef = useRef<LoadingScreenBarRef>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // useEffect(() => {
  //   Object.values(GUIDE_ITEMS).forEach(category => {
  //     Object.values(category).forEach(value => {
  //       localStorage.setItem(value, '1');
  //     });
  //   });
  // }, []);

  const [isMobile, setIsMobile] = useState(buildMode.includes('Dev') ? 1 : 0);

  useEffect(() => {
    if (buildMode.includes('Dev')) return;
    if (window.Telegram?.WebApp?.platform) {
      const platform = window.Telegram.WebApp.platform.toLowerCase();
      if (platform.includes('android') || platform.includes('ios')) {
        setIsMobile(1);
      } else {
        setIsMobile(-1);
      }
    } else {
      setIsMobile(-1);
    }
  }, []);

  useEffect(() => {
    const minLoadingTimeout = setTimeout(() => {
      setForceLoadingTimePassed(true);
    }, 5500);

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

  useLayoutEffect(() => {
    if (!videoRef) return;
    // Показываем прогресс бар после 2 секунд воспроизведения видео
    const videoTimeout = setTimeout(() => {
      setShowProgressBar(true);
    }, 3500);

    return () => clearTimeout(videoTimeout);
  }, [videoRef]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 2;

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.warn('Autoplay blocked:', error));
      }
    }
  }, []);

  const ref = useRef<any>(null);

  return (
    <>
      <div ref={ref}>
        <WhiteNoiseCanvas />
      </div>
      {ref && (
        <>
          {isMobile === 1 && (
            <div className={styles.root} onClick={handleAccelerate}>
              <div />
              <div className={styles.clickableArea}></div>
              <video
                ref={videoRef}
                className={styles.coin}
                src={loadingVid}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                width={410}
                height={420}
              />

              {showProgressBar && !showAnimation && (
                <div className={styles.betaAndProgressBar}>
                  <span className={styles.beta}>Beta</span>
                  <LoadingScreenBar
                    ref={loadingScreenBarRef}
                    speedMultiplier={speedMultiplier}
                    progress={progress}
                    setProgress={setProgress}
                    isAuthComplete={isAuthComplete}
                  />
                </div>
              )}
              {showAnimation && (
                // <Lottie animationData={coinsAnim} loop={false} autoPlay={true} style={{ zIndex: '10000' }} />
                <></>
              )}
            </div>
          )}

          {isMobile === -1 && (
            <div className={styles.notMobile}>
              <div className={styles.qr}>
                <img src={qr} />
                <p>Apusher MiniApp</p>
              </div>
              <p className={styles.useMobileApp}>
                Пожалуйста, используйте
                <br />
                ваше мобильное устройство
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
};
