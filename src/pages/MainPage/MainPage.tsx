import { FC, useEffect, useState } from 'react';
import { IntegrationCreation } from '../../components';

import s from './MainPage.module.scss';

import { MODALS } from '../../constants';
import { useModal } from '../../hooks';
import { InitialGuide } from '../../components/guide/MainPageGuides/InitialGuide/InitialGuide';
import { CreateIntegrationGuide } from '../../components/guide/MainPageGuides/CreateIntegrationGuide/CreateIntegrationGuide';
import { GetCoinsGuide } from '../../components/guide/MainPageGuides/GetCoinsGuide/GetCoinsGuide';


export const MainPage: FC = () => {
  const [currentIntegration, setCurrentIntegration] = useState(0);
  const [isButtonGlowing, setIsButtonGlowing] = useState(false);

  const [wasCreatingIntegrationModalOpened, setWasCreatingIntegrationModalOpened] = useState(false);

  const { getModalState } = useModal();

  const creatingIntegrationModalState = getModalState(MODALS.SUBSCRIBE);


  useEffect(() => {
    if (wasCreatingIntegrationModalOpened && !creatingIntegrationModalState.isOpen) {
      setCurrentIntegration(3);
      setWasCreatingIntegrationModalOpened(false);
    }
  }, [creatingIntegrationModalState.isOpen, wasCreatingIntegrationModalOpened]);


  return (
    <main className={s.page}>
      <div
        onClick={() => {
          setCurrentIntegration(2);
          setIsButtonGlowing(false);
          setWasCreatingIntegrationModalOpened(true);
        }}
        style={{ zIndex: isButtonGlowing ? '2000' : '5' }}
      >
        <IntegrationCreation isButtonGlowing={isButtonGlowing} />
      </div>

      {currentIntegration === 0 && (
        <InitialGuide
          onClose={() => {
            setCurrentIntegration(1);
            setIsButtonGlowing(true);
          }}
        />
      )}

      {currentIntegration === 1 && (
        <CreateIntegrationGuide
          onClose={() => setCurrentIntegration(-1)} 
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
          onClose={() => setCurrentIntegration(-1)} 
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
          onClose={() => setCurrentIntegration(-1)} 
          isReferral={true}
        />
      )}
    </main>
  );
};