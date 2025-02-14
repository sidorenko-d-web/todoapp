import React, { useState } from 'react';
import integrationIcon from '../../../assets/icons/integration.svg';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants/modals.ts';
import { RootState, useGetAllIntegrationsQuery, usePublishIntegrationMutation } from '../../../redux';
import { useDispatch, useSelector } from 'react-redux';
import s from './PublishIntegrationButton.module.scss';
import { setCreateIntegrationButtonGlowing, setIntegrationReadyForPublishing } from '../../../redux/slices/guideSlice.ts';
import { setGuideShown } from '../../../utils/index.ts';
import { GUIDE_ITEMS } from '../../../constants/guidesConstants.ts';
import { useTranslation } from 'react-i18next';

export const PublishIntegrationButton: React.FC = () => {
  const { t } = useTranslation('integrations');
  const dispatch = useDispatch();
  const { openModal } = useModal();

  const [publishIntegration] = usePublishIntegrationMutation();
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

      await publishIntegration(integrationIdToPublish).unwrap();

      openModal(MODALS.INTEGRATION_REWARD);
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