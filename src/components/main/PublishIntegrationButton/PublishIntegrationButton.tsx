import React, { useState, useEffect } from 'react';
import integrationIcon from '../../../assets/icons/integration.svg';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants/modals.ts';
import {
  RootState,
  useGetAllIntegrationsQuery,
  useGetIntegrationQuery,
  useGetIntegrationsQuery,
  usePublishIntegrationMutation,
  useUpdateTimeLeftMutation,
} from '../../../redux';
import { useDispatch, useSelector } from 'react-redux';
import s from './PublishIntegrationButton.module.scss';
import {
  setCreateIntegrationButtonGlowing,
  setFirstIntegrationReadyToPublish,
  setIntegrationReadyForPublishing,
  setLastIntegrationId,
} from '../../../redux/slices/guideSlice.ts';
import { getCompanyStars, getIntegrationRewardImageUrl, setGuideShown } from '../../../utils/index.ts';
import { GUIDE_ITEMS } from '../../../constants/guidesConstants.ts';
import { useTranslation } from 'react-i18next';
import { starsThresholds } from '../../../constants/integrationStarsThresholds.ts';

export const PublishIntegrationButton: React.FC = () => {
  const { t } = useTranslation('integrations');
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const isVibrationSupported = 'vibrate' in navigator;
  const isPublishedModalClosed = useSelector((state: RootState) => state.guide.isPublishedModalClosed);

  const [publishIntegration] = usePublishIntegrationMutation();
  const { data: allIntegrations, refetch } = useGetAllIntegrationsQuery();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTimeUpdating, setIsTimeUpdating] = useState(false);
  const [updateTimeLeft] = useUpdateTimeLeftMutation();

  const lastIntId = useSelector((state: RootState) => state.guide.lastIntegrationId);
  const { data: integrationData, refetch: refetchIntegration } = useGetIntegrationQuery(lastIntId, {});
  const { data: companyData } = useGetIntegrationsQuery({ company_name: integrationData?.campaign.company_name }, {});

  const imageUrl = getIntegrationRewardImageUrl(
    integrationData?.campaign.company_name ?? '',
    getCompanyStars(companyData?.count ?? 0),
  );

  const hasCreatingIntegrationWithTime = allIntegrations?.integrations.some(
    int => int.status === 'creating' && int.time_left > 0,
  );

  useEffect(() => {
    if (hasCreatingIntegrationWithTime) {
      setIsTimeUpdating(true);
    } else {
      setIsTimeUpdating(false);
    }
  }, [hasCreatingIntegrationWithTime]);

  const openCongratsModal = () => {
    openModal(MODALS.INTEGRATION_REWARD_CONGRATULATIONS, {
      companyName: integrationData?.campaign.company_name,
      integrationsCount: companyData?.count,
      image_url: imageUrl,
    });
  };

  const canShowIntegrationReward = (function () {
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
  })();

  const handlePublish = async () => {
    if (isVibrationSupported) navigator.vibrate(200);
    if (isPublishing || isTimeUpdating) return;

    setIsPublishing(true);

    try {
      await refetch().unwrap();

      const integrationToPublish = allIntegrations?.integrations.find(int => {
        return int.status === 'created' || (int.status === 'creating' && int.time_left === 0);
      });

      if (!integrationToPublish) {
        console.error('No publishable integrations found');
        setIsPublishing(false);
        return;
      }

      const integrationIdToPublish = integrationToPublish.id;
      dispatch(setLastIntegrationId(integrationIdToPublish));

      if (integrationToPublish.status === 'creating' && integrationToPublish.time_left === 0) {
        setIsTimeUpdating(true);
        try {
          await updateTimeLeft({
            integrationId: integrationIdToPublish,
            timeLeftDelta: 1,
          }).unwrap();

          let isCreated = false;
          let retries = 0;
          const maxRetries = 10;
          while (!isCreated && retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const { data: updatedIntegration } = await refetchIntegration();
            isCreated = updatedIntegration?.status === 'created';
            retries++;
          }
          setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED);
          if (!isCreated) {
            throw new Error('Integration did not switch to "created" status');
          }
        } finally {
          setIsTimeUpdating(false);
        }
      }

      dispatch(setIntegrationReadyForPublishing(false));
      dispatch(setCreateIntegrationButtonGlowing(false));
      dispatch(setFirstIntegrationReadyToPublish(false));
      localStorage.setItem('FIRST_INTEGRATION_READY_TO_PUBLISH', '0');

      const publishRes = await publishIntegration(integrationIdToPublish);
      if (!publishRes.error) {
        const company = integrationData?.campaign;
        if (company) {
          const { base_income, base_views, base_subscribers } = publishRes.data;
          openModal(MODALS.INTEGRATION_REWARD, {
            company,
            base_income,
            base_views,
            base_subscribers,
          });
        }
      }
    } catch (error) {
      console.error('Failed to publish integration:', error);
    } finally {
      if (canShowIntegrationReward && isPublishedModalClosed) {
        openCongratsModal();
      }
      setIsPublishing(false);
    }
  };

  const getButtonText = () => {
    if (isPublishing) return t('i40');
    if (isTimeUpdating) return t('integration.time_updating');
    return t('i25');
  };

  return (
    <section
      className={s.integrationsControls}
      onClick={e => {
        if (!isPublishing && !isTimeUpdating) handlePublish(e);
      }}
    >
      <button
        className={`${s.button}`}
        disabled={isPublishing || isTimeUpdating}
        title={isTimeUpdating ? t('integration.wait_time_completion') : undefined}
      >
        {getButtonText()}
        <span className={s.buttonBadge}>
          {t('i26')}
          <img src={integrationIcon} height={12} width={12} alt="integration" />
        </span>
      </button>
    </section>
  );
};
