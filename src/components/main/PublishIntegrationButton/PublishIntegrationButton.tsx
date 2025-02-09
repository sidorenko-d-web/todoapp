import integrationIcon from '../../../assets/icons/integration.svg';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants/modals.ts';
import { useGetAllIntegrationsQuery, usePublishIntegrationMutation } from '../../../redux';

import { useDispatch } from 'react-redux';

import s from './PublishIntegrationButton.module.scss';

import { setCreatedIntegrationId, setIntegrationReadyForPublishing } from '../../../redux/slices/guideSlice.ts';



export const PublishIntegrationButton: React.FC = ( ) => {
  const dispatch = useDispatch();

  const {openModal} = useModal();

   const [publishIntegration] = usePublishIntegrationMutation();
   const { data, refetch } = useGetAllIntegrationsQuery();
  
   const handlePublish = async () => {
    try {
        refetch();
        const createdIntegration = data?.integrations.find(integration => integration.status === 'created');
        dispatch(setIntegrationReadyForPublishing(false));
        if(createdIntegration) {
            console.log('found created integration');
            await publishIntegration(createdIntegration.id).unwrap();
            dispatch(setCreatedIntegrationId(createdIntegration.id));
        } else {
            console.log('not found created integration');
        }
        openModal(MODALS.INTEGRATION_REWARD);
    } catch (error) {
      console.error('Failed to publish integration:', error);
    }
  };
  return (
    <section className={s.integrationsControls} onClick={handlePublish}>
      <button className={`${s.button} `} disabled={false}>
        Опубликовать
        <span className={s.buttonBadge}>
            Интеграция готова
            <img src={integrationIcon} height={12} width={12}
            alt="integration" />
        </span>
      </button>
    </section>
  );
};