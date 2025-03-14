import { FC, useEffect, useReducer, useState } from 'react';
import {
  AccelerateIntegtrationGuide,
  FinishTutorialGuide,
  GetCoinsGuide,
  InitialGuide,
  IntegrationCreatedGuide,
  IntegrationCreation,
  IntegrationRewardModal,
  Loader,
  PublishIntegrationButton,
  Room,
  SubscrieGuide,
} from '../../components';
import s from './MainPage.module.scss';
import { AppRoute, GUIDE_ITEMS, MODALS } from '../../constants';
import { useModal } from '../../hooks';
import { getSubscriptionPurchased, isGuideShown, setGuideShown } from '../../utils';


import {
  resetGuideState,
  RootState,
  setAccelerateIntegrationGuideClosed,
  setActiveFooterItemId,
  setFooterActive,
  setGetCoinsGuideShown,
  setIntegrationReadyForPublishing,
  setLastIntegrationId,
  setSubscribeGuideShown,
  useGetAllIntegrationsQuery,
  useGetEquipedQuery,
  useGetIntegrationsQuery,
  useGetInventoryItemsQuery,
  useGetProfileMeQuery,
} from '../../redux';
import { useDispatch, useSelector } from 'react-redux';
import RewardForIntegrationModal from '../DevModals/RewardForIntegrationModal/RewardForIntegrationModal.tsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { incrementAcceleration } from '../../redux/slices/integrationAcceleration.ts';
import DaysInARowModal from '../DevModals/DaysInARowModal/DaysInARowModal.tsx';

