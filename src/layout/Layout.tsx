import { Footer } from '../components/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './Layout.module.scss';
import { Header } from '../components/Header/';
import { useEffect, useState } from 'react';
import { MODALS, localStorageConsts } from '../constants';
import {
  LanguageSelectionModal, Settings,
  SettingsModal,
  WalletConnectionModal,
} from '../components';
import { useModal } from '../hooks';
import { getOS } from '../utils';

import roadmapBg from '../assets/pages-bg/roadmap-bg.png';

const Layout = () => {
  const location = useLocation();
  const platform = getOS();

  const showHeader = !location.pathname.match(/^\/profile\/[0-9a-fA-F-]{36}$/);

  const needsReducedMargin = [
    '/',
    '/progressTree',
    location.pathname.match(/^\/profile\/[0-9a-fA-F-]{36}$/)
  ].includes(location.pathname);
        
  const showRoadmapBg = location.pathname === '/progressTree';


  const { openModal } = useModal();

  const [bgOffset, setBgOffset] = useState(0);

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
    if (showRoadmapBg) {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollTop / maxScroll;

        const newOffset = scrollPercentage * 100; 
        setBgOffset(newOffset);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [showRoadmapBg]);

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
        <main className={contentClassName}>
          <Outlet />

          {/* Modals */}
          <SettingsModal />
          <WalletConnectionModal />
          <LanguageSelectionModal />

          {/*<AudioBg />*/}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Layout;