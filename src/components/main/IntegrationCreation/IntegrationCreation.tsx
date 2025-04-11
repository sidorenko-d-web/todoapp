import integrationIcon from '../../../assets/icons/integration.svg';
import { useModal } from '../../../hooks';
import { GUIDE_ITEMS, MODALS } from '../../../constants';
import {
  profileApi,
  RootState,
  useGetIntegrationQuery,
  useGetIntegrationsQuery,
  useGetProfileMeQuery,
} from '../../../redux';
import { IntegrationCreationCard, IntegrationCreationModal } from '../';
import { SubscribeModal, SuccessfullySubscribedModal, TrackedButton } from '../../';
import { useDispatch, useSelector } from 'react-redux';
import { isGuideShown, isIntegrationCreationButtonGlowing, setGuideShown } from '../../../utils/guide-functions.ts';
import s from './IntegrationCreation.module.scss';
import { useTranslation } from 'react-i18next';
import { UserGuideCreationCard } from '../GuideIntegrationCreationCard/GuideIntegrationCreationCard.tsx';
import { useCallback } from 'react';
import { getMaxSubscriptions } from '../../../helpers/getMaxSubscriptions.ts';
import { WithModal } from '../../shared/WithModal/WithModa.tsx';

export const IntegrationCreation = () => {
  const { t } = useTranslation('integrations');
  const dispatch = useDispatch();
  const integrationCreating = useSelector((state: RootState) => state.acceleration.integrationCreating);

  //const integrationCurrentlyCreating = useSelector((state: RootState) => state.acceleration.integrationCreating);

  const { data: profile } = useGetProfileMeQuery();
  const { data: integrations, isLoading } = useGetIntegrationsQuery(
    { status: 'creating' },
    { pollingInterval: 10 * 60 * 1000 },
  );

  const { data: integration, refetch: refetchIntegration } = useGetIntegrationQuery(
    integrations?.integrations[0]?.id || '',
    {
      skip: !integrations?.integrations[0]?.id,
      refetchOnMountOrArgChange: true,
    },
  );

  const safeRefetchIntegration = useCallback(() => {
    if (integrations?.integrations[0]?.id) {
      refetchIntegration();
    }
  }, [integrations?.integrations, refetchIntegration]);

  const { openModal, closeModal, getModalState } = useModal();

  const handleIntegrationCreation = () => {
    if (isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN)) {
      if (!profile) return;
      if (profile?.subscription_integrations_left <= 0) {
        openModal(MODALS.SUBSCRIBE);
        return;
      }
      if (!isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN)) {
        openModal(MODALS.SUBSCRIBE);
      } else {
        if (!getModalState(MODALS.CREATING_INTEGRATION).isOpen && !integrationCreating) {
          openModal(MODALS.CREATING_INTEGRATION);
        }
      }
    }
  };

  const handleSuccessfullySubscribed = () => {
    closeModal(MODALS.SUBSCRIBE);
    dispatch(profileApi.util.invalidateTags(['Me']));
    openModal(MODALS.SUCCESSFULLY_SUBSCRIBED);
  };

  const maxSubscriptions = getMaxSubscriptions();

  const isButtonGlowing = isIntegrationCreationButtonGlowing();
  const createIntegrationButtonGlowing = useSelector((state: RootState) => state.guide.createIntegrationButtonGlowing);

  const firstIntegrationCreating = useSelector((state: RootState) => state.guide.firstIntegrationCreating);

  const btnGlowing =
    isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN) &&
    !isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN);

  return (
    <section
      className={`${s.integrationsControls} 
      ${
        isGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN) && !isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN)
          ? s.elevated
          : ''
      }`}
    >
      {!integrationCreating && !firstIntegrationCreating && (
        <TrackedButton
          trackingData={{
            eventType: 'button',
            eventPlace: 'Создать интеграцию - Главный экран',
          }}
          className={`${s.button} ${
            (isButtonGlowing || createIntegrationButtonGlowing || btnGlowing) &&
            !isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN)
              ? s.glowing
              : ''
          }`}
          style={{ zIndex: '10000' }}
          disabled={!profile}
          onClick={handleIntegrationCreation}
        >
          {t('i9')}
          <span className={s.buttonBadge}>
            {profile?.subscription_integrations_left || 0}/{maxSubscriptions}{' '}
            <img src={integrationIcon} height={12} width={12} alt="integration" />
          </span>
        </TrackedButton>
      )}
      {firstIntegrationCreating && <UserGuideCreationCard />}
      {!isLoading && integration && integrations?.integrations?.[0]?.id && !firstIntegrationCreating && (
        <>
          <IntegrationCreationCard integration={integration!} refetchIntegration={safeRefetchIntegration} />
        </>
      )}
      <WithModal
        modalId={MODALS.CREATING_INTEGRATION}
        component={
          <IntegrationCreationModal
            modalId={MODALS.CREATING_INTEGRATION}
            onClose={() => closeModal(MODALS.CREATING_INTEGRATION)}
            hasCreatingIntegration={
              integrations &&
              integrations.count !== 0 &&
              integrations?.integrations &&
              integrations?.integrations.length > 0
            }
          />
        }
      />
      <WithModal
        modalId={MODALS.SUBSCRIBE}
        component={
          <SubscribeModal
            modalId={MODALS.SUBSCRIBE}
            onClose={() => {
              setGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN);
              closeModal(MODALS.SUBSCRIBE);
            }}
            onSuccess={handleSuccessfullySubscribed}
          />
        }
      />
      <WithModal
        modalId={MODALS.SUCCESSFULLY_SUBSCRIBED}
        component={
          <SuccessfullySubscribedModal
            modalId={MODALS.SUCCESSFULLY_SUBSCRIBED}
            onClose={() => {
              closeModal(MODALS.SUCCESSFULLY_SUBSCRIBED);
              openModal(MODALS.CREATING_INTEGRATION);
            }}
          />
        }
      />
    </section>
  );
};
