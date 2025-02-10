import React, { useEffect, useState } from 'react';
import integrationIcon from '../../../assets/icons/integration.svg';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants/modals.ts';
import { useGetAllIntegrationsQuery, usePublishIntegrationMutation } from '../../../redux';
import { useDispatch } from 'react-redux';
import s from './PublishIntegrationButton.module.scss';
import { setCreatedIntegrationId, setCreateIntegrationButtonGlowing, setIntegrationReadyForPublishing } from '../../../redux/slices/guideSlice.ts';
import { setGuideShown } from '../../../utils/index.ts';
import { GUIDE_ITEMS } from '../../../constants/guidesConstants.ts';

export const PublishIntegrationButton: React.FC = () => {
  const dispatch = useDispatch();
  const { openModal } = useModal();

  const [publishIntegration] = usePublishIntegrationMutation();
  const { data, refetch } = useGetAllIntegrationsQuery();
  const [isRefetching, setIsRefetching] = useState(false);

  const handlePublish = async () => {
    setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED);
    setIsRefetching(true); 
    refetch(); 
  };

  useEffect(() => {
    if (isRefetching && data?.integrations) {

      if (data.integrations.length > 0) {
        console.log('data int count: ', data.count, ' ,length: ' + data.integrations.length);
        const createdIntegration = data.integrations[0];

        dispatch(setIntegrationReadyForPublishing(false));
        dispatch(setCreateIntegrationButtonGlowing(false));

        if (createdIntegration) {
          publishIntegration(createdIntegration.id)
            .unwrap()
            .then(() => {
              dispatch(setCreatedIntegrationId(createdIntegration.id));
              openModal(MODALS.INTEGRATION_REWARD);
            })
            .catch((error) => {
              console.error('Failed to publish integration:', error);
            });
        }
      } else {
        console.error('No integrations found after refetch.');
      }

      setIsRefetching(false);
    }
  }, [data, isRefetching, dispatch, publishIntegration, openModal]);

  return (
    <section className={s.integrationsControls} onClick={handlePublish}>
      <button className={`${s.button}`} disabled={false}>
        Опубликовать
        <span className={s.buttonBadge}>
          Интеграция готова
          <img src={integrationIcon} height={12} width={12} alt="integration" />
        </span>
      </button>
    </section>
  );
};