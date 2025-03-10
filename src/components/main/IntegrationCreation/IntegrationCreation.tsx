import integrationIcon from '../../../assets/icons/integration.svg';
import { useModal } from '../../../hooks';
import { GUIDE_ITEMS, MODALS } from '../../../constants';
import { profileApi, RootState, useGetCurrentUserProfileInfoQuery, useGetIntegrationsQuery } from '../../../redux';
import { IntegrationCreationCard, IntegrationCreationModal } from '../';
import { SubscribeModal, SuccessfullySubscribedModal, TrackedButton } from '../../';
import { useDispatch, useSelector } from 'react-redux';

import { isIntegrationCreationButtonGlowing, setGuideShown } from '../../../utils/guide-functions.ts';

import s from './IntegrationCreation.module.scss';
import { useTranslation } from 'react-i18next';

export const IntegrationCreation = () => {
  const { t } = useTranslation('integrations');
  const dispatch = useDispatch();

  const { data: profile } = useGetCurrentUserProfileInfoQuery();
  const { data: integrations, error: integrationsError } = useGetIntegrationsQuery(
    { status: 'creating' },
    {
      pollingInterval: 10 * 60 * 1000,
    },
  );
  const { openModal, closeModal } = useModal();

  const handleIntegrationCreation = () => {
    if (!profile) return;

    if (profile?.subscription_integrations_left <= 0) {
      openModal(MODALS.SUBSCRIBE);
      return;
    }

    openModal(MODALS.CREATING_INTEGRATION);
  };

  const handleSuccessfullySubscribed = () => {
    closeModal(MODALS.SUBSCRIBE);
    dispatch(profileApi.util.invalidateTags(['Me']));
    dispatch(profileApi.util.invalidateTags(['Me']));
    openModal(MODALS.SUCCESSFULLY_SUBSCRIBED);
  };

  const isButtonGlowing = isIntegrationCreationButtonGlowing();

  const createIntegrationButtonGlowing = useSelector(
    (state: RootState) => state.guide.createIntegrationButtonGlowing,
  );

  return (
    <section className={s.integrationsControls}>
      <TrackedButton
        trackingData={{
          eventType: 'button',
          eventPlace: 'Создать интеграцию - Главный экран'
        }}
        className={`${s.button} ${
          isButtonGlowing || createIntegrationButtonGlowing ? s.glowing : ''
        }`}
        disabled={!profile}
        onClick={handleIntegrationCreation}
      >
        {t('i9')}
        <span className={s.buttonBadge}>
          {profile?.subscription_integrations_left || 0}/5{' '}
          <img src={integrationIcon} height={12} width={12} alt="integration" />
        </span>
      </TrackedButton>
      {
        // @ts-expect-error ts(2339)
        integrationsError?.status === 404
          ? null
          : integrations?.integrations && (
              <IntegrationCreationCard integration={integrations?.integrations[0]} />
            )
      }

      <IntegrationCreationModal
        modalId={MODALS.CREATING_INTEGRATION}
        onClose={() => closeModal(MODALS.CREATING_INTEGRATION)}
        hasCreatingIntegration={
          // @ts-expect-error ts(2339)
          integrationsError?.status !== 404 &&
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
