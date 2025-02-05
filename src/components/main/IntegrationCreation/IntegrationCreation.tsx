import integrationIcon from '../../../assets/icons/integration.svg';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants/modals.ts';
import { profileApi, useGetCurrentUserProfileInfoQuery, useGetIntegrationsQuery } from '../../../redux';
import { IntegrationCreationCard, IntegrationCreationModal } from '../';
import { SubscribeModal, SuccessfullySubscribedModal } from '../../';
import { useDispatch } from 'react-redux';

import s from './IntegrationCreation.module.scss';

import { isIntegrationCreationButtonGlowing } from '../../../utils/guide-functions.ts';



export const IntegrationCreation: React.FC = () => {
  const dispatch = useDispatch();


  const { data: profile } = useGetCurrentUserProfileInfoQuery();
  const {
    data: integrations,
    error: integrationsError,
  } = useGetIntegrationsQuery({ status: 'creating' }, {
    pollingInterval: 10 * 60 * 1000,
  });
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
    openModal(MODALS.SUCCESSFULLY_SUBSCRIBED);
  };

  const isButtonGlowing = isIntegrationCreationButtonGlowing();
  

  return (
    <section className={s.integrationsControls}>
      <button className={`${s.button} ${isButtonGlowing ? s.glowing : ''}`} disabled={!profile} onClick={handleIntegrationCreation}>
        Создать интеграцию
        <span className={s.buttonBadge}>
          {profile?.subscription_integrations_left || 0}/5 <img src={integrationIcon} height={12} width={12}
            alt="integration" />
        </span>
      </button>
      {
        // @ts-expect-error ts(2769)
        integrationsError?.status === 404 ? null :
          integrations?.integrations && <IntegrationCreationCard integration={integrations?.integrations[0]} />
      }

      <IntegrationCreationModal
        modalId={MODALS.CREATING_INTEGRATION}
        onClose={() => closeModal(MODALS.CREATING_INTEGRATION)}
        hasCreatingIntegration={integrations?.integrations && integrations?.integrations.length > 0}
      />
      <SubscribeModal
        modalId={MODALS.SUBSCRIBE}
        onClose={() => closeModal(MODALS.SUBSCRIBE)}
        onSuccess={handleSuccessfullySubscribed}
      />
      <SuccessfullySubscribedModal
        modalId={MODALS.SUCCESSFULLY_SUBSCRIBED}
        onClose={() => {
          closeModal(MODALS.SUCCESSFULLY_SUBSCRIBED);
          sessionStorage.setItem('subscriptionBought', '1');
          sessionStorage.setItem('createIntegrationLightningsGlowing', '1');
        }}
      />
    </section>
  );
};