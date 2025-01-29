import { FC, useState } from 'react';
import CentralModal from '../../shared/CentralModal/CentralModal.tsx';
import integrationWhiteIcon from '../../../assets/icons/integration-white.svg';
import lightningIcon from '../../../assets/icons/lightning.svg';
import {
  integrationsApi,
  profileApi,
  useCreateIntegrationMutation,
  useGetCompaniesQuery,
  useGetCurrentUserProfileInfoQuery,
} from '../../../redux';
import { CompanyCard } from '../';
import { useDispatch } from 'react-redux';
import { useInventoryItemsFilter } from '../../../hooks';

import s from './IntegrationCreationModal.module.scss';
import { useNavigate } from 'react-router-dom';

interface CreatingIntegrationModalProps {
  modalId: string;
  onClose: () => void;
  hasCreatingIntegration?: boolean;
}

export const IntegrationCreationModal: FC<CreatingIntegrationModalProps> = ({
                                                                              modalId,
                                                                              onClose,
                                                                              hasCreatingIntegration,
                                                                            }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const contentOptions = [
    { label: 'Текст', value: 'text' },
    { label: 'Фото', value: 'image' },
    { label: 'Видео', value: 'video' },
  ] as const;

  const [ selectedOption, setSelectedOption ] = useState<typeof contentOptions[number]['value']>('text');
  const [ selectedCompany, setSelectedCompany ] = useState<string | null>(null);

  const { hasText, hasImage, hasVideo } = useInventoryItemsFilter();
  const [ createIntegration, { isError, error } ] = useCreateIntegrationMutation();
  const { data: profile } = useGetCurrentUserProfileInfoQuery();
  const { data } = useGetCompaniesQuery();
  const companies = data?.campaigns;

  const goToShop = () => {
    onClose()
    navigate('/shop')
  }

  const submitCreation = () => {
    if (!selectedOption || !selectedCompany) return;

    createIntegration({
      content_type: selectedOption,
      campaign_id: selectedCompany,
    })
      .unwrap()
      .then(() => {
        onClose();
        dispatch(integrationsApi.util.invalidateTags([ 'Integrations' ]));
        dispatch(profileApi.util.invalidateTags([ 'Me' ]));
      });
  };

  const submitDisabled = !selectedOption || !selectedCompany || hasCreatingIntegration;

  const noItemsMessage = (() => {
    const baseText = 'Купите предмет нужного типа, чтобы начать делать ';
    if (selectedOption === 'text' && !hasText) return baseText + 'текстовые интеграции.';
    if (selectedOption === 'image' && !hasImage) return baseText + 'фото-интеграции.';
    if (selectedOption === 'video' && !hasVideo) return baseText + 'видео-интеграции.';
    return null;
  })();

  return (
    <CentralModal modalId={modalId} title="Создание интеграции" onClose={onClose} titleIcon={integrationWhiteIcon}>
      <div className={s.content}>
        <div className={s.skinsWrapper}>
          {Array.from({ length: profile ? profile.subscription_integrations_left : 5 }).map((_, index) => (
            <div key={index} className={s.skin}>
              <img src={lightningIcon} alt="Lightning" width={20} height={20} />
            </div>
          ))}
        </div>

        <div className={s.tabs}>
          {contentOptions.map((option, index) => (
            <span
              key={index}
              className={`${s.tab} ${selectedOption === option.value ? s.active : ''}`}
              onClick={() => setSelectedOption(option.value)}
            >
              {option.label}
            </span>
          ))}
        </div>

        {
          !noItemsMessage ? <div className={s.companies}>
            {companies?.map((company) => (
              <CompanyCard key={company.id} company={company} selected={selectedCompany === company.id}
                           onClick={setSelectedCompany} />
            ))}
          </div> : <span className={s.message}>{noItemsMessage}</span>
        }

        {!noItemsMessage && hasCreatingIntegration &&
          <span className={s.message}>Нельзя создавать новую интеграцию, пока создание предыдущей не закончится.</span>}

        {
          // @ts-expect-error No error types yet
          isError && <span className={s.errorMessage}>{error?.data?.detail}</span>
        }

        <button className={s.button} disabled={submitDisabled && !noItemsMessage} onClick={noItemsMessage ? goToShop : submitCreation}>
          {noItemsMessage  ? 'В магазин' : 'Создать интеграцию'}
        </button>
      </div>
    </CentralModal>
  );
};
