import { FC, useEffect, useMemo, useState } from 'react';
import {
  AccelerateIntegtrationGuide,
  FinishTutorialGuide,
  GetCoinsGuide,
  InitialGuide,
  IntegrationCreation,
  IntegrationRewardModal,
  Loader,
  PublishIntegrationButton,
  Room,
  SubscrieGuide,
  TrackedLink,
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
  setDimHeader,
  setFooterActive,
  setGetCoinsGuideShown,
  setIntegrationReadyForPublishing,
  setLastIntegrationId,
  setSubscribeGuideShown,
  useGetEquipedQuery,
  useGetIntegrationsQuery,
  useGetInventoryItemsQuery,
  useGetProfileMeQuery,
  useGetTreeInfoQuery,
  useGetUserQuery,
  useGetUserWelcomeBonusQuery,
} from '../../redux';
import { useDispatch, useSelector } from 'react-redux';
import RewardForIntegrationModal from '../DevModals/RewardForIntegrationModal/RewardForIntegrationModal.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { incrementAcceleration } from '../../redux/slices/integrationAcceleration.ts';
import DaysInARowModal from '../DevModals/DaysInARowModal/DaysInARowModal.tsx';
import Lottie from 'lottie-react';
import { giftShake } from '../../assets/animations';
import { hasAvailableTreeReward } from '../../helpers';
import clsx from 'clsx';
import { WithModal } from '../../components/shared/WithModal/WithModa.tsx';

