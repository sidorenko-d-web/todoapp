import { Footer } from '../components/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './Layout.module.scss';
import { Header } from '../components/Header/';
import { useEffect, useState } from 'react';
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
  const [ bgOffset, setBgOffset ] = useState(0);
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
  }, [ showRoadmapBg, contentRef.current ]);

  const [isBgLoaded, setIsBgLoaded] = useState(false);

  useEffect(() => {
    if (showRoadmapBg) {
      const img = new Image();
      img.src = roadmapBg;
      img.onload = () => setIsBgLoaded(true);
    }
  }, [showRoadmapBg]);


  return (
    <div className={`${styles.vhsEffect} ${styles.glitch} ${styles.vhsWarp} ${styles.frameDrop}`}>
      <div className={styles.interlace}></div>
      <div className={styles.lines}></div>
      <div className={styles.noise}></div>
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
    </div>
  );
};

export default Layout;
