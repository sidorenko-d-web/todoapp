import integrationIcon from '../../../assets/icons/integration.svg';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants/modals.ts';
import { profileApi, RootState, useGetCurrentUserProfileInfoQuery, useGetIntegrationsQuery } from '../../../redux';
import { IntegrationCreationCard, IntegrationCreationModal } from '../';
import { SubscribeModal, SuccessfullySubscribedModal } from '../../';
import { useDispatch, useSelector } from 'react-redux';

import s from './IntegrationCreation.module.scss';

import { getSubscriptionPurchased, isIntegrationCreationButtonGlowing, setSubscriptionPurchased } from '../../../utils/guide-functions.ts';

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
  
  const createIntegrationButtonGlowing = useSelector((state: RootState) => state.guide.createIntegrationButtonGlowing);
  
  
  return (
    <section className={s.integrationsControls}>
      <button className={`${s.button} ${(isButtonGlowing || createIntegrationButtonGlowing) ? s.glowing : ''}`} disabled={!profile} onClick={handleIntegrationCreation}>
        Создать интеграцию
        <span className={s.buttonBadge}>
          {profile?.subscription_integrations_left || 0}/5 <img src={integrationIcon} height={12} width={12}
            alt="integration" />
        </span>
      </button>
      {
        // @ts-expect-error ts(2339)
        integrationsError?.status === 404 ? null :
          integrations?.integrations && <IntegrationCreationCard integration={integrations?.integrations[0]} />
      }

      <IntegrationCreationModal
        modalId={MODALS.CREATING_INTEGRATION}
        onClose={() => closeModal(MODALS.CREATING_INTEGRATION)}
        // @ts-expect-error ts(2339)
        hasCreatingIntegration={integrationsError?.status !== 404 && integrations?.integrations && integrations?.integrations.length > 0}
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
          if(!getSubscriptionPurchased()) {
            setSubscriptionPurchased();
            openModal(MODALS.CREATING_INTEGRATION);
          }
        }}
      />
    </section>
  );
};