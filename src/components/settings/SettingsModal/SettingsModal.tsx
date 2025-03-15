import styles from './SettingsModal.module.scss';
import { MODALS } from '../../../constants';
import { useModal } from '../../../hooks';
import ArrowRight from '../../../assets/icons/arrow-right.svg';
import { useTranslation } from 'react-i18next';
import { CentralModal } from '../../shared';
import { useTonConnect } from '../../../hooks';

export const SettingsModal = () => {
  const { t } = useTranslation('settings');
  const { closeModal, openModal } = useModal();
  const { walletAddress, connectWallet } = useTonConnect();

  const handleCloseModal = () => {
    closeModal(MODALS.SETTINGS);
  };

  const handleOpenLanguageSelectionModal = () => {
    openModal(MODALS.LANGUAGE_SELECTION);
    // closeModal(MODALS.SETTINGS)
  };

  const handleOpenWalletConnectionModal = () => {
    if (!walletAddress) {
      connectWallet();
    } else {
      openModal(MODALS.WALLET_CONNECTION);
    }
  };

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
            {t('s2')}
          </div>
          <img className={styles.arrow} src={ArrowRight} alt="" />
        </div>

        <div className={styles.childModalWrapper} onClick={handleOpenWalletConnectionModal}>
          <div className={styles.titleAndIcon}>
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
