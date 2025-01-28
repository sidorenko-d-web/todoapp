import integrationIcon from '../../../assets/icons/integration.svg';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants/modals.ts';
import { useGetCurrentUserProfileInfoQuery, useGetIntegrationsQuery } from '../../../redux';
import { IntegrationCreationCard, IntegrationCreationModal } from '../';

import s from './IntegrationCreation.module.scss';

export const IntegrationCreation = () => {
  const { data: profile, isLoading: profileLoading } = useGetCurrentUserProfileInfoQuery();
  const { data: integrations, isLoading: integrationsLoading } = useGetIntegrationsQuery({ status: 'creating' }, {
    pollingInterval: 10 * 60 * 1000,
    skipPollingIfUnfocused: true,
  });
  const { openModal, closeModal } = useModal();

  return (
    <section className={s.integrationsControls}>
      <button className={s.button} onClick={() => openModal(MODALS.CREATING_INTEGRATION)}>
        Создать интеграцию
        <span className={s.buttonBadge}>
          {profile?.subscription_integrations_left || '-'}/5 <img src={integrationIcon} height={12} width={12}
                                                                  alt="integration" />
        </span>
      </button>
      <IntegrationCreationModal modalId={MODALS.CREATING_INTEGRATION}
                                onClose={() => closeModal(MODALS.CREATING_INTEGRATION)} />

      {
        integrations?.integrations.map(integration => (
          <IntegrationCreationCard key={integration.id} integration={integration} />
        ))
      }
    </section>
  );
};