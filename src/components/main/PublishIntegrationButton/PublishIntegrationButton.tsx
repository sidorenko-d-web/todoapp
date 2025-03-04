import React, { useState } from 'react';
import integrationIcon from '../../../assets/icons/integration.svg';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants/modals.ts';
import { RootState, useClaimRewardForIntegrationMutation, useGetAllIntegrationsQuery, usePublishIntegrationMutation } from '../../../redux';
import { useDispatch, useSelector } from 'react-redux';
import s from './PublishIntegrationButton.module.scss';
import {
  setCreateIntegrationButtonGlowing,
  setIntegrationReadyForPublishing,
} from '../../../redux/slices/guideSlice.ts';
import { setGuideShown } from '../../../utils/index.ts';
import { GUIDE_ITEMS } from '../../../constants/guidesConstants.ts';
import { useTranslation } from 'react-i18next';

export const PublishIntegrationButton: React.FC = () => {
  const { t } = useTranslation('integrations');
  const dispatch = useDispatch();
  const { openModal } = useModal();

  const [publishIntegration] = usePublishIntegrationMutation();
  const [claimRewardForIntegration] = useClaimRewardForIntegrationMutation();

  const { data, refetch } = useGetAllIntegrationsQuery();
  const [isPublishing, setIsPublishing] = useState(false);

  const lastIntId = useSelector((state: RootState) => state.guide.lastIntegrationId);

  const handlePublish = async () => {
    if (isPublishing) return;
    setIsPublishing(true);

    setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED);

    try {
      let integrationIdToPublish = lastIntId;

      if (!lastIntId) {
        await refetch().unwrap();
        if (data?.integrations && data.integrations.length > 0) {
          integrationIdToPublish = data.integrations[0].id;
        } else {
          console.error('No integrations found after refetch.');
          return;
        }
      }

      dispatch(setIntegrationReadyForPublishing(false));
      dispatch(setCreateIntegrationButtonGlowing(false));

      const publishRes = await publishIntegration(integrationIdToPublish);
      if (!publishRes.error) {
        const rewardRes = await claimRewardForIntegration(integrationIdToPublish);

        if (!rewardRes.error) {
          const { company_name, image_url } = publishRes.data.campaign;
          const {  base_income, base_views, base_subscribers } = publishRes.data;
  
          console.log('OPENING MODALL')
          openModal(MODALS.INTEGRATION_REWARD, { 
            company_name, 
            image_url, 
            base_income, 
            base_views, 
            base_subscribers 
          });
        } else {
          console.error('Failed to claim reward:', rewardRes.error);
        }
      }
    } catch (error) {
      console.error('Failed to publish integration:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <section className={s.integrationsControls} onClick={handlePublish}>
      <button className={`${s.button}`} disabled={isPublishing}>
        {t('i25')}
        <span className={s.buttonBadge}>
          {t('i26')}
          <img src={integrationIcon} height={12} width={12} alt="integration" />
        </span>
      </button>
    </section>
  );
};
