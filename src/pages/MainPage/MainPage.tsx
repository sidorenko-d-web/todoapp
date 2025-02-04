import { FC, useEffect, useState } from 'react';
import { IntegrationCreation, IntegrationCreationModal } from '../../components';

import s from './MainPage.module.scss';

import { MODALS } from '../../constants';
import { useModal } from '../../hooks';
import { InitialGuide } from '../../components/guide/MainPageGuides/InitialGuide/InitialGuide';
import { CreateIntegrationGuide } from '../../components/guide/MainPageGuides/CreateIntegrationGuide/CreateIntegrationGuide';
import { GetCoinsGuide } from '../../components/guide/MainPageGuides/GetCoinsGuide/GetCoinsGuide';
import { CreatingIntegrationGuide } from '../../components/guide/MainPageGuides/CreatingIntegrationGuide/CreatingIntegrationGuide';


export const MainPage: FC = () => {
  const [currentIntegration, setCurrentIntegration] = useState(0);
  const [isButtonGlowing, setIsButtonGlowing] = useState(false);

  const [wasCreatingIntegrationModalOpened, setWasCreatingIntegrationModalOpened] = useState(false);

  const { getModalState, closeModal, openModal } = useModal();

  const purchasingSubscriptionModalState = getModalState(MODALS.SUBSCRIBE);
  const creatingIntegrationModalState = getModalState(MODALS.CREATING_INTEGRATION);


  useEffect(() => {
    if (wasCreatingIntegrationModalOpened && !purchasingSubscriptionModalState.isOpen) {
      setCurrentIntegration(3);
      setWasCreatingIntegrationModalOpened(false);
    }
  }, [purchasingSubscriptionModalState.isOpen, wasCreatingIntegrationModalOpened]);

  useEffect(() => {
    if (creatingIntegrationModalState.isOpen) {
      console.log('CREATING INTEGRATION!!!!! ');
    }
  }, [creatingIntegrationModalState.isOpen]);

  useEffect(() => {
    sessionStorage.setItem('currentTrendsGuideShown', '1');
    sessionStorage.setItem('createIntegrationLightningsGlowing', '1');
  }, []);
  // useEffect(() => {
  //   openModal(MODALS.CREATING_INTEGRATION)
  // }, []);

  return (
    <main className={s.page}>
      <div
        onClick={() => {
          const wasSubscribeGuideShown = sessionStorage.getItem('needToSubscribeGuideShown') === '1';

          if (!wasSubscribeGuideShown) {
            setCurrentIntegration(2);
            setIsButtonGlowing(false);
            setWasCreatingIntegrationModalOpened(true);
          }
        }}
        style={{ zIndex: isButtonGlowing ? '2000' : '5' }}
      >
        <IntegrationCreation isButtonGlowing={isButtonGlowing} />
      </div>

      {/* {currentIntegration === 0 && (
        <InitialGuide
          onClose={() => {
            setCurrentIntegration(1);
            setIsButtonGlowing(true);
          }}
        />
      )}

      {currentIntegration === 1 && (
        <CreateIntegrationGuide
          onClose={() => {
            setCurrentIntegration(-1);
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

      {currentIntegration === 2 && (
        <CreateIntegrationGuide
          onClose={() => {
            setIsButtonGlowing(false);
            setCurrentIntegration(-1);
            closeModal(MODALS.SUBSCRIBE);
            sessionStorage.setItem('needToSubscribeGuideShown', '1');
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

      {currentIntegration === 3 && (
        <GetCoinsGuide
          onClose={() => {
            setCurrentIntegration(-1);
            sessionStorage.setItem('hasToBuySubscriptionGuide', '1');
          }}
          isReferral={true}
        />
      )}
       */}
      {(creatingIntegrationModalState.isOpen && sessionStorage.getItem('currentTrendsGuideShown') === '1') && (
        <CreatingIntegrationGuide onClose={() => {
          setCurrentIntegration(5);
          sessionStorage.setItem('subscriptionBought', '0');
          sessionStorage.setItem('currentTrendsGuideShown', '0');
          sessionStorage.setItem('createIntegrationLightningsGlowing', '0');
          sessionStorage.setItem('createIntegrationTabsGlowing', '1');
        }}
          buttonText='Отлично!'
          description={
            <>
              Вверху можно увидеть <span style={{ color: '#2F80ED' }}>актуальные тренды.</span>
              <br />
              <br />
              Если будешь делать интеграции о том, что сейчас актуально - твой заработок будет больше!
            </>
          }
          align='left'
          top='69%' />
      )}

      {currentIntegration == 5 && (
        <CreatingIntegrationGuide onClose={() => {
          console.log('abc')
          setCurrentIntegration(-1);
          sessionStorage.setItem('createIntegrationTabsGlowing', '0');
          sessionStorage.setItem('goToStoreBtnGlowing', '1');
          console.log('bca')
        }}
          buttonText='Хорошо!'
          description={
            <>
              Интеграции бывают трех видов:  <span style={{ color: '#2F80ED' }}>Текстовые, Фото и Видео. </span>
              <br />
              <br />
              Ты можешь делать любые интеграции, но для начала нужно купить необходимую аппаратуру.
            </>
          }
          align='right'
          top='66%' />
      )}
    </main>
  );
};