import { GUIDE_ITEMS, MODALS, PROFILE_ME_POLLING_INTERVAL, SOUNDS, starsThresholds } from '../../../constants';
import { useAutoPlaySound, useModal } from '../../../hooks';
import styles from './RewardForIntegrationModal.module.scss';
import Button from '../partials/Button';
import coin from '../../../assets/icons/coin.png';
import views from '../../../assets/icons/views.png';
import subscribers from '../../../assets/icons/subscribers.png';
import starBlue from '../../../assets/icons/star-blue.svg';
import starGray from '../../../assets/icons/star-dark-gray.svg';
// import lightning from '../../../assets/icons/lightning.svg';
import Lottie from 'lottie-react';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import confetti from '../../../assets/animations/confetti.json';
import { useDispatch } from 'react-redux';
import { CentralModal } from '../../../components/shared';
import { useTranslation } from 'react-i18next';
import { formatAbbreviation } from '../../../helpers';
import {
  CompanyResponseDTO,
  setIsPublishedModalClosed,
  setNeedToPlayHappy,
  useGetIntegrationsQuery,
  useGetProfileMeWithPollingQuery,
} from '../../../redux';
import { setGuideShown } from '../../../utils';

export default function RewardForIntegrationModal() {
  const { t, i18n } = useTranslation('integrations');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { openModal, closeModal, getModalState } = useModal();
  const { refetch } = useGetProfileMeWithPollingQuery(undefined, {
    pollingInterval: PROFILE_ME_POLLING_INTERVAL,
  });

  const { args } = getModalState<{
    company: CompanyResponseDTO;
    base_income: string;
    base_subscribers: string;
    base_views: string;
  }>(MODALS.INTEGRATION_REWARD);
  const { data: integrationsData } = useGetIntegrationsQuery({ company_name: args?.company?.company_name });
  const integrationCount = integrationsData?.count ?? 0;
  const dispatch = useDispatch();

  useAutoPlaySound(MODALS.INTEGRATION_REWARD, SOUNDS.rewardHuge);

  const getBlueStarCount = (count: number = 0) => {
    if (count >= 18) return 3;
    if (count >= 10) return 2;
    if (count >= 4) return 1;
    return 0;
  };

  const isVibrationSupported =
    typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function';

  const getProgressBarPercentage = (count: number = 0) => {
    if (count >= starsThresholds.thirdStar) {
      return 100;
    } else if (count >= starsThresholds.secondStar) {
      const progressInSegment = count - starsThresholds.secondStar;
      const segmentSize = starsThresholds.thirdStar - starsThresholds.secondStar;
      return (progressInSegment / segmentSize) * 100;
    } else if (count >= starsThresholds.firstStar) {
      const progressInSegment = count - starsThresholds.firstStar;
      const segmentSize = starsThresholds.secondStar - starsThresholds.firstStar;
      return (progressInSegment / segmentSize) * 100;
    } else {
      return (count / starsThresholds.firstStar) * 100;
    }
  };

  const blueStarCount = getBlueStarCount(integrationCount);
  const progressPercentage = getProgressBarPercentage(integrationCount);

  function openModalIfNotOpenedToday() {
    const today = new Date().toISOString().split('T')[0];

    const lastOpenedDate = localStorage.getItem('lastModalOpenedDate');

    if (lastOpenedDate !== today) {
      openModal(MODALS.DAYS_IN_A_ROW);
      localStorage.setItem('lastModalOpenedDate', today);
    }
  }

  return (
    <CentralModal
      onClose={() => {
        refetch();
        setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED_MODAL_CLOSED);
        dispatch(setIsPublishedModalClosed(true));
        dispatch(setNeedToPlayHappy(true));
        closeModal(MODALS.INTEGRATION_REWARD);
      }}
      modalId={MODALS.INTEGRATION_REWARD}
      title={t('i27')}
    >
      <div className={styles.background}>
        <Lottie animationData={confetti} loop={false} className={styles.reward} />
      </div>
      <div className={styles.images}>
        <Lottie animationData={blueLightAnimation} loop={true} className={styles.light} />
      </div>
      <div className={styles.wrapper}>
        <div className={styles.info}>
          <div className={styles.top}>
            <img className={styles.integration} src={args?.company.image_url} alt="image" />
          </div>
          <div className={styles.bottom}>
            <h2 className={styles.title}>{args?.company.company_name}</h2>
            <div className={styles.rate}>
              {[...Array(3)].map((_, index) => (
                <img
                  key={index}
                  className={integrationCount >= starsThresholds.thirdStar ? styles.starsMax : ''}
                  src={index < blueStarCount ? starBlue : starGray}
                />
              ))}
            </div>
            <div className={styles.progress}>
              {integrationCount < starsThresholds.thirdStar && (
                <div className={styles.progressBar} style={{ width: `${progressPercentage}%` }} />
              )}
            </div>
          </div>
        </div>

        <div className={styles.icons}>
          <div className={styles.item}>
            <span>+{formatAbbreviation(Number(args?.base_income), 'number', { locale: locale })}</span>
            <img src={coin} className={styles.coin} />
          </div>
          <div className={styles.item}>
            <span>+{formatAbbreviation(Number(args?.base_subscribers), 'number', { locale: locale })}</span>
            <img src={subscribers} />
          </div>
          <div className={styles.item}>
            <span>+{formatAbbreviation(Number(args?.base_views), 'number', { locale: locale })}</span>
            <img src={views} />
          </div>
        </div>
        <div className={styles.desc}>
          <p>{t('i29')}</p>
        </div>
        <Button
          variant={'blue'}
          // onClick={() => {
          //   refetch();
          //   dispatch(setIsPublishedModalClosed(true));
          //   closeModal(MODALS.INTEGRATION_REWARD);
          // }}
          onClick={() => {
            if (isVibrationSupported) {
              navigator.vibrate(200);
            }
            refetch();
            setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED_MODAL_CLOSED);
            dispatch(setIsPublishedModalClosed(true));
            dispatch(setNeedToPlayHappy(true));
            openModalIfNotOpenedToday();
            closeModal(MODALS.INTEGRATION_REWARD);
          }}
        >
          {t('i30')}
        </Button>
      </div>
    </CentralModal>
  );
}
