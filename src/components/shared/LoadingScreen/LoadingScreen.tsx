import { useEffect, useRef, useState } from 'react';
import styles from './LoadingScreen.module.scss';
import loadingVid from '../../../assets/gif/loading.mp4';
import Lottie from 'lottie-react';
import { coinsAnim } from '../../../assets/animations';
import { LoadingScreenBar } from '../../loadingScreen/LoadingScreenBar/LoadingScreenBar';
import useSound from 'use-sound';
import { SOUNDS } from '../../../constants';
import { useSelector } from 'react-redux';
import { selectVolume } from '../../../redux';


export const LoadingScreen = ({ onAnimationComplete }: { onAnimationComplete: () => void }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [progress, setProgress] = useState(0);
  const [playAccelerateSound] = useSound(SOUNDS.speedUp, { volume: useSelector(selectVolume) });

  useEffect(() => {
    if (progress >= 99) {
      setProgress(100);
      setTimeout(() => {
        setShowAnimation(true);
      }, 100);
    }
  }, [progress]);

  const createParticles = (x: number, y: number) => {
    const root = document.querySelector(`.${styles.clickableArea}`);
    if (!root) return;

    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.classList.add(styles.particle);
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      root.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 800);
    }
  };

  const handleAccelerate = (event: React.MouseEvent) => {
    if (progress < 100) {
      const { clientX, clientY } = event;
      createParticles(clientX, clientY);
      playAccelerateSound();
      setSpeedMultiplier(prev => prev * 1.5);
    }
  };

  useEffect(() => {
    if (showAnimation) {
      const animationTimeout = setTimeout(() => {
        onAnimationComplete();
      }, 1500);

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
        <Lottie
          animationData={coinsAnim}
          loop={false}
          autoPlay={true}
          style={{ zIndex: '10000' }}
          onComplete={onAnimationComplete}
        />
      ) : (
        <LoadingScreenBar speedMultiplier={speedMultiplier} progress={progress} setProgress={setProgress} />
      )}
      <video ref={videoRef}  className={styles.coin} src={loadingVid} autoPlay muted loop playsInline preload='auto' width={460} height={420}/>
    </div>
  );
};
