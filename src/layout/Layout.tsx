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
import { StrangerHeader } from '../components/profile/StrangerHeader';
import { SoundSettingsModal } from '../components/settings/SoundSettingsModal';
import { WithModal } from '../components/shared/WithModal/WithModa';


const Layout = () => {
  const location = useLocation();
  const platform = getOS();
  const { openModal } = useModal();
  const [bgOffset, setBgOffset] = useState(0);
  const contentRef = useScrollManager();

  const showHeader = !(location.pathname.split('/')[1] === 'profile' && !!location.pathname.split('/')[2]);

  const needsReducedMargin = [
    '/',
    '/progressTree',
    `${location.pathname.includes(AppRoute.Profile) && location.pathname.split('/')?.[3]}`,
  ].includes(location.pathname);

  const showRoadmapBg = location.pathname === '/progressTree';

  // const showHeaderBG =!['/', '/progressTree'].includes(location.pathname) && !(location.pathname.split('/')[1] === 'profile' && location.pathname.split('/')[3] === 'room');

  useEffect(() => {
    const isNeedToOpenChest = localStorage.getItem(localStorageConsts.IS_NEED_TO_OPEN_CHEST);
    if (isNeedToOpenChest) openModal(MODALS.TASK_CHEST);
  }, []);

  const isRoom =
    location.pathname === AppRoute.Main ||
    (location.pathname.includes(AppRoute.Profile) && location.pathname.split('/')?.[3]);

  const isProgressTree = location.pathname === AppRoute.ProgressTree;

  const contentClassName = clsx(
    styles.content,
    showHeader,
    needsReducedMargin,
    isRoom && styles.room,
    isProgressTree && styles.progressTree,
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
  }, [showRoadmapBg, !!contentRef.current]);

  const [isBgLoaded, setIsBgLoaded] = useState(false);

  useEffect(() => {
    if (showRoadmapBg) {
      const img = new Image();
      img.src = roadmapBg;
      img.onload = () => setIsBgLoaded(true);
    }
  }, [showRoadmapBg]);

  const strangerId = location.pathname.split('/')[1] === 'profile' && location.pathname.split('/')[2];
  return (
    <>
      {strangerId && <StrangerHeader />}
      {/* {showHeaderBG && <div className={styles.headerBG} />} */}
      <div className={`${styles.settingsIcon} ${platform ? styles[platform + 'Settings'] : ''}`}>
        <Settings />
      </div>

      <div className={styles.wrp}>
        {showRoadmapBg && (
          <>
            <img src={roadmapBg} className={styles.bg_image} style={{ transform: `translateY(-${bgOffset}%)` }} />
            <Lottie
              animationData={lampTable}
              loop
              autoplay
              style={{ position: 'fixed', bottom: '34px', zIndex: '1' }}
            />
          </>
        )}
        {showHeader && <Header />}
        <main className={contentClassName} ref={contentRef}>
          <Outlet context={{ isBgLoaded }} />
          <WithModal modalId={MODALS.SETTINGS} component={<SettingsModal />} />
          <WithModal modalId={MODALS.WALLET_CONNECTION} component={<WalletConnectionModal />} />
          <WithModal modalId={MODALS.LANGUAGE_SELECTION} component={<LanguageSelectionModal />} />
          <WithModal modalId={MODALS.SOUND_SETTINGS} component={<SoundSettingsModal />} />

          <AudioBg />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
