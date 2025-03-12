import { Footer } from '../components/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './Layout.module.scss';
import { Header } from '../components/Header/';
import { useEffect, useRef, useState } from 'react';
import { AppRoute, localStorageConsts, MODALS } from '../constants';
import { LanguageSelectionModal, Settings, SettingsModal, WalletConnectionModal } from '../components';
import { AudioBg, useModal, useScrollManager } from '../hooks';
import { getOS } from '../utils';
import Lottie from 'lottie-react';
import { lampTable } from '../assets/animations';
import roadmapBg from '../assets/pages-bg/roadmap-bg.png';
import clsx from 'clsx';

const Layout = () => {
  const location = useLocation();
  const platform = getOS();
  const { openModal } = useModal();
  const [bgOffset, setBgOffset] = useState(0);
  const contentRef = useScrollManager();

  const showHeader = !location.pathname.match(/^\/profile\/[0-9a-fA-F-]{36}$/);

  const needsReducedMargin = [
    '/',
    '/progressTree',
    location.pathname.match(/^\/profile\/[0-9a-fA-F-]{36}$/),
  ].includes(location.pathname);

  const showRoadmapBg = location.pathname === '/progressTree';

  useEffect(() => {
    const isNeedToOpenChest = localStorage.getItem(localStorageConsts.IS_NEED_TO_OPEN_CHEST);
    if (isNeedToOpenChest) openModal(MODALS.TASK_CHEST);
  }, []);

  const isRoom =
    location.pathname === AppRoute.Main ||
    (location.pathname.includes(AppRoute.Profile) && location.pathname.split('/')?.[2]);

  const contentClassName = clsx(
    styles.content,
    showHeader && styles.withHeader,
    needsReducedMargin && styles.reducedMargin,
    isRoom && styles.room,
  );

  useEffect(() => {
    if (showRoadmapBg && contentRef.current) {
      const handleScroll = () => {
        const scrollTop = contentRef.current?.scrollTop || 0;
        const maxScroll = (contentRef.current?.scrollHeight || 0) - (contentRef.current?.clientHeight || 0);
        const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0;
        const newOffset = scrollPercentage * 75;
        setBgOffset(newOffset);
      };

      contentRef.current.addEventListener('scroll', handleScroll);
      return () => {
        contentRef.current?.removeEventListener('scroll', handleScroll);
      };
    }
  }, [showRoadmapBg, contentRef.current]);

  const [isBgLoaded, setIsBgLoaded] = useState(false);

  useEffect(() => {
    if (showRoadmapBg) {
      const img = new Image();
      img.src = roadmapBg;
      img.onload = () => setIsBgLoaded(true);
    }
  }, [showRoadmapBg]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas is not null

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Ensure context is not null

    let width: number = window.innerWidth;
    let height: number = window.innerHeight;

    // Function to update canvas dimensions
    const updateDimension = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Function to set a pixel's color
    const setPixel = (imageData: ImageData, x: number, y: number, r: number, g: number, b: number, a: number) => {
      const index = (x + y * imageData.width) * 4;
      imageData.data[index + 0] = r;
      imageData.data[index + 1] = g;
      imageData.data[index + 2] = b;
      imageData.data[index + 3] = a;
    };

    // Function to draw white noise
    const draw = () => {
      const imageData = ctx.createImageData(width, height);
      const length = Math.floor((width * height) / 1);

      for (let i = 0; i < length; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);

        // Black and white noise
        const random = Math.random();
        const color = random >= 0.5 ? 255 : 0;

        setPixel(imageData, x, y, color, color, color, 255); // 255 = fully opaque
      }

      ctx.putImageData(imageData, 0, 0);
    };

    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      updateDimension();
      draw();
    };

    // Start the animation
    animate();

    // Handle window resize
    window.addEventListener('resize', updateDimension);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, []);




  return (
    // <div className={`${styles.vhsEffect} ${styles.vhsWarp} ${styles.glitch} ${styles.frameDrop}`}>
    //   <div className={styles.interlace}></div>
    //   <div className={styles.lines}></div>
    //   <div className={styles.noise}></div>

    // </div>

    <>
      {/* <div className={styles.whiteNoise}/> */}

      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          opacity: '0.05',
          width: '100%',
          height: '100%',
          pointerEvents: 'none', // Ensure clicks pass through
          zIndex: 9999, // Ensure it's on top of everything
        }}
      />

      <div className={`${styles.settingsIcon} ${platform ? styles[platform + 'Settings'] : ''}`}>
        <Settings />
      </div>
      <div className={styles.wrp}>
        {showRoadmapBg && (
          <>
            <img
              src={roadmapBg}
              className={styles.bg_image}
              style={{ transform: `translateY(-${bgOffset}%)` }}
            />
            <Lottie
              animationData={lampTable}
              loop
              autoplay
              style={{ position: 'fixed', bottom: '23px' }}
            />
          </>
        )}
        {showHeader && <Header />}
        <main className={contentClassName} ref={contentRef}>
          <Outlet context={{ isBgLoaded }} />
          <SettingsModal />
          <WalletConnectionModal />
          <LanguageSelectionModal />
          <AudioBg />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
