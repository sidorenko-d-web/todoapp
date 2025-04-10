import React, { useEffect, useState, useCallback } from 'react';
import integrationIcon from '../../../assets/icons/integration.svg';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants/modals.ts';
import {
  RootState,
  useGetIntegrationQuery,
  useGetIntegrationsQuery,
  useGetPushLineQuery,
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
  setRefetchAfterPublish,
} from '../../../redux/slices/guideSlice.ts';
import { getCompanyStars, getIntegrationRewardImageUrl, setGuideShown } from '../../../utils/index.ts';
import { GUIDE_ITEMS } from '../../../constants/guidesConstants.ts';
import { useTranslation } from 'react-i18next';
import { starsThresholds } from '../../../constants/integrationStarsThresholds.ts';
import { setIntegrationCreating } from '../../../redux/slices/integrationAcceleration.ts';

export const PublishIntegrationButton: React.FC = () => {
  const { t } = useTranslation('integrations');
  const dispatch = useDispatch();
  const { openModal } = useModal();

  const isVibrationSupported =
    typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function';
  const integrationCreating = useSelector((state: RootState) => state.acceleration.integrationCreating);

  const [publishIntegration] = usePublishIntegrationMutation();
  const { data: allIntegrations, refetch } = useGetIntegrationsQuery();
  const { refetch: LineRefetch } = useGetPushLineQuery();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTimeUpdating, setIsTimeUpdating] = useState(false);
  const [updateTimeLeft] = useUpdateTimeLeftMutation();
  const [shouldRender, setShouldRender] = useState(true);

  const lastIntId = useSelector((state: RootState) => state.guide.lastIntegrationId);
  const { data: integrationData, refetch: refetchIntegration } = useGetIntegrationQuery(lastIntId, {
    skip: !lastIntId,
  });
  const { data: companyData } = useGetIntegrationsQuery(
    { company_name: integrationData?.campaign.company_name },
    { skip: !integrationData?.campaign.company_name },
  );

  const isFirstIntegrationReady = useSelector((state: RootState) => state.guide.firstIntegrationReadyToPublish);

  const imageUrl = getIntegrationRewardImageUrl(
    integrationData?.campaign.company_name ?? '',
    getCompanyStars(companyData?.count ?? 0),
  );

  const hasPublishableIntegration = useCallback(() => {
    return allIntegrations?.integrations.some(
      int => int.status === 'created' || (int.status === 'creating' && int.time_left === 0),
    );
  }, [allIntegrations?.integrations]);

  useEffect(() => {
    setShouldRender((hasPublishableIntegration() ?? false) && !integrationCreating);
  }, [allIntegrations, integrationCreating, hasPublishableIntegration]);

  useEffect(() => {
    const hasCreatingIntegrationWithTime = allIntegrations?.integrations.some(
      int => int.status === 'creating' && int.time_left > 0,
    );

    setIsTimeUpdating(hasCreatingIntegrationWithTime || false);
  }, [allIntegrations?.integrations]);

  const openCongratsModal = useCallback(() => {
    openModal(MODALS.INTEGRATION_REWARD_CONGRATULATIONS, {
      companyName: integrationData?.campaign.company_name,
      integrationsCount: companyData?.count,
      image_url: imageUrl,
    });
  }, [openModal, integrationData?.campaign.company_name, companyData?.count, imageUrl]);

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

    setShouldRender(false);

    try {
      if (isFirstIntegrationReady) {
        // публикация первой интеграции немного по-другому идёт,
        //  почему то приходится несколько раз кликнуть, просьба не убирать этот кейс
        const firstIntegrationID = localStorage.getItem('firstIntegrationId');

        const publishRes = await publishIntegration(firstIntegrationID!);
        if (!publishRes.error) {
          dispatch(setIntegrationReadyForPublishing(false));
          dispatch(setCreateIntegrationButtonGlowing(false));

          dispatch(setFirstIntegrationReadyToPublish(false));
          localStorage.setItem('FIRST_INTEGRATION_READY_TO_PUBLISH', '0');

          dispatch(setRefetchAfterPublish());

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
      } else {
        await LineRefetch().unwrap();
        await refetch().unwrap();

        const integrationToPublish = allIntegrations?.integrations.find(
          int => int.status === 'created' || (int.status === 'creating' && int.time_left === 0),
        );

        if (!integrationToPublish) {
          console.error('No publishable integrations found');
          setShouldRender(true);
          setIsPublishing(false);
          return;
        }

        setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED);
        const integrationIdToPublish = integrationToPublish.id;
        dispatch(setLastIntegrationId(integrationIdToPublish));
        dispatch(setIntegrationCreating(false));

        if (integrationToPublish.status === 'creating' && integrationToPublish.time_left === 0) {
          setIsTimeUpdating(true);
          try {
            await updateTimeLeft(integrationIdToPublish).unwrap();

            // Ждём, пока статус не обновится
            let retries = 0;
            while (retries < 10) {
              await new Promise(resolve => setTimeout(resolve, 1500));
              const { data: updatedIntegration } = await refetchIntegration();
              if (updatedIntegration?.status === 'created') break;
              retries++;
            }
          } finally {
            setIsTimeUpdating(false);
          }
        }

        // Публикуем интеграцию
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

        console.warn('Integrations ', companyData?.count);
        console.warn('Can show congrats:', canShowIntegrationReward);
        setGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN);
        if (canShowIntegrationReward) {
          openCongratsModal();
        }
      }
    } catch (error) {
      console.error('Failed to publish integration:', error);
      setShouldRender(true); // Restore button on error
    } finally {
      if (canShowIntegrationReward) {
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

  if (!shouldRender) {
    return null;
  }

  return (
    <section className={s.integrationsControls}>
      <button
        className={`${s.button}`}
        disabled={isPublishing || isTimeUpdating}
        title={isTimeUpdating ? t('integration.wait_time_completion') : undefined}
        onClick={handlePublish}
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
