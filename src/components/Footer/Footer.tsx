import styles from './Footer.module.scss';
import { AppRoute, footerItems, GUIDE_ITEMS, MODALS } from '../../constants';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { TrackedButton } from '..';
import { isGuideShown } from '../../utils';
import { useModal } from '../../hooks';

export const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState<number>(-1);
  const footerActive = useSelector((state: RootState) => state.guide.footerActive);

  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  const footerItemId = useSelector((state: RootState) => state.guide.activeFooterItemId);

  useEffect(() => {
    setActiveButton(footerItemId);
  }, [footerItemId]);

  useEffect(() => {
    if (location.pathname === '/progressTree' || location.pathname === '/wardrobe') {
      setActiveButton(-1);
    }

    if (location.pathname === '/profile') {
      setActiveButton(0);
    }

    if (location.pathname === '/shop' || location.pathname === 'shop/inventory') {
      setActiveButton(1);
    }

    if (location.pathname.includes('integration')) {
      setActiveButton(2);
    }

    if (location.pathname === '/') {
      setActiveButton(3);
    }
  }, [location.pathname]);

  const handleFooterItemClick = (id: number, redirectTo: string) => {
    if (footerActive) {
      navigate(redirectTo);
      setActiveButton(id);
    }
  };

  useEffect(() => {
    if (!hasInitialized && isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN)) {
      const mainItem = footerItems.find(item => item.redirectTo === AppRoute.Main);
      if (mainItem) {
        handleFooterItemClick(mainItem.id, mainItem.redirectTo);
        setHasInitialized(true);
      }
    }
  }, [hasInitialized, isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN)]);

  const dim = useSelector((state: RootState) => state.guide.dimHeader);

  const { getModalState } = useModal();

  const integrationCurrentlyCreating = useSelector((state: RootState) => state.acceleration.integrationCreating);
  const accelerateGuideShown = useSelector((state: RootState) => state.guide.accelerateIntegrationGuideClosed);

  const darken =
    dim &&
    !getModalState(MODALS.SUBSCRIBE).isOpen &&
    !getModalState(MODALS.CREATING_INTEGRATION).isOpen &&
    !getModalState(MODALS.SUCCESSFULLY_SUBSCRIBED).isOpen;

  const darken2 =
    isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) &&
    !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED);

  const darken3 =
    isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN) &&
    !isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN);

  const darken4 =
    (isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN) &&
      !isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN)) ||
    (isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) &&
      !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED));

  const notDarken = integrationCurrentlyCreating && accelerateGuideShown;

  return (
    <div
      className={`${styles.footerItems} ${
        (darken || darken2 || darken3 || darken4) && !notDarken ? styles.darken : ''
      }`}
    >
      {(darken || darken2 || darken3 || darken4) && !notDarken && <div className={styles.footerOverlay} />}

      {footerItems.map(item => {
        const isActive = activeButton === item.id;

        return (
          <TrackedButton
            trackingData={{
              eventType: 'button',
              eventPlace: 'footer',
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
