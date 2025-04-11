import settings from '../../assets/icons/settings.svg'
import styles from './Settings.module.scss'
import {useModal} from "../../hooks";
import {MODALS} from "../../constants";

export const Settings = () => {
    const {openModal} = useModal()
    const handleOpenModal = () => openModal(MODALS.SETTINGS)
    return (
        <div className={styles.settingsIconWrapper} onClick={handleOpenModal}>
            <img className={styles.settingsIcon} src={settings} alt="Settings"/>
        </div>
    );
}