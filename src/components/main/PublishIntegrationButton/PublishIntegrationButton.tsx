import integrationIcon from '../../../assets/icons/integration.svg';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants/modals.ts';
import { useGetAllIntegrationsQuery, usePublishIntegrationMutation } from '../../../redux';

import { useDispatch } from 'react-redux';

import s from './PublishIntegrationButton.module.scss';

import { setCreatedIntegrationId, setCreateIntegrationButtonGlowing, setIntegrationReadyForPublishing } from '../../../redux/slices/guideSlice.ts';
import { setGuideShown } from '../../../utils/index.ts';
import { GUIDE_ITEMS } from '../../../constants/guidesConstants.ts';


export const PublishIntegrationButton: React.FC = ( ) => {
  const dispatch = useDispatch();

  const {openModal} = useModal();

   const [publishIntegration] = usePublishIntegrationMutation();
   const { data, refetch } = useGetAllIntegrationsQuery();
  
   const handlePublish = async () => {
    console.log('handle publish');
    setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED);
    try {
        refetch();
        const createdIntegration = data?.integrations.find(integration => integration.status === 'created');
        dispatch(setIntegrationReadyForPublishing(false));
        dispatch(setCreateIntegrationButtonGlowing(false));
        if(createdIntegration) {
            await publishIntegration(createdIntegration.id).unwrap();
            dispatch(setCreatedIntegrationId(createdIntegration.id));
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