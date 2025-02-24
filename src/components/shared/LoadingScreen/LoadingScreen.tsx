import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.scss';
import loadingImage from '../../../assets/icons/loading.svg';
import Lottie from 'lottie-react';
import { coinsAnim } from '../../../assets/animations';
import { LoadingScreenBar } from '../../loadingScreen/LoadingScreenBar/LoadingScreenBar';
import useSound from 'use-sound';
import { SOUNDS } from '../../../constants';
import { useSelector } from 'react-redux';
import { selectVolume } from '../../../redux';

const LOADING_DURATION = 1500;

export const LoadingScreen = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [playAccelerateSound] = useSound(SOUNDS.speedUp, { volume: useSelector(selectVolume) });

  useEffect(() => {
    const switchToAnimation = setTimeout(() => {
      setShowAnimation(true);
    }, LOADING_DURATION);

    return () => clearTimeout(switchToAnimation);
  }, []);

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
    const { clientX, clientY } = event;
    createParticles(clientX, clientY);
    playAccelerateSound();
    setSpeedMultiplier(3);
  };

  return (
    <div className={styles.root} onClick={handleAccelerate}>
      <div className={styles.clickableArea}></div>
      <div />
      {showAnimation ? (
        <Lottie animationData={coinsAnim} loop={false} autoPlay={true} style={{ zIndex: '10000' }} />
      ) : (
        <LoadingScreenBar speedMultiplier={speedMultiplier} />
      )}
      <img className={styles.coin} src={loadingImage} alt="Coin" />
    </div>
  );
};
