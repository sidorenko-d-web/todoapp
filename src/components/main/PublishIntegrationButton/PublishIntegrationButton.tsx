import React, { useEffect, useState } from 'react';
import integrationIcon from '../../../assets/icons/integration.svg';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants/modals.ts';
import { RootState, useClaimRewardForIntegrationMutation, useGetAllIntegrationsQuery, useGetIntegrationQuery, useGetIntegrationsQuery, usePublishIntegrationMutation } from '../../../redux';
import { useDispatch, useSelector } from 'react-redux';
import s from './PublishIntegrationButton.module.scss';
import {
  setCreateIntegrationButtonGlowing,
  setIntegrationReadyForPublishing,
} from '../../../redux/slices/guideSlice.ts';
import { getCompanyStars, getIntegrationRewardImageUrl, setGuideShown } from '../../../utils/index.ts';
import { GUIDE_ITEMS } from '../../../constants/guidesConstants.ts';
import { useTranslation } from 'react-i18next';
import { starsThresholds } from '../../../constants/integrationStarsThresholds.ts';

export const PublishIntegrationButton: React.FC = () => {
  const { t } = useTranslation('integrations');
  const dispatch = useDispatch();
  const { openModal, getModalState } = useModal();
  const { isOpen: isRewardModalOpen } = getModalState(MODALS.INTEGRATION_REWARD);
  const { isOpen: isCongratsModalOpen } = getModalState(MODALS.INTEGRATION_REWARD_CONGRATULATIONS);

  const [publishIntegration] = usePublishIntegrationMutation();
  const [claimRewardForIntegration] = useClaimRewardForIntegrationMutation();

  const { data, refetch } = useGetAllIntegrationsQuery();
  const [isPublishing, setIsPublishing] = useState(false);
  const [shouldOpenCongratsModal, setShouldOpenCongratsModal] = useState(false);

  const lastIntId = useSelector((state: RootState) => state.guide.lastIntegrationId);

  const { data: integrationData } = useGetIntegrationQuery(lastIntId, {
    pollingInterval: 1000
  });
  const { data: companyData } = useGetIntegrationsQuery({ company_name: integrationData?.campaign.company_name }, {
    pollingInterval: 1000
  })
  
  const canShowIntegrationReward = function() {
    if (companyData?.count === starsThresholds.firstStar) {
      return true;
    }
    if (companyData?.count === starsThresholds.secondStar) {
      return true;
    }
    if (companyData?.count === starsThresholds.thirdStar) {
      return true;
    }
    return false;
  }()

  const handlePublish = async () => {
    if (isPublishing) return;

    setIsPublishing(true);
    setShouldOpenCongratsModal(true);

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
          const { base_income, base_views, base_subscribers } = publishRes.data;
  
          console.log('Opening first modal: INTEGRATION_REWARD');
          openModal(MODALS.INTEGRATION_REWARD, { 
            company_name, 
            image_url, 
            base_income, 
            base_views, 
            base_subscribers 
          });
        } else {
          console.error('Failed to claim reward:', rewardRes.error);
          // If reward claim fails, open congratulations modal directly
          openCongratsModal();
        }
      }
    } catch (error) {
      console.error('Failed to publish integration:', error);
      setShouldOpenCongratsModal(false);
    } finally {
      setIsPublishing(false);
    }
  };

  const openCongratsModal = () => {
    console.log('Opening second modal: INTEGRATION_REWARD_CONGRATULATIONS');
    openModal(MODALS.INTEGRATION_REWARD_CONGRATULATIONS, {
      companyName: integrationData?.campaign.company_name,
      integrationsCount: companyData?.count,
      image_url: getIntegrationRewardImageUrl(
        integrationData?.campaign.company_name ?? "", 
        getCompanyStars(companyData?.count ?? 0)
      )
    });
    setShouldOpenCongratsModal(false);
  };

  // Watch for first modal closing to open the second modal
  useEffect(() => {
    if (!isRewardModalOpen && shouldOpenCongratsModal && !isCongratsModalOpen && canShowIntegrationReward) {
      openCongratsModal();
    }
  }, [isRewardModalOpen, shouldOpenCongratsModal, isCongratsModalOpen]);
    
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