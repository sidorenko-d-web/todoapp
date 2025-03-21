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

export const IntegrationCreation = () => {
  const { t } = useTranslation('integrations');
  const dispatch = useDispatch();
  const integrationCreating = useSelector((state: RootState) => state.acceleration.integrationCreating);
  const { data: profile } = useGetProfileMeQuery();
  const { data: integrations, isLoading } = useGetIntegrationsQuery(
    { status: 'creating' },
    {
      pollingInterval: 10 * 60 * 1000,
    },
  );

  const { data: integration, refetch: refetchIntegration } = useGetIntegrationQuery(
    integrations?.integrations[0]?.id || '',
    {
      skip: !integrations?.integrations[0]?.id,
    },
  );

  const { openModal, closeModal } = useModal();

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
        openModal(MODALS.CREATING_INTEGRATION);
      }
    }
  };

  const handleSuccessfullySubscribed = () => {
    closeModal(MODALS.SUBSCRIBE);
    dispatch(profileApi.util.invalidateTags(['Me']));
    openModal(MODALS.SUCCESSFULLY_SUBSCRIBED);
  };

  const isButtonGlowing = isIntegrationCreationButtonGlowing();
  const createIntegrationButtonGlowing = useSelector((state: RootState) => state.guide.createIntegrationButtonGlowing);
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
      {!integrationCreating && (
        <TrackedButton
          trackingData={{
            eventType: 'button',
            eventPlace: 'Создать интеграцию - Главный экран',
          }}
          className={`${s.button} ${isButtonGlowing || createIntegrationButtonGlowing || btnGlowing ? s.glowing : ''}`}
          style={{ zIndex: '10000' }}
          disabled={!profile}
          onClick={handleIntegrationCreation}
        >
          {t('i9')}
          <span className={s.buttonBadge}>
            {profile?.subscription_integrations_left || 0}/5{' '}
            <img src={integrationIcon} height={12} width={12} alt="integration" />
          </span>
        </TrackedButton>
      )}

      {!isLoading && integration && (
        <>
          <IntegrationCreationCard integration={integration} refetchIntegration={refetchIntegration} />
        </>
      )}

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
      <SubscribeModal
        modalId={MODALS.SUBSCRIBE}
        onClose={() => {
          setGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN);
          closeModal(MODALS.SUBSCRIBE);
        }}
        onSuccess={handleSuccessfullySubscribed}
      />
      <SuccessfullySubscribedModal
        modalId={MODALS.SUCCESSFULLY_SUBSCRIBED}
        onClose={() => {
          closeModal(MODALS.SUCCESSFULLY_SUBSCRIBED);
          openModal(MODALS.CREATING_INTEGRATION);
        }}
      />
    </section>
  );
};
