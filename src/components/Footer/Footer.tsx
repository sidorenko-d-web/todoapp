import styles from './Footer.module.scss';
import { AppRoute, footerItems, GUIDE_ITEMS } from '../../constants';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { TrackedButton } from '..';
import { isGuideShown } from '../../utils';

export const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState<number>(-1);
  const footerActive = useSelector((state: RootState) => state.guide.footerActive);

  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  
  useEffect(() => {
    if (location.pathname === '/progressTree' || location.pathname === '/wardrobe') {
      setActiveButton(-1);
    }
  }, [location.pathname]);

  const handleFooterItemClick = (id: number, redirectTo: string) => {
    if (footerActive) navigate(redirectTo);
    setActiveButton(id);
  };

  useEffect(() => {
    if (!hasInitialized && isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE)) {
      const mainItem = footerItems.find(item => item.redirectTo === AppRoute.Main);
      if (mainItem) {
        handleFooterItemClick(mainItem.id, mainItem.redirectTo);
        setHasInitialized(true);
      }
    }
  }, [hasInitialized]);

  return (
    <div className={styles.footerItems}>
      {footerItems.map((item) => {
        const isActive = activeButton === item.id;

        return (
          <TrackedButton
            trackingData={{
              eventType: 'button',
              eventPlace: 'footer'
            }}
            key={item.id}
            className={`${styles.footerItem} ${isActive ? styles.active : ''}`}
            onClick={() => handleFooterItemClick(item.id, item.redirectTo)}
          >
            <img src={item.icon} width={22} height={22} />
          </TrackedButton>
        );
      })}
    </div>
  );
};