export const MainPage: FC = () => {
  const { t } = useTranslation('guide');
  const { getModalState, openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const { data, refetch, isLoading: isAllIntegrationsLoading, isError: isIntegrationsError} = useGetAllIntegrationsQuery();


  const [typewriterFound, setTypewriterFound] = useState(false);

  const { data: itemsData, isLoading: isInventoryDataLoading, isError: isInventoryFetchError } = useGetInventoryItemsQuery();

  const integrationCurrentlyCreating = useSelector((state: RootState) => state.acceleration.integrationCreating);

  useEffect(() => {
    console.log('setting guides to 0: case 1');
    setTypewriterFound(false);
    if(isIntegrationsError || isInventoryFetchError) {
      Object.entries(GUIDE_ITEMS).forEach(([_, items]) => {
        Object.entries(items).forEach(([_, value]) => {
          localStorage.setItem(value, '0');
          setGuideNotShown(value);
        });
      });
      setTypewriterFound(false);
    } 
  }, [isIntegrationsError, isInventoryFetchError, isAllIntegrationsLoading, isInventoryDataLoading]);


  useEffect(() => {
    if (itemsData && !isInventoryDataLoading) {
      let found = false;
  
      console.log('setting guides to 1: case 1');
      itemsData.items.forEach(item => {
        if (item.name.toLowerCase().trim() === 'печатная машинка') {
          console.log('typewriter found!!');
          setTypewriterFound(true);
          found = true;
  
          handleGuideClose(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN);
          handleGuideClose(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN);
  
          setGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN);
          setGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN);
          setGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN);
          setGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN);
          setGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_BOUGHT);
          setGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN);
          setGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN);
          setGuideShown(GUIDE_ITEMS.mainPage.MAIN_PAGE_GUIDE_FINISHED);
  
          setGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN);
          setGuideShown(GUIDE_ITEMS.shopPage.ITEM_BOUGHT);
          setGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE);
  
          reduxDispatch(resetGuideState());
        }
      });
  
      if (!found) {
        console.log('setting guides to 0: case 2');
        console.log('typewriter not found!');
        Object.entries(GUIDE_ITEMS).forEach(([page, items]) => {
          console.log(`Page: ${page}`);
          Object.entries(items).forEach(([_, value]) => {
            console.log('value...');
            localStorage.setItem(value, '0');
            setGuideNotShown(value);
          });
        });
      }
    }
  }, [itemsData, isInventoryDataLoading, typewriterFound]);


  useEffect(() => {
    if (typeof data?.count !== 'undefined' && data?.count > 0) {
      console.log('setting guides to 1: case 2');
      if (data?.count > 1) {
        setGuideShown(GUIDE_ITEMS.creatingIntegration.GO_TO_INTEGRATION_GUIDE_SHOWN);
        setGuideShown(GUIDE_ITEMS.creatingIntegration.INITIAL_INTEGRATION_DURATION_SET);
        setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED);
        setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED);
        setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATION_GUIDE_SHOWN);
        setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_CREATED);
        setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED);
        setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED_MODAL_CLOSED);
        setGuideShown(GUIDE_ITEMS.creatingIntegration.PUBLISHED_MODAL_OPENED);

        setGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN);

        setGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN);

        setGuideShown(GUIDE_ITEMS.shopPageSecondVisit.TREE_LEVEL_GUIDE_SHOWN);
        setGuideShown(GUIDE_ITEMS.shopPageSecondVisit.UPGRADE_ITEMS_GUIDE_SHOWN);

        setGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW);

        reduxDispatch(resetGuideState());

        reduxDispatch(setFooterActive(true));
        reduxDispatch(setActiveFooterItemId(2));
      } else {
        if (data?.integrations[0].status === 'published'
          && !getModalState(MODALS.INTEGRATION_REWARD).isOpen
          && localStorage.getItem('integrationCreatedGuideOpen') !== '1') {

            console.log('setting guides to 1: case 3');

          setGuideShown(GUIDE_ITEMS.creatingIntegration.GO_TO_INTEGRATION_GUIDE_SHOWN);
          setGuideShown(GUIDE_ITEMS.creatingIntegration.INITIAL_INTEGRATION_DURATION_SET);
          setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED);
          setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED);
          setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATION_GUIDE_SHOWN);
          setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_CREATED);
          setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED);
          setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED_MODAL_CLOSED);
          setGuideShown(GUIDE_ITEMS.creatingIntegration.PUBLISHED_MODAL_OPENED);

          setGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN);


          reduxDispatch(resetGuideState());

          reduxDispatch(setFooterActive(true));
          reduxDispatch(setActiveFooterItemId(2));
        }
      }
    }
  }, [data, isInventoryDataLoading]);

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

      if (data?.integrations[0].status === 'published') {
        if (isGuideShown(GUIDE_ITEMS.creatingIntegration.PUBLISHED_MODAL_OPENED)
          && !isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN)
          && !getModalState(MODALS.INTEGRATION_REWARD_CONGRATULATIONS).isOpen) {
          reduxDispatch(setFooterActive(true));
          navigate(`/integrations/${data?.integrations[0].id}`);
        }
      }

    });
  }, [data, isAllIntegrationsLoading]);
  // const showAccelerateGuide = useSelector((state: RootState) => state.guide.integrationCreated);
  // const showAccelerateGuide = localStorage.getItem('integrationCreated') === 'true';



  const initialState = {
    firstGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN),
    secondGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN),
    subscribeModalOpened: isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN),
    getCoinsGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN),
    createIntegrationFirstGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN),
    createIntegrationSecondGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN),
  };

  function guideReducer(state: any, action: { type: any; payload: string }) {
    switch (action.type) {
      case 'SET_GUIDE_SHOWN':
        setGuideShown(action.payload);
        return { ...state, [action.payload]: true };
      case 'SET_GUIDE_NOT_SHOWN':
        localStorage.setItem(action.payload, '0');
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

  const setGuideNotShown = (guideId: string) => {
    dispatch({type: 'SET_GUIDE_NOT_SHOWN', payload: guideId});
  }

  useEffect(() => {
    if (creatingIntegrationModalState.isOpen) {
      closeModal(MODALS.SUBSCRIBE);
    }
  }, [creatingIntegrationModalState.isOpen]);

  useEffect(() => {
    reduxDispatch(setActiveFooterItemId(2));

    if (isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN)
      && !isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN) && !purchasingSubscriptionModalState.isOpen) {
        console.log('subscr case 1')
      openModal(MODALS.SUBSCRIBE);
    }

    if (isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN)
      && !isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN)) {
      navigate(AppRoute.Shop);
    }

    if (
      isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN) &&
      !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN) &&
      !getSubscriptionPurchased()
      && data?.count === 0
    ) {
      console.log('subscr case 2')
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

    if (isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN)
      && !isGuideShown(GUIDE_ITEMS.shopPage.ITEM_BOUGHT)) {
      navigate(AppRoute.Shop);
    }

    if (isGuideShown(GUIDE_ITEMS.shopPage.ITEM_BOUGHT) && !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE)) {
      navigate(AppRoute.ShopInventory);
    }


  }, []);

  const isIntegrationReadyForPublishing = !useSelector((state: RootState) => state.guide.integrationReadyForPublishing);
  const isPublishedModalClosed = useSelector((state: RootState) => state.guide.isPublishedModalClosed);

  const { isLoading: isCurrentUserProfileInfoLoading } = useGetProfileMeQuery();
  const { isLoading: isIntegrationsLoading } = useGetIntegrationsQuery({ status: 'creating' });
  const { isLoading: isRoomLoading } = useGetEquipedQuery();

  useEffect(() => {
    reduxDispatch(setActiveFooterItemId(2));
  }, []);


  const isLoading =
    isAllIntegrationsLoading
    || isCurrentUserProfileInfoLoading || isIntegrationsLoading || isRoomLoading || isInventoryDataLoading;

  if (isLoading) return <Loader />;

  const accelerateIntegration = () => {
    if (integrationCurrentlyCreating) {
      reduxDispatch(incrementAcceleration());
    }
  };

  return (
    <main className={s.page} onClick={accelerateIntegration}>
      <DaysInARowModal onClose={() => closeModal(MODALS.DAYS_IN_A_ROW)} />
      {integrationCurrentlyCreating && (
        <div
          style={{
            position: 'absolute',
            top: '0',
            zIndex: '15000',
            height: '70%',
            width: '100%',
            backgroundColor: 'transparent',
          }}
          onClick={accelerateIntegration}
        />
      )}

      <Room mode="me" />

      {isIntegrationReadyForPublishing ? <IntegrationCreation /> : <PublishIntegrationButton />}

      {(!guideVisibility.firstGuideShown) && (
        <InitialGuide onClose={() => {
          console.log('closing init guide');
          handleGuideClose(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN);
        }} />
      )}

      {(!guideVisibility.secondGuideShown && guideVisibility.firstGuideShown) && (
        <SubscrieGuide
          onClose={() => {
            console.log('asdasdfsdgm,. hjmniklo;.cxv')
            handleGuideClose(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN);
            openModal(MODALS.SUBSCRIBE);
            reduxDispatch(setSubscribeGuideShown(false));
          }}
          top="50%"
          zIndex={12500}
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

      {(!isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN) && isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN)) && (
        <GetCoinsGuide
          onClose={() => {
            reduxDispatch(setGetCoinsGuideShown(true));
            setGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN);
            handleGuideClose(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN);
            openModal(MODALS.SUBSCRIBE);
          }}
        />
      )}

      {(integrationCurrentlyCreating && !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED)) && (
        <AccelerateIntegtrationGuide
          onClose={() => {
            setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED);
            reduxDispatch(setAccelerateIntegrationGuideClosed(true));
          }}
        />
      )}

      {(isPublishedModalClosed && !isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN)) && (
        <IntegrationCreatedGuide
          onClose={() => {
            setGuideShown(GUIDE_ITEMS.creatingIntegration.GO_TO_INTEGRATION_GUIDE_SHOWN);
            handleGuideClose(GUIDE_ITEMS.creatingIntegration.GO_TO_INTEGRATION_GUIDE_SHOWN);
            navigate(AppRoute.Integration.replace(':integrationId', integrationId));
          }}
        />
      )}

      {(isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN) &&
        !isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN)) && (
          <FinishTutorialGuide
            onClose={() => setGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN)}
          />
        )}

      <RewardForIntegrationModal />
      {/* Награда с указанием медали и количества интеграций с определенной компанией */}
      <IntegrationRewardModal />
    </main>
  );
};
