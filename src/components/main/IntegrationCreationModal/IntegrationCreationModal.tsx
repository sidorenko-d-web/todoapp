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

import s from './IntegrationCreationModal.module.scss';
import { useDispatch } from 'react-redux';

interface CreatingIntegrationModalProps {
  modalId: string;
  onClose: () => void;
}

export const IntegrationCreationModal: FC<CreatingIntegrationModalProps> = ({
                                                                              modalId,
                                                                              onClose,
                                                                            }: CreatingIntegrationModalProps) => {
  const dispatch = useDispatch();

  const contentOptions = [
    { label: 'Текст', value: 'text' },
    { label: 'Фото', value: 'image' },
    { label: 'Видео', value: 'video' },
  ] as const;

  const [ selectedOption, setSelectedOption ] = useState<typeof contentOptions[number]['value']>('text');
  const [ selectedCompany, setSelectedCompany ] = useState<string | null>(null);

  const [ createIntegration, { isError, error } ] = useCreateIntegrationMutation();
  const { data: profile } = useGetCurrentUserProfileInfoQuery();
  const { data } = useGetCompaniesQuery();
  const companies = data?.campaigns;

  const submitCreation = () => {
    if (!selectedOption || !selectedCompany) return;

    console.log('Submitting with:', selectedOption, selectedCompany);

    createIntegration({
      content_type: selectedOption,
      campaign_id: selectedCompany,
    }).unwrap().then(() => {
      onClose();
      dispatch(integrationsApi.util.invalidateTags([ 'Integrations' ]));
      dispatch(profileApi.util.invalidateTags([ 'Me' ]));
    });
  };

  const submitDisabled = !selectedOption || !selectedCompany;
  console.log(error);

  return (
    <CentralModal modalId={modalId} title={'Создание интеграции'} onClose={onClose} titleIcon={integrationWhiteIcon}>
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
            <span key={index} className={s.tab + ' ' + (selectedOption === option.value ? s.active : '')}
                  onClick={() => setSelectedOption(option.value)}>{option.label}</span>
          ))}
        </div>

        <div className={s.companies}>
          {companies?.map((company) => (
            <CompanyCard key={company.id} company={company} selected={selectedCompany === company.id}
                         onClick={setSelectedCompany} />
          ))}
        </div>

        {isError && <span className={s.errorMessage}>{error?.data?.detail}</span>}

        <button className={s.button} disabled={submitDisabled} onClick={submitCreation}>Создать интеграцию</button>
      </div>
    </CentralModal>
  );
};
