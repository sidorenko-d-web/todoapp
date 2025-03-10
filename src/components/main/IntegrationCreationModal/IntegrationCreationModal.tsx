import { FC, useEffect, useState } from 'react';
import integrationWhiteIcon from '../../../assets/icons/integration-white.svg';
// import lightningIcon from '../../../assets/icons/lightning.svg';
import {
  integrationsApi,
  profileApi,
  useCreateIntegrationMutation,
  useGetCompaniesQuery,
  useGetCurrentUserProfileInfoQuery,
} from '../../../redux';
import { CompanyCard, SpecialIntegration } from '../';
import { useDispatch } from 'react-redux';
import { useInventoryItemsFilter } from '../../../hooks';

import s from './IntegrationCreationModal.module.scss';
import { useNavigate } from 'react-router-dom';
import {
  integrationCreatingModalButtonGlowing,
  //integrationCreatingModalLightningsGlowing,
  integrationCreatingModalTabsGlowing,
  isGuideShown,
  setGuideShown,
} from '../../../utils/guide-functions.ts';
import { GUIDE_ITEMS } from '../../../constants/guidesConstants.ts';
import { setIntegrationCreated, setLastIntegrationId } from '../../../redux/slices/guideSlice.ts';
import { CreatingIntegrationGuide, Loader, TrackedButton } from '../../';
import { useTranslation } from 'react-i18next';
import { CentralModal } from '../../shared/';
import { AppRoute } from '../../../constants/appRoute.ts';


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
  const { t } = useTranslation('integrations');
  const { t: tGuide } = useTranslation('guide');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const contentOptions = [
    { label: t('i13'), value: 'text' },
    { label: t('i14'), value: 'image' },
    { label: t('i15'), value: 'video' },
  ] as const;

  const [selectedOption, setSelectedOption] = useState<(typeof contentOptions)[number]['value']>('text');
  const [selectedCompanyId, setSelectedCompanyId] = useState("")
  const { hasText, hasImage, hasVideo } = useInventoryItemsFilter();
  const [createIntegration, { isError, error }] = useCreateIntegrationMutation();
  const { data: profile, isLoading: isProfileLoading } = useGetCurrentUserProfileInfoQuery();
  const { data, isLoading: isCompaniesLoading } = useGetCompaniesQuery();
  const companies = data?.campaigns;

  const uniqueCompany = companies?.find(company => company.is_unique === true) || null;

  const goToShop = () => {
    setGuideShown(GUIDE_ITEMS.mainPage.MAIN_PAGE_GUIDE_FINISHED);
    onClose();
    navigate('/shop');
  };

  const submitCreation = () => {
    if (!selectedOption || !selectedCompanyId) return;
    createIntegration({
      content_type: selectedOption,
      campaign_id: selectedCompanyId,
    })
      .unwrap()
      .then((data) => {
        dispatch(setIntegrationCreated(true));
        dispatch(setLastIntegrationId(data.id));
        onClose();
        setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_CREATED);
        dispatch(integrationsApi.util.invalidateTags(['Integrations']));
        dispatch(profileApi.util.invalidateTags(['Me']));
      });
    setSelectedCompanyId("");
  };

  const noItemsMessage = (() => {
    const baseText = t('i16');
    if (selectedOption === 'text' && !hasText) return baseText + t('i17');
    if (selectedOption === 'image' && !hasImage) return baseText + t('i18');
    if (selectedOption === 'video' && !hasVideo) return baseText + t('i19');
    return null;
  })();

  //const lightningsGlowing = integrationCreatingModalLightningsGlowing();

  const tabsGlowing = integrationCreatingModalTabsGlowing();

  const buttonGlowing = integrationCreatingModalButtonGlowing();

  const [firstGuideClosed, setFirstGuideClosed] = useState(false);

  useEffect(() => {
    if(isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN)) {
      setFirstGuideClosed(true);
    }
  }, []);


  return (
    // <ExpandableBottomModal
    //   modalId={modalId}
    //   title={t('i11')}
    //   onClose={
    //     () => {
    //       onClose();
    //       if(!isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN)) {
    //        setGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN);
    //        setGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN);
    //        navigate(AppRoute.Shop); 
    //       }
    //     }
    //   }
    //   titleIcon={integrationWhiteIcon}
    //   overlayOpacity={0.7}
    // >
    <CentralModal
      title={t('i11')}
      modalId={modalId}
      onClose={
        () => {
          onClose();
          if (!isGuideShown(GUIDE_ITEMS.shopPage.WELCOME_TO_SHOP_GUIDE_SHOWN)) {
            setGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN);
            setGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN);
            navigate(AppRoute.Shop);
          }
        }}
      headerStyles={s.headerStyles}
      titleIcon={integrationWhiteIcon}
    >

      {isProfileLoading || isCompaniesLoading
        ? <Loader noMargin />
        : <div className={s.content}>
          <div className={s.skinsWrapper}>
            {/* {Array.from({ length: profile ? profile.subscription_integrations_left : 5 }).map((_, index) => (
              <div key={index} className={`${s.skin} ${(lightningsGlowing && !tabsGlowing) ? s.glowing : ''}`}>
                <img src={lightningIcon} alt="Lightning" width={20} height={20} />
              </div>
            ))} */}
          </div>

          <div className={`${s.tabs} ${tabsGlowing ? s.glowing : ''}`}>
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
          {uniqueCompany && !noItemsMessage && (
            <SpecialIntegration
              integration={uniqueCompany}
            />
          )}

          {!noItemsMessage && hasCreatingIntegration && (
            <span className={s.message}>{t('i20')}</span>
          )}

          {!noItemsMessage ? (
            <div className={s.companies}>
              {companies?.map((company) =>
                company.growth_tree_stage !== 100 && (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    selected={selectedCompanyId === company.id}
                    disabled={hasCreatingIntegration}
                    onClick={() => setSelectedCompanyId(company.id)}
                  />
                ),
              )}
            </div>
          ) : (
            <span className={s.message}>{noItemsMessage}</span>
          )}

          {
            // @ts-expect-error No error types yet
            isError && <span className={s.errorMessage}>{error?.data?.detail}</span>
          }

          {noItemsMessage && <TrackedButton
            trackingData={{
              eventType: 'button',
              eventPlace: 'В магазин - Главный экран - Окно создание интеграции',
            }}
            className={`${s.button} 
            ${buttonGlowing ? s.glowingBtn : ''} `}
            onClick={goToShop}
          >
            {t('i21')}
          </TrackedButton>}

          {selectedCompanyId && !noItemsMessage && !hasCreatingIntegration && (
            <div className={s.stickyButtonContainer}>
              <button
                className={s.createButton}
                onClick={submitCreation}
              >
                {t('i31')}
              </button>
            </div>
          )}

        </div>
      }

      {(!firstGuideClosed && !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN)) && <CreatingIntegrationGuide
        onClose={() => {
          setGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN);
          setFirstGuideClosed(true);
        }}
        buttonText={tGuide('g17')}
        description={
          <>
            {tGuide('g18')} <span style={{ color: '#2F80ED' }}>{tGuide('g19')}</span>
            <br />
            <br />
            {tGuide('g20')}
          </>
        }
        align="left"
        top="9%"
      />}
      {(firstGuideClosed && !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN)) && <CreatingIntegrationGuide
        onClose={() => {
          setGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN);
          onClose();
          navigate(AppRoute.Shop);
        }}
        buttonText={tGuide('g21')}
        description={
          <>
            {tGuide('g22')} <span style={{ color: '#2F80ED' }}>{tGuide('g23')} </span>
            <br />
            <br />
            {tGuide('g24')}
          </>
        }
        align="left"
        top="22%"
      />}
    {/* </ExpandableBottomModal> */}
    </CentralModal>
  );
};