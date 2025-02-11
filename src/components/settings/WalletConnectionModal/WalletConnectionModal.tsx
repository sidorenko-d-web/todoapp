import { MODALS } from "../../../constants/modals"
import { CentralModal } from "../../shared/CentralModal/CentralModal"

import styles from "./WalletConnectionModal.module.scss"
import { useModal } from "../../../hooks/useModal"

import copyIcon from "../../../assets/icons/copy.svg" 
import tickIcon from "../../../assets/icons/input-tick.svg"
import { useState } from "react"

import { useTonConnect } from "../../../hooks"
import { useTranslation } from "react-i18next"
import { Locales } from "@tonconnect/ui-react"

export const WalletConnectionModal = () => {
  const { t } = useTranslation('settings');
  
  const {closeModal} = useModal()

  const {
    walletType,
    userAddress,
    connectWallet,
    disconnectWallet,
    tonConnectUI
  } = useTonConnect()

  const [activeButton, setActiveButton] = useState("")
  const {i18n} = useTranslation()

  tonConnectUI.uiOptions = {
    language: i18n.languages[0] as Locales
  }

  const handleDisconnectWallet = () => {
    if (userAddress) {
      disconnectWallet()
    }
  }

  const handleCloseModal = () => {  
    closeModal(MODALS.WALLET_CONNECTION)
  }

  const handleWalletConnect = () => {
    setActiveButton("connect")
    connectWallet()
  }

  const handleCopyAddress = async () => {
    setActiveButton("address")
    if (userAddress) {
      await navigator.clipboard.writeText(userAddress);
    }
    setTimeout(() => setActiveButton(""), 250)
  };

  return (
    <CentralModal
      modalId={MODALS.WALLET_CONNECTION}
      title={t('s3')}
      onClose={handleCloseModal}
      headerStyles={styles.titleStyles}
    >


      <div className={styles.wrapper}>
        <div className={styles.walletSection}>
          <div 
          className={`${styles.walletWrapper} ${activeButton === 'connect' ? styles.active: ''}`} 
          onClick={handleWalletConnect}
          >
            <p className={styles.text}>
              {walletType || t('s4')}
            </p>
            <img src={tickIcon} alt="tickIcon" className={styles.icon} />
          </div>

          <div 
          className={`${styles.walletWrapper} ${activeButton === 'address' ? styles.active: ''}`} 
          onClick={handleCopyAddress}
          >
            <p className={styles.text}>
              {userAddress || t('s5')}
            </p>
            <img src={copyIcon} alt="copyIcon" className={styles.icon} />
          </div>
        </div>

        <div className={styles.walletButtons}>
          <button className={styles.okButton} onClick={handleDisconnectWallet}>
            {t('s6')}
          </button>

          <button className={styles.disconnectButton} onClick={handleCloseModal}>
            {t('s7')}
          </button>
        </div>
      </div>

    </CentralModal>
  )
}

export default WalletConnectionModal

