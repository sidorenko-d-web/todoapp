import { Footer } from '../components/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './Layout.module.scss';
import { Header } from '../components/Header/';
import { useEffect } from 'react';
import { MODALS, localStorageConsts } from '../constants';
import { LanguageSelectionModal, SettingsModal, WalletConnectionModal } from '../components';
import { AudioBg, useModal } from '../hooks';

import roadmapBg from '../assets/pages-bg/roadmap-bg.png';

const Layout = () => {
  const location = useLocation();

  const showHeader = !location.pathname.match(/^\/profile\/[0-9a-fA-F-]{36}$/);
  const showRoadmapBg = location.pathname === '/progressTree';

  const { openModal } = useModal();


  useEffect(() => {
    const isNeedToOpenChest = localStorage.getItem(
      localStorageConsts.IS_NEED_TO_OPEN_CHEST,
    );
    if (isNeedToOpenChest) openModal(MODALS.TASK_CHEST);
  }, []);

  return (
    <div className={styles.wrp}>
      {/* {showRoadmapBg &&  <div className={styles.bg_image}/>} */}
      {showRoadmapBg &&  <img style={{border: 'none'}} src={roadmapBg} className={styles.bg_image}/>}
      {showHeader && <Header />}
      <main className={styles.content + ' ' + (showHeader ? styles.withHeader : '')}>
        <Outlet />

        {/* Modals */}
        <SettingsModal />
        <WalletConnectionModal />
        <LanguageSelectionModal />

        <AudioBg />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
