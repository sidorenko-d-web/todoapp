import { FC, useEffect, useReducer } from 'react';
import { AccelerateIntegtrationGuide, CreatingIntegrationGuide, FinishTutorialGuide, GetCoinsGuide, InitialGuide, IntegrationCreatedGuide, IntegrationCreation, PublishIntegrationButton, SubscrieGuide } from '../../components';
import s from './MainPage.module.scss';
import { AppRoute, MODALS } from '../../constants';
import { useModal } from '../../hooks';

import { GUIDE_ITEMS } from '../../constants/guidesConstants';
import { getSubscriptionPurchased, isGuideShown, setGuideShown } from '../../utils';

import { setAccelerateIntegrationGuideClosed, setActiveFooterItemId, setGetCoinsGuideShown, setIntegrationReadyForPublishing, setLastIntegrationId } from "../../redux/slices/guideSlice.ts";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useGetAllIntegrationsQuery } from '../../redux';
import RewardForIntegrationModal from '../DevModals/RewardForIntegrationModal/RewardForIntegrationModal.tsx';
import { useNavigate } from 'react-router-dom';

export const MainPage: FC = () => {
  const { getModalState, openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();

  const { data } = useGetAllIntegrationsQuery();

  const integrationId = useSelector((state: RootState) => state.guide.lastIntegrationId);


  useEffect(() => {
    if (data) {
      if (data.integrations[0].status === 'created') {
        reduxDispatch(setIntegrationReadyForPublishing(true));
        reduxDispatch(setLastIntegrationId(data.integrations[0].id));
      } else {
        reduxDispatch(setIntegrationReadyForPublishing(false));
        reduxDispatch(setLastIntegrationId(""));
      }
    }
  }, [data]);

  const showAccelerateGuide = useSelector((state: RootState) => state.guide.integrationCreated);

  const initialState = {
    firstGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN),
    secondGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN),
    subscribeModalOpened: isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIBE_MODAL_OPENED),
    getCoinsGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN),
    createIntegrationFirstGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN),
    createIntegrationSecondGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN),
  };

  function guideReducer(state: any, action: { type: any; payload: string; }) {
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

    reduxDispatch(setActiveFooterItemId(2));


    if (isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN)
      && !isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIBE_MODAL_OPENED) && !purchasingSubscriptionModalState.isOpen) {
      openModal(MODALS.SUBSCRIBE);
    }

    if (isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN)
      && !isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN)) {
      navigate(AppRoute.Shop);
    }

    if (isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN)
      && !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN)
      && !getSubscriptionPurchased()) {
      openModal(MODALS.SUBSCRIBE);
    }

    if (isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_BOUGHT)
      && !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN) && !creatingIntegrationModalState.isOpen) {
      openModal(MODALS.CREATING_INTEGRATION);
    }

    if (isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN)
      && !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN) && !creatingIntegrationModalState.isOpen) {
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

  return (
    <main className={s.page}>
      {!useSelector((state: RootState) => state.guide.integrationReadyForPublishing) ? <IntegrationCreation /> : <PublishIntegrationButton />}

      {!guideVisibility.firstGuideShown && (
        <InitialGuide
          onClose={() => handleGuideClose(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN)}
        />
      )}

      {(!guideVisibility.secondGuideShown && guideVisibility.firstGuideShown) && (
        <SubscrieGuide
          onClose={() => {
            handleGuideClose(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN);
            openModal(MODALS.SUBSCRIBE);
          }}
          top="50%"
          zIndex={1500}
          description={
            <>
              В MiniApp ты сможешь почувствовать себя настоящим блогером и зарабатывать, создавая контент!
              <br />
              <br />
              Давай <span style={{ color: '#2F80ED' }}>создадим твою первую интеграцию</span>!
            </>
          }
        />
      )}

      {(guideVisibility.secondGuideShown &&
        !guideVisibility.subscribeModalOpened &&
        purchasingSubscriptionModalState.isOpen) && (
          <SubscrieGuide
            onClose={() => {
              closeModal(MODALS.SUBSCRIBE);
              handleGuideClose(GUIDE_ITEMS.mainPage.SUBSCRIBE_MODAL_OPENED);
            }}
            top="65%"
            zIndex={1500}
            description={
              <>
                Чтобы получить доступ к интеграциям от разных брендов,{' '}
                <span style={{ color: '#2F80ED' }}>надо оформить подписку!</span>
                <br />
                <br />
                Пока подписка активна, ты можешь делать любые интеграции на выбор: фото, видео или текст!
              </>
            }
          />
        )}

      {(!purchasingSubscriptionModalState.isOpen &&
        guideVisibility.subscribeModalOpened &&
        !guideVisibility.getCoinsGuideShown) && (
          <GetCoinsGuide
            onClose={() => {
              reduxDispatch(setGetCoinsGuideShown(true));
              handleGuideClose(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN);
              openModal(MODALS.SUBSCRIBE);
            }}
          />
        )}

      {(creatingIntegrationModalState.isOpen &&
        !guideVisibility.createIntegrationFirstGuideShown) && (
          <CreatingIntegrationGuide
            onClose={() => handleGuideClose(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN)}
            buttonText="Отлично!"
            description={
              <>
                Вверху можно увидеть <span style={{ color: '#2F80ED' }}>актуальные тренды.</span>
                <br />
                <br />
                Если будешь делать интеграции о том, что сейчас актуально - твой заработок будет больше!
              </>
            }
            align="left"
            top="69%"
          />
        )}

      {(creatingIntegrationModalState.isOpen &&
        guideVisibility.createIntegrationFirstGuideShown &&
        !guideVisibility.createIntegrationSecondGuideShown) && (
          <CreatingIntegrationGuide
            onClose={() => handleGuideClose(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN)}
            buttonText="Хорошо!"
            description={
              <>
                Интеграции бывают трех видов: <span style={{ color: '#2F80ED' }}>Текстовые, Фото и Видео. </span>
                <br />
                <br />
                Ты можешь делать любые интеграции, но для начала нужно купить необходимую аппаратуру.
              </>
            }
            align="right"
            top="66%"
          />
        )}

      {
        (showAccelerateGuide && !creatingIntegrationModalState.isOpen && !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED)) && (
          <AccelerateIntegtrationGuide onClose={() => {
            setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED);
            reduxDispatch(setAccelerateIntegrationGuideClosed(true));
          }} />
        )
      }

      {
        ((!isGuideShown(GUIDE_ITEMS.creatingIntegration.GO_TO_INTEGRATION_GUIDE_SHOWN)
            && useSelector((state: RootState) => state.guide.isPublishedModalClosed) ) && (
            <IntegrationCreatedGuide onClose={() => {
              setGuideShown(GUIDE_ITEMS.creatingIntegration.GO_TO_INTEGRATION_GUIDE_SHOWN);
              handleGuideClose(GUIDE_ITEMS.creatingIntegration.GO_TO_INTEGRATION_GUIDE_SHOWN);
              navigate(AppRoute.Integration.replace(':integrationId', integrationId))
            }
            } />
          ))
      }

      {
        (isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN)
          && !isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN) &&
          <FinishTutorialGuide onClose={() => setGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN)} />)
      }

      <RewardForIntegrationModal />

    </main>
  );
};