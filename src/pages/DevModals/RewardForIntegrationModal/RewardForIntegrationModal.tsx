import { MODALS, SOUNDS } from '../../../constants';
import { useAutoPlaySound, useModal } from '../../../hooks';
import styles from './RewardForIntegrationModal.module.scss';
import Button from '../partials/Button';
import coin from '../../../assets/icons/coin.png';
import subscribers from '../../../assets/icons/subscribers.png';
import integration from '../../../assets/icons/integration-blue.svg';
import starBlue from '../../../assets/icons/star-blue.svg';
import starGray from '../../../assets/icons/star-dark-gray.svg';
import lightning from '../../../assets/icons/lightning.svg';
import Lottie from 'lottie-react';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import reward from '../../../assets/animations/reward.json';
import { useDispatch } from 'react-redux';
import { setIsPublishedModalClosed } from '../../../redux/slices/guideSlice';
import { CentralModal } from '../../../components/shared';
import { useTranslation } from 'react-i18next';
import { formatAbbreviation } from '../../../helpers';

export default function RewardForIntegrationModal() {
  const { t, i18n } = useTranslation('integrations');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { closeModal, getModalState } = useModal();

  const { args } = getModalState(MODALS.INTEGRATION_REWARD);

  const dispatch = useDispatch();

  useAutoPlaySound(MODALS.INTEGRATION_REWARD, SOUNDS.rewardHuge);

  return (
    <CentralModal
      onClose={() => {
        dispatch(setIsPublishedModalClosed(true));
        closeModal(MODALS.INTEGRATION_REWARD);
      }}
      modalId={MODALS.INTEGRATION_REWARD}
      title={t('i27')}
    >
      <div className={styles.background}>
        <Lottie animationData={reward} loop={false} className={styles.reward} />
      </div>
      <div className={styles.images}>
        <Lottie animationData={blueLightAnimation} loop={true} className={styles.light} />
      </div>
      <div className={styles.wrapper}>
        <div className={styles.info}>
          <div className={styles.top}>
            <div className={styles.lightning}>
              <img src={lightning} />
            </div>
            {/* @ts-ignore */}
            <img className={styles.integration} src={args?.image_url ?? integration} />
          </div>
          <div className={styles.bottom}> 
            {/* @ts-ignore */}
            <h2 className={styles.title}>{args?.company_name}</h2>
            <div className={styles.rate}>
              <img src={starBlue} />
              <img src={starGray} />
              <img src={starGray} />
            </div>
            <div className={styles.progress}>
              <div className={styles.progressBar} />
            </div>
          </div>
        </div>
        <div className={styles.icons}>
          <div className={styles.item}>
            <span>+{formatAbbreviation(1500, 'number', { locale: locale })}</span>
            <img src={coin} className={styles.coin} />
          </div>
          <div className={styles.item}>
            <span>+{formatAbbreviation(500, 'number', { locale: locale })}</span>
            <img src={subscribers} />
          </div>
        </div>
        <div className={styles.desc}>
          <p>{t('i29')}</p>
        </div>
        <Button
          variant={'blue'}
          onClick={() => {
            dispatch(setIsPublishedModalClosed(true));
            closeModal(MODALS.INTEGRATION_REWARD);
          }}
        >
          {t('i30')}
        </Button>
      </div>
    </CentralModal>
  );
}
