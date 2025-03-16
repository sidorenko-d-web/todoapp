import React, { useState } from 'react';
import integrationIcon from '../../../assets/icons/integration.svg';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants/modals.ts';
import {
  RootState,
  useClaimRewardForIntegrationMutation,
  useGetAllIntegrationsQuery,
  useGetIntegrationQuery,
  useGetIntegrationsQuery,
  usePublishIntegrationMutation,
} from '../../../redux';
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
  const { openModal } = useModal();
  const isPublishedModalClosed = useSelector((state: RootState) => state.guide.isPublishedModalClosed);

  const [publishIntegration] = usePublishIntegrationMutation();
  const [claimRewardForIntegration] = useClaimRewardForIntegrationMutation();

  const { data, refetch } = useGetAllIntegrationsQuery();
  const [isPublishing, setIsPublishing] = useState(false);

  const lastIntId = useSelector((state: RootState) => state.guide.lastIntegrationId);

  const { data: integrationData } = useGetIntegrationQuery(lastIntId, {});
  const { data: companyData } = useGetIntegrationsQuery({ company_name: integrationData?.campaign.company_name }, {});

  const imageUrl = getIntegrationRewardImageUrl(
    integrationData?.campaign.company_name ?? '',
    getCompanyStars(companyData?.count ?? 0),
  );

  const openCongratsModal = () => {
    console.log('Opening second modal: INTEGRATION_REWARD_CONGRATULATIONS');
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
          const company = publishRes.data.campaign;
          const { base_income, base_views, base_subscribers } = publishRes.data;

          console.log('Opening first modal: INTEGRATION_REWARD');
          openModal(MODALS.INTEGRATION_REWARD, {
            company,
            base_income,
            base_views,
            base_subscribers,
          });
        } else {
          console.error('Failed to claim reward:', rewardRes.error);
          // If reward claim fails, open congratulations modal directly
          if (canShowIntegrationReward && isPublishedModalClosed) {
            openCongratsModal();
          }
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

  return (
    <section className={s.integrationsControls} onClick={handlePublish}>
      <button className={`${s.button}`} disabled={isPublishing}>
        {isPublishing ? t('i40') : t('i25')}
        <span className={s.buttonBadge}>
          {t('i26')}
          <img src={integrationIcon} height={12} width={12} alt="integration" />
        </span>
      </button>
    </section>
  );
};
