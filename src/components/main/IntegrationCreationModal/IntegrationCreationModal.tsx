import { FC, useEffect, useMemo, useState } from 'react';
import integrationWhiteIcon from '../../../assets/icons/integration-white.svg';
// import lightningIcon from '../../../assets/icons/lightning.svg';
import {
  integrationsApi,
  profileApi,
  setIntegrationCreated,
  setLastIntegrationId,
  useCreateIntegrationMutation,
  useGetCompaniesQuery,
  useGetProfileMeQuery,
} from '../../../redux';
import { CompanyCard, SpecialIntegration } from '../';
import { useDispatch } from 'react-redux';
import { useInventoryItemsFilter } from '../../../hooks';

import s from './IntegrationCreationModal.module.scss';
import { useNavigate } from 'react-router-dom';
import {
  integrationCreatingModalButtonGlowing,
  integrationCreatingModalTabsGlowing,
  isGuideShown,
  setGuideShown,
} from '../../../utils';
import { AppRoute, GUIDE_ITEMS, total_users } from '../../../constants';
import { CreatingIntegrationGuide, Loader, TrackedButton } from '../../';
import { useTranslation } from 'react-i18next';
import { CentralModal } from '../../shared/';
import { getPlanStageByUsersCount } from '../../../helpers';


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
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const { hasText, hasImage, hasVideo } = useInventoryItemsFilter();
  const [createIntegration, { isError, error, isLoading }] = useCreateIntegrationMutation();
  const {
    // data: profile,
    isLoading: isProfileLoading } = useGetProfileMeQuery();

  const { data, isLoading: isCompaniesLoading } = useGetCompaniesQuery({
    content_type: selectedOption
  });
  const companies = data?.campaigns;

  // const integrationPublished = isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED);



  const loadingTexts = [
    t("i35"),
    t("i36"),
    t("i37"),
    t("i38"),
    t("i39"),
  ];
  const [currentLoadingText, setCurrentLoadingText] = useState(loadingTexts[0]);
  // Flag to prevent multiple submissions
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSubmitting) return;

    const interval = setInterval(() => {
      setCurrentLoadingText(prevText => {
        const currentIndex = loadingTexts.indexOf(prevText);
        const nextIndex = (currentIndex + 1) % loadingTexts.length;
        return loadingTexts[nextIndex];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSubmitting]);


  // const uniqueCompany = companies?.find(company => company.is_unique === true) || null;
  const uniqueCompany = useMemo(() =>
    companies?.find(company => company.is_unique === true) || null,
    [companies]
  );

  const goToShop = () => {
    setGuideShown(GUIDE_ITEMS.mainPage.MAIN_PAGE_GUIDE_FINISHED);
    onClose();
    navigate('/shop');
  };

  const submitCreation = () => {
    // If already submitting or no company selected, do nothing
    if (isSubmitting || !selectedOption || !selectedCompanyId) return;

    // Set submitting state to prevent multiple clicks
    setIsSubmitting(true);

    const randomIndex = Math.floor(Math.random() * loadingTexts.length);
    setCurrentLoadingText(loadingTexts[randomIndex]);

    createIntegration(selectedCompanyId)
      .unwrap()
      .then((data) => {
        dispatch(setIntegrationCreated(true));
        dispatch(setLastIntegrationId(data.id));
        onClose();
        setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_CREATED);
        dispatch(integrationsApi.util.invalidateTags(['Integrations']));
        dispatch(profileApi.util.invalidateTags(['Me']));
      })
      .finally(() => {
        // Reset submitting state if needed
        setIsSubmitting(false);
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

  // const lightningsGlowing = integrationCreatingModalLightningsGlowing();

  const tabsGlowing = integrationCreatingModalTabsGlowing();

  const buttonGlowing = integrationCreatingModalButtonGlowing();

  //const [firstGuideClosed, setFirstGuideClosed] = useState(false);

  // useEffect(() => {
  //   if (isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN)) {
  //     setFirstGuideClosed(true);
  //   }
  // }, []);

  const integrationPublished = isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED);


  return (
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

          <div className={s.scrollableContent}>
            {uniqueCompany && !noItemsMessage && getPlanStageByUsersCount(total_users) >= 5 && (
              <SpecialIntegration
                company={uniqueCompany}
              />
            )}

            {!noItemsMessage && hasCreatingIntegration && (
              <span className={s.message}>{t('i20')}</span>
            )}

            {!noItemsMessage ? (
              <div className={s.companies}>
                {companies
                  ?.filter((_, index) => integrationPublished || index === 1)
                  .map((company) =>
                    company.growth_tree_stage !== 100 && (
                      <CompanyCard
                        key={company.id}
                        company={company}
                        selected={selectedCompanyId === company.id}
                        disabled={hasCreatingIntegration || isSubmitting}
                        onClick={() => {
                          if (selectedCompanyId === company.id) {
                            setSelectedCompanyId(""); // Deselect if clicking the same card
                          } else {
                            setSelectedCompanyId(company.id); // Select new card
                          }
                        }}
                      />
                    )
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

            {!noItemsMessage && !hasCreatingIntegration && (
              <div className={s.stickyButtonContainer}>
                <button
                  className={`${s.createButton} ${!selectedCompanyId ? s.disabledButton : ''}`}
                  onClick={submitCreation}
                  disabled={!selectedCompanyId || isSubmitting}
                  style={{
                    color: isLoading ? 'white' : ''
                  }}
                >
                  {isSubmitting ? currentLoadingText : t('i31')}
                </button>
              </div>
            )}

          </div>
        </div>
      }

      {/* {(!firstGuideClosed && !isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN)) && <CreatingIntegrationGuide
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
      />} */}
      {(!isGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_SECOND_GUIDE_SHOWN)) && <CreatingIntegrationGuide
        onClose={() => {
          setGuideShown(GUIDE_ITEMS.mainPage.CREATE_INTEGRATION_FIRST_GUIDE_SHOWN);
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
        top="65%"
      />}

    </CentralModal>
  );
};