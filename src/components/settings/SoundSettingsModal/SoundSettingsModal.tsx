import { MODALS } from "../../../constants/modals";
import { useModal } from "../../../hooks/useModal";
import styles from "./SoundSettingsModal.module.scss";
import { useState } from "react";
import tick from "../../../assets/icons/input-tick.svg";
import circle from "../../../assets/icons/circle-blue.svg";
import { useTranslation } from 'react-i18next';
import { CentralModal } from "../../shared";
import { useDispatch } from 'react-redux';
import { setVolume } from '../../../redux';

interface SoundOptionProps {
    title: string;
    isEnabled: boolean;
    onToggle: () => void;
}

const SoundOption = ({ title, isEnabled, onToggle }: SoundOptionProps) => {
    const { t } = useTranslation('settings');
    
    return (
        <div
            className={`${styles.soundWrapper} ${isEnabled ? styles.selected : ''}`}
            onClick={onToggle}
        >
            <div className={styles.soundAndIcon}>
                <span>{title}</span>
                <span className={`${styles.status} ${isEnabled ? styles.statusEnabled : styles.statusDisabled}`}>
                    {isEnabled ? t('s11') : t('s12')}
                </span>
            </div>
            <div className={styles.selectionIconWrapper}>
                <img
                    src={isEnabled ? tick : circle}
                    alt={isEnabled ? "Selected" : "Not selected"}
                    className={styles.selectionIcon}
                />
            </div>
        </div>
    );
};

export const SoundSettingsModal = () => {
    const { t } = useTranslation('settings');
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [isMusicEnabled, setIsMusicEnabled] = useState(true);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);

    const handleCloseModal = () => {
        closeModal(MODALS.SOUND_SETTINGS);
        // Применяем настройки звука
        dispatch(setVolume(isMusicEnabled ? 0.5 : 0));
    };

    return (
        <CentralModal
            modalId={MODALS.SOUND_SETTINGS}
            title={t('s8')}
            headerStyles={styles.titleStyles}
            onClose={handleCloseModal}
            overlayOpacity={0}
        >
            <div className={styles.wrapper}>
                <div className={styles.soundSection}>
                    <SoundOption
                        title={t('s9')}
                        isEnabled={isMusicEnabled}
                        onToggle={() => setIsMusicEnabled(!isMusicEnabled)}
                    />
                    <SoundOption
                        title={t('s10')}
                        isEnabled={isSoundEnabled}
                        onToggle={() => setIsSoundEnabled(!isSoundEnabled)}
                    />
                </div>

                <button
                    className={styles.applyButton}
                    onClick={handleCloseModal}
                >
                    {t('s13')}
                </button>
            </div>
        </CentralModal>
    );
};

export default SoundSettingsModal;
