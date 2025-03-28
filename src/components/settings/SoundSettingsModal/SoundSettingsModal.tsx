import { MODALS } from "../../../constants/modals";
import { useModal } from "../../../hooks/useModal";
import styles from "./SoundSettingsModal.module.scss";
import { useEffect, useState } from "react";
import tick from "../../../assets/icons/input-tick.svg";
import circle from "../../../assets/icons/circle-blue.svg";
import { useTranslation } from 'react-i18next';
import { CentralModal } from "../../shared";
import { useDispatch, useSelector } from 'react-redux';
import { selectVolume, setButtonVolume, setVolume } from '../../../redux';

// Ключи для localStorage
const MUSIC_ENABLED_KEY = 'musicEnabled';
const SOUND_EFFECTS_ENABLED_KEY = 'soundEffectsEnabled';

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
    const currentVolume = useSelector(selectVolume);
    
    // Инициализация с сохраненными значениями из localStorage
    const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
        const saved = localStorage.getItem(MUSIC_ENABLED_KEY);
        return saved !== null ? saved === 'true' : currentVolume > 0;
    });
    
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
        const saved = localStorage.getItem(SOUND_EFFECTS_ENABLED_KEY);
        return saved !== null ? saved === 'true' : true;
    });

    // При первом рендере применяем сохраненные настройки
    useEffect(() => {
        dispatch(setVolume(isMusicEnabled ? 0.5 : 0));
        dispatch(setButtonVolume(isSoundEnabled ? 2.1 : 0));
    }, []);

    const handleCloseModal = () => {
        closeModal(MODALS.SOUND_SETTINGS);
    };

    const toggleMusic = () => {
        const newValue = !isMusicEnabled;
        setIsMusicEnabled(newValue);
        
        // Сразу применяем настройки звука
        dispatch(setVolume(newValue ? 0.5 : 0));
        // Сохраняем в localStorage
        localStorage.setItem(MUSIC_ENABLED_KEY, String(newValue));
    };

    const toggleSoundEffects = () => {
        const newValue = !isSoundEnabled;
        setIsSoundEnabled(newValue);
        
        // Сразу применяем настройки звуковых эффектов
        dispatch(setButtonVolume(newValue ? 2.1 : 0));
        // Сохраняем в localStorage
        localStorage.setItem(SOUND_EFFECTS_ENABLED_KEY, String(newValue));
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
                        onToggle={toggleMusic}
                    />
                    <SoundOption
                        title={t('s10')}
                        isEnabled={isSoundEnabled}
                        onToggle={toggleSoundEffects}
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
