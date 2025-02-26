import { Footer } from '../components/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './Layout.module.scss';
import { Header } from '../components/Header/';
import { useEffect, useState } from 'react';
import { MODALS, localStorageConsts } from '../constants';
import { LanguageSelectionModal, Settings, SettingsModal, WalletConnectionModal } from '../components';
import { useModal } from '../hooks';
import { getOS } from '../utils';
import { useScrollManager } from '../hooks';

import roadmapBg from '../assets/pages-bg/roadmap-bg.png';

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
    location.pathname.match(/^\/profile\/[0-9a-fA-F-]{36}$/)
  ].includes(location.pathname);
        
  const showRoadmapBg = location.pathname === '/progressTree';

  useEffect(() => {
    const isNeedToOpenChest = localStorage.getItem(
      localStorageConsts.IS_NEED_TO_OPEN_CHEST,
    );
    if (isNeedToOpenChest) openModal(MODALS.TASK_CHEST);
  }, []);

  const contentClassName = `${styles.content} ${
    showHeader ? styles.withHeader : ''
  } ${needsReducedMargin ? styles.reducedMargin : ''} ${
    platform ? styles[platform] : ''
  }`;

  useEffect(() => {
    if (showRoadmapBg && contentRef.current) {
      const handleScroll = () => {
        const scrollTop = contentRef.current?.scrollTop || 0;
        const maxScroll = (contentRef.current?.scrollHeight || 0) - (contentRef.current?.clientHeight || 0);
        const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0;
        const newOffset = scrollPercentage * 100;
        setBgOffset(newOffset);
      };

      contentRef.current.addEventListener("scroll", handleScroll);
      return () => {
        contentRef.current?.removeEventListener("scroll", handleScroll);
      };
    }
  }, [showRoadmapBg, contentRef.current]);

  return (
    <>
      <div className={`${styles.settingsIcon} ${
        platform ? styles[platform + 'Settings'] : ''
      }`}>
        <Settings />
      </div>
      <div className={styles.wrp}>
        {showRoadmapBg && (
          <img
            src={roadmapBg}
            className={styles.bg_image}
            style={{ transform: `translateY(-${bgOffset}px)` }}
          />
        )}
        {showHeader && <Header />}
        <main className={contentClassName} ref={contentRef}>
          <Outlet />
          <SettingsModal />
          <WalletConnectionModal />
          <LanguageSelectionModal />
          {/* <AudioBg /> */}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;