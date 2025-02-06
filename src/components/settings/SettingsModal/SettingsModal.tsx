import styles from "./SettingsModal.module.scss"
import { MODALS } from "../../../constants/modals"
import { useModal } from "../../../hooks/useModal"
import russiaIcon from "../../../assets/icons/ru-flag.svg"
import cryptoWalletIcon from "../../../assets/Icons/Wallet.png"
import ArrowRight from "../../../assets/icons/arrow-right.svg"
import CentralModal from "../../shared/CentralModal/CentralModal"


export const SettingsModal = () => {
    const { closeModal, openModal, } = useModal()

    const handleCloseModal = () => {
        closeModal(MODALS.SETTINGS)
    }

    const handleOpenLanguageSelectionModal = () => {
        openModal(MODALS.LANGUAGE_SELECTION)
        // closeModal(MODALS.SETTINGS)
    }

    const handleOpenWalletConnectionModal = () => {
        openModal(MODALS.WALLET_CONNECTION)
        // closeModal(MODALS.SETTINGS)
    }

    return (
        <CentralModal
            modalId={MODALS.SETTINGS} 
            title="Настройки" 
            onClose={handleCloseModal} 
            headerStyles={styles.titleStyles}
            >
            <div className={styles.wrapper}>
                <div className={styles.childModalWrapper} onClick={handleOpenLanguageSelectionModal}>
                    <div className={styles.titleAndIcon}>
                        <img className={styles.icon} src={russiaIcon} alt="" />
                        Язык
                    </div>
                    <img className={styles.arrow} src={ArrowRight} alt="" />
                </div>

                <div className={styles.childModalWrapper} onClick={handleOpenWalletConnectionModal}>
                    <div className={styles.titleAndIcon}>
                        <img className={styles.icon} src={cryptoWalletIcon} alt="" />
                        Кошелек
                    </div>
                    <img className={styles.arrow} src={ArrowRight} alt="" />
                </div>


                <button className={styles.OK} onClick={handleCloseModal}>
                    Ок
                </button>
            </div>
        </CentralModal>
    )
}

export default SettingsModal