import styles from './SettingsModal.module.scss';
import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import russiaIcon from '../../../assets/icons/ru-flag.svg';
import usaIcon from '../../../assets/icons/us-flag.svg';
import cryptoWalletIcon from '../../../assets/icons/Wallet.png';
import ArrowRight from '../../../assets/icons/arrow-right.svg';
import { useTranslation } from 'react-i18next';
import { CentralModal } from '../../shared';

export const SettingsModal = () => {
  const { t, i18n } = useTranslation('settings');
  const { closeModal, openModal } = useModal();

  const handleCloseModal = () => {
    closeModal(MODALS.SETTINGS);
  };

  const handleOpenLanguageSelectionModal = () => {
    openModal(MODALS.LANGUAGE_SELECTION);
    // closeModal(MODALS.SETTINGS)
  };

  const handleOpenWalletConnectionModal = () => {
    openModal(MODALS.WALLET_CONNECTION);
    // closeModal(MODALS.SETTINGS)
  };

  const currentLanguageIcon = i18n.language === 'ru' ? russiaIcon : usaIcon;

  return (
    <CentralModal
      modalId={MODALS.SETTINGS}
      title={t('s1')}
      onClose={handleCloseModal}
      headerStyles={styles.titleStyles}
    >
      <div className={styles.wrapper}>
        <div className={styles.childModalWrapper} onClick={handleOpenLanguageSelectionModal}>
          <div className={styles.titleAndIcon}>
            <img className={styles.icon} src={currentLanguageIcon} alt="" />
            {t('s2')}
          </div>
          <img className={styles.arrow} src={ArrowRight} alt="" />
        </div>

        <div className={styles.childModalWrapper} onClick={handleOpenWalletConnectionModal}>
          <div className={styles.titleAndIcon}>
            <div>
              <img className={styles.icon} src={cryptoWalletIcon} alt="" />
            </div>
            {t('s3')}
          </div>
          <img className={styles.arrow} src={ArrowRight} alt="" />
        </div>

        <button className={styles.OK} onClick={handleCloseModal}>
          {t('s7')}
        </button>
      </div>
    </CentralModal>
  );
};

export default SettingsModal;
