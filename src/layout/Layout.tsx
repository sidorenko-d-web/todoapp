import { Footer } from '../components/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './Layout.module.scss';
import { Header } from '../components/Header/';
import { useEffect } from 'react';
import { MODALS, localStorageConsts } from '../constants';
import { LanguageSelectionModal, Settings, SettingsModal, WalletConnectionModal } from '../components';
import { AudioBg, useModal } from '../hooks';

const Layout = () => {
  const location = useLocation();

  const showHeader = !location.pathname.match(/^\/profile\/[0-9a-fA-F-]{36}$/);

  const { openModal } = useModal();

  useEffect(() => {
    const isNeedToOpenChest = localStorage.getItem(
      localStorageConsts.IS_NEED_TO_OPEN_CHEST,
    );
    if (isNeedToOpenChest) openModal(MODALS.TASK_CHEST);
  }, []);

  return (
    <>
      <div className={styles.settingsWrapper}>
        <Settings />
      </div>
      <div className={styles.wrp}>
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
    </>
  );
};

export default Layout;
