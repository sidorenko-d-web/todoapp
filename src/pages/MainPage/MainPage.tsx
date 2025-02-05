import { FC, useState } from 'react';
import { CreatingIntegrationGuide, GetCoinsGuide, InitialGuide, IntegrationCreation, SubscrieGuide } from '../../components';
import s from './MainPage.module.scss';
import { MODALS } from '../../constants';
import { useModal } from '../../hooks';

import { GUIDE_ITEMS } from '../../constants/guidesConstants';
import { isGuideShown, setGuideShown } from '../../utils';

export const MainPage: FC = () => {
  const { getModalState, closeModal, openModal } = useModal();

  const [guideVisibility, setGuideVisibility] = useState({
    firstGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN),
    secondGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN),
    subscribeModalOpened: isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIBE_MODAL_OPENED),
    getCoinsGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN),
    createIntegrationFirstGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN),
    createIntegrationSecondGuideShown: isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN),
  });

  const purchasingSubscriptionModalState = getModalState(MODALS.SUBSCRIBE);
  const creatingIntegrationModalState = getModalState(MODALS.CREATING_INTEGRATION);

  const handleGuideClose = (guideId: string) => {
    setGuideShown(guideId);
    setGuideVisibility((prev) => ({
      ...prev,
      [guideId]: true,
    }));
  };

  return (
    <main className={s.page}>
      <IntegrationCreation />

      {/* Initial Guide */}
      {!guideVisibility.firstGuideShown && (
        <InitialGuide
          onClose={() => handleGuideClose(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN)}
        />
      )}

      {/* Second Guide */}
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
              В MiniApp ты сможешь почувствовать себя настоящим блогером и зарабатывать, создавая контент!
              <br />
              <br />
              Давай <span style={{ color: '#2F80ED' }}>создадим твою первую интеграцию</span>!
            </>
          }
        />
      )}

      {/* Subscription Modal Guide */}
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
                Пока подписка активна, ты можешь делать любые интеграции на выбор: фото, видео или текст!
              </>
            }
          />
        )}

      {/* Get Coins Guide */}
      {!purchasingSubscriptionModalState.isOpen &&
        guideVisibility.subscribeModalOpened &&
        !guideVisibility.getCoinsGuideShown && (
          <GetCoinsGuide
            onClose={() => {
              handleGuideClose(GUIDE_ITEMS.mainPage.GET_COINS_GUIDE_SHOWN);
              openModal(MODALS.CREATING_INTEGRATION);
            }}
            isReferral={true}
          />
        )}

      {/* Creating Integration First Guide */}
      {creatingIntegrationModalState.isOpen &&
        !guideVisibility.createIntegrationFirstGuideShown && (
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

      {/* Creating Integration Second Guide */}
      {creatingIntegrationModalState.isOpen &&
        guideVisibility.createIntegrationFirstGuideShown &&
        !guideVisibility.createIntegrationSecondGuideShown && (
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
    </main>
  );
};