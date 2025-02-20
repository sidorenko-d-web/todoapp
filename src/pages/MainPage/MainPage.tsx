import { FC, useEffect, useReducer } from 'react';
import {
  AccelerateIntegtrationGuide,
  CreatingIntegrationGuide,
  FinishTutorialGuide,
  GetCoinsGuide,
  InitialGuide,
  IntegrationCreatedGuide,
  IntegrationCreation,
  PublishIntegrationButton,
  Room,
  SubscrieGuide,
} from '../../components';
import s from './MainPage.module.scss';
import { AppRoute, MODALS } from '../../constants';
import { useModal } from '../../hooks';

import { GUIDE_ITEMS } from '../../constants/guidesConstants';
import { getSubscriptionPurchased, isGuideShown, setGuideShown } from '../../utils';

import {
  setAccelerateIntegrationGuideClosed,
  setActiveFooterItemId,
  setGetCoinsGuideShown,
  setIntegrationReadyForPublishing,
  setLastIntegrationId,
} from '../../redux/slices/guideSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useGetAllIntegrationsQuery } from '../../redux';
import RewardForIntegrationModal from '../DevModals/RewardForIntegrationModal/RewardForIntegrationModal.tsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const MainPage: FC = () => {
  const { t } = useTranslation('guide');
  const { getModalState, openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();

  const { data, refetch } = useGetAllIntegrationsQuery();

  const integrationId = useSelector((state: RootState) => state.guide.lastIntegrationId);

  useEffect(() => {
    refetch().then(() => {
      if (data?.integrations[0].status === 'created') {
        reduxDispatch(setIntegrationReadyForPublishing(true));
        reduxDispatch(setLastIntegrationId(data.integrations[0].id));
      } else {
        reduxDispatch(setIntegrationReadyForPublishing(false));
        reduxDispatch(setLastIntegrationId(''));
      }
    });
  }, []);


  const showAccelerateGuide = useSelector((state: RootState) => state.guide.integrationCreated);

  const initialState = {
    firstGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN),
    secondGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN),
    subscribeModalOpened: isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIBE_MODAL_OPENED),
    getCoinsGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN),
    createIntegrationFirstGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN),
    createIntegrationSecondGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN),
  };

  function guideReducer(state: any, action: { type: any; payload: string }) {
    switch (action.type) {
      case 'SET_GUIDE_SHOWN':
        setGuideShown(action.payload);
        return { ...state, [action.payload]: true };
      default:
        return state;
    }
  }

  const [guideVisibility, dispatch] = useReducer(guideReducer, initialState);

  const purchasingSubscriptionModalState = getModalState(MODALS.SUBSCRIBE);
  const creatingIntegrationModalState = getModalState(MODALS.CREATING_INTEGRATION);

  const handleGuideClose = (guideId: string) => {
    dispatch({ type: 'SET_GUIDE_SHOWN', payload: guideId });
  };

  useEffect(() => {
    if (creatingIntegrationModalState.isOpen) {
      closeModal(MODALS.SUBSCRIBE);
    }
  }, [creatingIntegrationModalState.isOpen]);

  useEffect(() => {
    reduxDispatch(setActiveFooterItemId(2));

    if (isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN)
      && !isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIBE_MODAL_OPENED) && !purchasingSubscriptionModalState.isOpen) {
      openModal(MODALS.SUBSCRIBE);
    }

    // if (isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN)
    //   && !isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN)) {
    //   navigate(AppRoute.Shop);
    // }

    if (
      isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN) &&
      !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN) &&
      !getSubscriptionPurchased()
    ) {
      openModal(MODALS.SUBSCRIBE);
    }

    if (
      isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_BOUGHT) &&
      !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN) &&
      !creatingIntegrationModalState.isOpen
    ) {
      openModal(MODALS.CREATING_INTEGRATION);
    }

    if (
      isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN) &&
      !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN) &&
      !creatingIntegrationModalState.isOpen
    ) {
      openModal(MODALS.CREATING_INTEGRATION);
    }

    // if (isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN)
    //   && !isGuideShown(GUIDE_ITEMS.shopPage.ITEM_BOUGHT)) {
    //   navigate(AppRoute.Shop);
    // }

    // if (isGuideShown(GUIDE_ITEMS.shopPage.ITEM_BOUGHT) && !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE)) {
    //   navigate(AppRoute.ShopInventory);
    // }
  }, []);

  return (
    <main className={s.page}>
      <Room />
      {!useSelector((state: RootState) => state.guide.integrationReadyForPublishing) ? (
        <IntegrationCreation />
      ) : (
        <PublishIntegrationButton />
      )}

      {!guideVisibility.firstGuideShown && (
        <InitialGuide onClose={() => handleGuideClose(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN)} />
      )}

      {!guideVisibility.secondGuideShown && guideVisibility.firstGuideShown && (
        <SubscrieGuide
          onClose={() => {
            handleGuideClose(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN);
            openModal(MODALS.SUBSCRIBE);
          }}
          top="50%"
          zIndex={1500}
          description={
            <>
              {t('g11')}
              <br />
              <br />
              {t('g12')} <span style={{ color: '#2F80ED' }}>{t('g13')}</span>!
            </>
          }
        />
      )}

      {guideVisibility.secondGuideShown &&
        !guideVisibility.subscribeModalOpened &&
        purchasingSubscriptionModalState.isOpen && (
          <SubscrieGuide
            onClose={() => {
              closeModal(MODALS.SUBSCRIBE);
              handleGuideClose(GUIDE_ITEMS.mainPage.SUBSCRIBE_MODAL_OPENED);
            }}
            top="65%"
            zIndex={1500}
            description={
              <>
                {t('g14')} <span style={{ color: '#2F80ED' }}>{t('g15')}</span>
                <br />
                <br />
                {t('g16')}
              </>
            }
          />
        )}

      {!purchasingSubscriptionModalState.isOpen &&
        guideVisibility.subscribeModalOpened &&
        !guideVisibility.getCoinsGuideShown && (
          <GetCoinsGuide
            onClose={() => {
              reduxDispatch(setGetCoinsGuideShown(true));
              handleGuideClose(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN);
              openModal(MODALS.SUBSCRIBE);
            }}
          />
        )}

      {creatingIntegrationModalState.isOpen && !guideVisibility.createIntegrationFirstGuideShown && (
        <CreatingIntegrationGuide
          onClose={() => handleGuideClose(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN)}
          buttonText={t('g17')}
          description={
            <>
              {t('g18')} <span style={{ color: '#2F80ED' }}>{t('g19')}</span>
              <br />
              <br />
              {t('g20')}
            </>
          }
          align="left"
          top="69%"
        />
      )}

      {creatingIntegrationModalState.isOpen &&
        guideVisibility.createIntegrationFirstGuideShown &&
        !guideVisibility.createIntegrationSecondGuideShown && (
          <CreatingIntegrationGuide
            onClose={() => handleGuideClose(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN)}
            buttonText={t('g21')}
            description={
              <>
                {t('g22')} <span style={{ color: '#2F80ED' }}>{t('g23')} </span>
                <br />
                <br />
                {t('g24')}
              </>
            }
            align="right"
            top="66%"
          />
        )}

      {showAccelerateGuide &&
        !creatingIntegrationModalState.isOpen &&
        !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED) && (
          <AccelerateIntegtrationGuide
            onClose={() => {
              setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED);
              reduxDispatch(setAccelerateIntegrationGuideClosed(true));
            }}
          />
        )}

      {!isGuideShown(GUIDE_ITEMS.creatingIntegration.GO_TO_INTEGRATION_GUIDE_SHOWN) &&
        useSelector((state: RootState) => state.guide.isPublishedModalClosed) && (
          <IntegrationCreatedGuide
            onClose={() => {
              setGuideShown(GUIDE_ITEMS.creatingIntegration.GO_TO_INTEGRATION_GUIDE_SHOWN);
              handleGuideClose(GUIDE_ITEMS.creatingIntegration.GO_TO_INTEGRATION_GUIDE_SHOWN);
              navigate(AppRoute.Integration.replace(':integrationId', integrationId));
            }}
          />
        )}

      {isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN) &&
        !isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN) && (
          <FinishTutorialGuide
            onClose={() => setGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN)}
          />
        )}

      <RewardForIntegrationModal />
    </main>
  );
};
