import { FC, useReducer } from 'react';
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
import { isGuideShown, setGuideShown } from '../../utils';

import {
  setAccelerateIntegrationGuideClosed,
  setGetCoinsGuideShown,
} from '../../redux/slices/guideSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import RewardForIntegrationModal from '../DevModals/RewardForIntegrationModal/RewardForIntegrationModal.tsx';
import { useNavigate } from 'react-router-dom';

export const MainPage: FC = () => {
  const { getModalState, openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();

  const readyForPublishing = useSelector(
    (state: RootState) => state.guide.integrationReadyForPublishing,
  );

  const showAccelerateGuide = useSelector(
    (state: RootState) => state.guide.integrationCreated,
  );
  const publishedModalClosed = useSelector(
    (state: RootState) => state.guide.isPublishedModalClosed,
  );

  const initialState = {
    firstGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN),
    secondGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN),
    subscribeModalOpened: isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIBE_MODAL_OPENED),
    getCoinsGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN),
    createIntegrationFirstGuideShown: isGuideShown(
      GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN,
    ),
    createIntegrationSecondGuideShown: isGuideShown(
      GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN,
    ),
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

  const integrationId = useSelector(
    (state: RootState) => state.guide.createdIntegrationId,
  );
  return (
    <main className={s.page}>
      <Room />
      {!readyForPublishing && <IntegrationCreation />}

      {!guideVisibility.firstGuideShown && (
        <InitialGuide
          onClose={() => handleGuideClose(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN)}
        />
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
              В MiniApp ты сможешь почувствовать себя настоящим блогером и зарабатывать,
              создавая контент!
              <br />
              <br />
              Давай{' '}
              <span style={{ color: '#2F80ED' }}>создадим твою первую интеграцию</span>!
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
                Чтобы получить доступ к интеграциям от разных брендов,{' '}
                <span style={{ color: '#2F80ED' }}>надо оформить подписку!</span>
                <br />
                <br />
                Пока подписка активна, ты можешь делать любые интеграции на выбор: фото,
                видео или текст!
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
            isReferral={true}
          />
        )}

      {creatingIntegrationModalState.isOpen &&
        !guideVisibility.createIntegrationFirstGuideShown && (
          <CreatingIntegrationGuide
            onClose={() =>
              handleGuideClose(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN)
            }
            buttonText="Отлично!"
            description={
              <>
                Вверху можно увидеть{' '}
                <span style={{ color: '#2F80ED' }}>актуальные тренды.</span>
                <br />
                <br />
                Если будешь делать интеграции о том, что сейчас актуально - твой заработок
                будет больше!
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
            onClose={() =>
              handleGuideClose(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN)
            }
            buttonText="Хорошо!"
            description={
              <>
                Интеграции бывают трех видов:{' '}
                <span style={{ color: '#2F80ED' }}>Текстовые, Фото и Видео. </span>
                <br />
                <br />
                Ты можешь делать любые интеграции, но для начала нужно купить необходимую
                аппаратуру.
              </>
            }
            align="right"
            top="66%"
          />
        )}

      {showAccelerateGuide &&
        !creatingIntegrationModalState.isOpen &&
        !isGuideShown(
          GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED,
        ) && (
          <AccelerateIntegtrationGuide
            onClose={() => {
              setGuideShown(
                GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED,
              );
              reduxDispatch(setAccelerateIntegrationGuideClosed(true));
            }}
          />
        )}

      {publishedModalClosed &&
        !isGuideShown(GUIDE_ITEMS.integration.INTEGRATION_INITIAL_GUIDE_SHOWN) && (
          <IntegrationCreatedGuide
            onClose={() => {
              setGuideShown(GUIDE_ITEMS.integration.INTEGRATION_INITIAL_GUIDE_SHOWN);
              handleGuideClose(
                GUIDE_ITEMS.creatingIntegration.GO_TO_INTEGRATION_GUIDE_SHOWN,
              );
              navigate(AppRoute.Integration.replace(':integrationId', integrationId));
            }}
          />
        )}

      {isGuideShown(GUIDE_ITEMS.integration.INTEGRATION_INITIAL_GUIDE_SHOWN) &&
        !isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN) && (
          <FinishTutorialGuide
            onClose={() =>
              setGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN)
            }
          />
        )}

      {readyForPublishing && <PublishIntegrationButton />}
      <RewardForIntegrationModal />
    </main>
  );
};