export const MainPage: FC = () => {
  const { t } = useTranslation('guide');
  const { getModalState, openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const { data, refetch, isLoading: isAllIntegrationsLoading } = useGetIntegrationsQuery();

  const { data: profileData, isLoading: isCurrentUserProfileInfoLoading } = useGetProfileMeQuery();

  const location = useLocation();

  const { data: userData } = useGetUserQuery();

  const { data: welcomeBonusData } = useGetUserWelcomeBonusQuery(
    { user_id: userData?.id || 0 },
    {
      skip: !userData,
    },
  );

  const setRerender = useState(0)[1];
  //не убирать, нужно, чтобы гайды правильно отображались

  const [typewriterFound, setTypewriterFound] = useState(false);
  const { data: itemsData, isLoading: isInventoryDataLoading } = useGetInventoryItemsQuery();
  const integrationCurrentlyCreating = useSelector((state: RootState) => state.acceleration.integrationCreating);

  const firstIntegrationCreating = useSelector((state: RootState) => state.guide.firstIntegrationCreating);

  useEffect(() => {
    if (integrationCurrentlyCreating) {
      reduxDispatch(setDimHeader(false));
    }
  }, [integrationCurrentlyCreating]);

  useEffect(() => {
    if (itemsData && !isInventoryDataLoading && profileData && !isCurrentUserProfileInfoLoading) {
      if (itemsData.count > 0) {
        setTypewriterFound(true);

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
      } else {
        if (profileData.subscription_integrations_left === 0) {
          // setRerender(prev => prev + 1);
          // Object.values(GUIDE_ITEMS).forEach(category => {
          //   Object.values(category).forEach(value => {
          //     localStorage.setItem(value, '0');
          //     console.log('GUIDE... ', value);
          //   });
          // });
          // setRerender(prev => prev + 1);
        }
      }
    }
  }, [itemsData?.count, isInventoryDataLoading, typewriterFound, profileData?.id, isCurrentUserProfileInfoLoading]);

  useEffect(() => {
    if (typeof data?.count !== 'undefined' && data?.count > 0) {
      if (data?.count > 2) {
        Object.values(GUIDE_ITEMS).forEach(category => {
          Object.values(category).forEach(value => {
            localStorage.setItem(value, '1');
          });
        });
      }
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
        setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED_MODAL_CLOSED);
        setGuideShown(GUIDE_ITEMS.creatingIntegration.FIRST_INTEGRATION_CREATED);
        setGuideShown(GUIDE_ITEMS.creatingIntegration.PUSHLINE_MODAL_OPENED);
        setGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN);
        setGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_STATS_GUIDE_SHOWN);

        reduxDispatch(resetGuideState());

        reduxDispatch(setFooterActive(true));
        reduxDispatch(setActiveFooterItemId(3));
      } else {
        if (
          data?.integrations[0].status === 'published' &&
          !getModalState(MODALS.INTEGRATION_REWARD).isOpen &&
          localStorage.getItem('integrationCreatedGuideOpen') !== '1'
        ) {
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
          reduxDispatch(setActiveFooterItemId(3));
        }
      }
    }
  }, [data?.count, isInventoryDataLoading]);

  useEffect(() => {
    localStorage.setItem('GIFT_FOR_TREE_STAGE', '0');
  }, []);

  useEffect(() => {
    if (data) {
      if (data.count === 0) {
        if (itemsData) {
          if (itemsData.count > 0) {
            setRerender(prev => prev + 1);
            // MainPage items
            setGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN);
            setGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN);
            setGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_BOUGHT);
            setGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN);
            setGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN);
            setGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN);
            setGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN);
            setGuideShown(GUIDE_ITEMS.mainPage.MAIN_PAGE_GUIDE_FINISHED);

            // ShopPage items
            setGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN);
            setGuideShown(GUIDE_ITEMS.shopPage.ITEM_BOUGHT);
            setGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE);
            setRerender(prev => prev + 1);
          }
        }
      }
    }
  }, [data?.count, isAllIntegrationsLoading, itemsData?.count, isInventoryDataLoading]);

  useEffect(() => {
    if (isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN)) {
      reduxDispatch(setDimHeader(false));
    }
  }, []);

  useEffect(() => {
    if (profileData && !isCurrentUserProfileInfoLoading) {
      // setCurrentUserLevel(userProfileData.growth_tree_stage_id);
      localStorage.setItem('USER_LEVEL', '' + profileData.growth_tree_stage_id);
    }
  }, [profileData?.id, isCurrentUserProfileInfoLoading]);

  //const integrationId = useSelector((state: RootState) => state.guide.lastIntegrationId);

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
        if (
          isGuideShown(GUIDE_ITEMS.creatingIntegration.PUBLISHED_MODAL_OPENED) &&
          !isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN) &&
          !getModalState(MODALS.INTEGRATION_REWARD_CONGRATULATIONS).isOpen
        ) {
          reduxDispatch(setFooterActive(true));
          navigate(`/integrations/${data?.integrations[0].id}`);
        }
      }
    });
  }, [data?.count, isAllIntegrationsLoading]);
  // const showAccelerateGuide = useSelector((state: RootState) => state.guide.integrationCreated);
  // const showAccelerateGuide = localStorage.getItem('integrationCreated') === 'true';

  const purchasingSubscriptionModalState = getModalState(MODALS.SUBSCRIBE);
  const creatingIntegrationModalState = getModalState(MODALS.CREATING_INTEGRATION);

  useEffect(() => {
    if (creatingIntegrationModalState.isOpen) {
      closeModal(MODALS.SUBSCRIBE);
    }
  }, [creatingIntegrationModalState.isOpen]);

  useEffect(() => {
    reduxDispatch(setActiveFooterItemId(3));

    if (
      isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN) &&
      !isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN) &&
      !purchasingSubscriptionModalState.isOpen
    ) {
      openModal(MODALS.SUBSCRIBE);
    }

    if (
      isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN) &&
      !isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN) &&
      !getModalState(MODALS.CREATING_INTEGRATION).isOpen
    ) {
      navigate(AppRoute.Shop);
    }

    if (
      isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN) &&
      !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN) &&
      !getSubscriptionPurchased() &&
      getModalState(MODALS.SUBSCRIBE).isOpen &&
      data?.count === 0
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

    if (
      isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN) &&
      !isGuideShown(GUIDE_ITEMS.shopPage.ITEM_BOUGHT)
    ) {
      navigate(AppRoute.Shop);
    }

    if (isGuideShown(GUIDE_ITEMS.shopPage.ITEM_BOUGHT) && !isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE)) {
      navigate(AppRoute.ShopInventory);
    }

    if (
      isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED_MODAL_CLOSED) &&
      !isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN) &&
      !getModalState(MODALS.DAYS_IN_A_ROW).isOpen &&
      !getModalState(MODALS.DAYS_IN_A_ROW).isOpen
    ) {
      //openModal(MODALS.DAYS_IN_A_ROW);
    }
  }, []);

  useEffect(() => {
    reduxDispatch(setActiveFooterItemId(3));
  }, [location.pathname]);

  // const isIntegrationReadyForPublishing = !useSelector((state: RootState) => state.guide.integrationReadyForPublishing);
  const isPublishedModalClosed = useSelector((state: RootState) => state.guide.isPublishedModalClosed);

  const firstIntegrationReadyToPublish = useSelector((state: RootState) => state.guide.firstIntegrationReadyToPublish);

  useEffect(() => {
    if (isPublishedModalClosed && !isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN)) {
      //openModal(MODALS.DAYS_IN_A_ROW);
    }
  }, [isPublishedModalClosed]);

  const { isLoading: isIntegrationsLoading } = useGetIntegrationsQuery({ status: 'creating' });
  const { isLoading: isRoomLoading } = useGetEquipedQuery();

  // Это условие проверяет есть ли в data интеграции со статусон,
  // но нужно обратить внимание на количество приходящих интеграций,
  // !а то кнопка публикации может не появиться
  const hasCreatingIntegrations = !data?.integrations.some(
    integration =>
      integration.status === 'created' || (integration.status === 'creating' && integration.time_left === 0),
  );

  useEffect(() => {
    reduxDispatch(setActiveFooterItemId(3));
  }, []);

  const { data: treeData } = useGetTreeInfoQuery();
  const showAvailableReward = useMemo(() => {
    if (treeData) {
      return hasAvailableTreeReward(treeData.growth_tree_stages);
    }
  }, [treeData?.count]);

  const { data: creatingIntegrations, isLoading: isCreatingIntegrationsLoading } = useGetIntegrationsQuery({
    status: 'creating',
  });

  const isCreatingIntegration = creatingIntegrations && creatingIntegrations.count > 0;

  const [isRoomLoaded, setIsRoomLoaded] = useState(false);

  const isLoading =
    isCreatingIntegrationsLoading ||
    isAllIntegrationsLoading ||
    isCurrentUserProfileInfoLoading ||
    isIntegrationsLoading ||
    isRoomLoading ||
    isInventoryDataLoading;

  if (isLoading) return <Loader />;

  const accelerateIntegration = () => {
    console.log('_acceleration');
    if (integrationCurrentlyCreating || firstIntegrationCreating || hasCreatingIntegrations) {
      reduxDispatch(incrementAcceleration());
    }
  };

  const onCloseDaysInARowModal = () => {
    if (isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN)) {
      closeModal(MODALS.DAYS_IN_A_ROW);
    }
  };

  const onCloseInitialGuide = () => {
    setGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN);
    setRerender(prev => prev + 1);
  };

  const onCloseSubscribersGuide = () => {
    setGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN);
    openModal(MODALS.SUBSCRIBE);
    reduxDispatch(setSubscribeGuideShown(true));
    setRerender(prev => prev + 1);
  };

  const onCloseGetCoinsGuide = () => {
    reduxDispatch(setGetCoinsGuideShown(true));
    setGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN);
    setGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN);
    setRerender(prev => prev + 1);
    openModal(MODALS.SUBSCRIBE);
  };

  const onCloseAccelerateIntegtrationGuide = () => {
    setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED);
    reduxDispatch(setAccelerateIntegrationGuideClosed(true));
    setRerender(prev => prev + 1);
  };

  const onCloseFinishTutorialGuide = () => {
    reduxDispatch(setDimHeader(false));
    setGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN);
    setRerender(prev => prev + 1);
  };

  return (
    <main className={s.page} onClick={accelerateIntegration}>
      {!isLoading && isRoomLoaded && showAvailableReward && (
        <TrackedLink
          to={AppRoute.ProgressTree}
          trackingData={{
            eventType: 'button',
            eventPlace: 'mainPage tree reward',
          }}
        >
          <Lottie
            style={integrationCurrentlyCreating ? { marginBottom: '45px', zIndex: '1001' } : { zIndex: '1001' }}
            animationData={giftShake}
            className={clsx(s.treeReward, { [s.up]: isCreatingIntegration })}
          />
        </TrackedLink>
      )}

      {(integrationCurrentlyCreating || firstIntegrationCreating || hasCreatingIntegrations) && (
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            zIndex: '1000',
            height: '100vh',
            width: '100%',
            background: 'transparent',
          }}
          onClick={accelerateIntegration}
        />
      )}
      <Room mode="me" setIsRoomLoaded={setIsRoomLoaded} />
      {isRoomLoaded &&
        (hasCreatingIntegrations && !firstIntegrationReadyToPublish ? (
          <IntegrationCreation />
        ) : (
          <>
            <WithModal
              modalId={MODALS.DAYS_IN_A_ROW}
              component={<DaysInARowModal onClose={onCloseDaysInARowModal} />}
            />
            <PublishIntegrationButton />
          </>
        ))}
      {((isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN) &&
        !isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN) &&
        !getModalState(MODALS.SUBSCRIBE).isOpen) ||
        (isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) &&
          !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED)) ||
        firstIntegrationCreating) && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: '0',
            left: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            pointerEvents: 'none',
            zIndex: '500',
          }}
        />
      )}
      <InitialGuide onClose={onCloseInitialGuide} />
      <SubscrieGuide
        onClose={onCloseSubscribersGuide}
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
      {!isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN) &&
        isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN) && (
          <GetCoinsGuide
            welcomeBonus={welcomeBonusData?.welcome_bonus || '500'}
            refBonus={welcomeBonusData?.referrer_bonus || '250'}
            onClose={onCloseGetCoinsGuide}
          />
        )}
      {firstIntegrationCreating &&
        !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED) && (
          <AccelerateIntegtrationGuide onClose={onCloseAccelerateIntegtrationGuide} />
        )}
      {isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN) &&
        !isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN) && (
          <FinishTutorialGuide onClose={onCloseFinishTutorialGuide} />
        )}
      <WithModal modalId={MODALS.INTEGRATION_REWARD} component={<RewardForIntegrationModal />} />
      <WithModal modalId={MODALS.INTEGRATION_REWARD_CONGRATULATIONS} component={<IntegrationRewardModal />} />
      <WithModal modalId={MODALS.DAYS_IN_A_ROW} component={<DaysInARowModal onClose={onCloseDaysInARowModal} />} />
    </main>
  );
};
