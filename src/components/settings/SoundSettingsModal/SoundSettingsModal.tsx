import { MODALS } from "../../../constants/modals";
import { useModal } from "../../../hooks/useModal";
import styles from "./SoundSettingsModal.module.scss";
import { useEffect, useRef, useState } from "react";
import tick from "../../../assets/icons/input-tick.svg";
import circle from "../../../assets/icons/circle-blue.svg";
import { useTranslation } from 'react-i18next';
import { CentralModal } from "../../shared";
import { useDispatch, useSelector } from 'react-redux';
import { selectVolume, setButtonVolume, setVolume } from '../../../redux';

// Ключи для localStorage
const MUSIC_ENABLED_KEY = 'musicEnabled';
const SOUND_EFFECTS_ENABLED_KEY = 'soundEffectsEnabled';
const MUSIC_VOLUME_KEY = 'musicVolume';

interface SoundOptionProps {
    title: string;
    isEnabled: boolean;
    onToggle: () => void;
    showVolumeSlider?: boolean;
    volumeValue?: number;
    onVolumeChange?: (value: number) => void;
}

const SoundOption = ({ 
    title, 
    isEnabled, 
    onToggle, 
    showVolumeSlider,
    volumeValue = 0.5,
    onVolumeChange
}: SoundOptionProps) => {
    const { t } = useTranslation('settings');
    const sliderRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        if (sliderRef.current) {
            const percent = volumeValue * 100;
            sliderRef.current.style.setProperty('--value-percent', `${percent}%`);
        }
    }, [volumeValue]);
    
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onVolumeChange) {
            const newValue = parseFloat(e.target.value);
            onVolumeChange(newValue);
        }
    };
    
    return (
        <div className={`${styles.soundWrapper} ${isEnabled ? styles.selected : ''}`}>
            <div className={styles.mainContent}>
                <div className={styles.soundAndIcon} onClick={onToggle}>
                    <span>{title}</span>
                    <span className={`${styles.status} ${isEnabled ? styles.statusEnabled : styles.statusDisabled}`}>
                        {isEnabled ? t('s11') : t('s12')}
                    </span>
                </div>
                <div className={styles.selectionIconWrapper} onClick={onToggle}>
                    <img
                        src={isEnabled ? tick : circle}
                        alt={isEnabled ? "Selected" : "Not selected"}
                        className={styles.selectionIcon}
                    />
                </div>
            </div>
            
            {showVolumeSlider && isEnabled && (
                <div className={styles.volumeSliderContainer}>
                    <input
                        ref={sliderRef}
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volumeValue}
                        onChange={handleVolumeChange}
                        className={styles.volumeSlider}
                    />
                </div>
            )}
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
    
    const [musicVolume, setMusicVolume] = useState(() => {
        const saved = localStorage.getItem(MUSIC_VOLUME_KEY);
        return saved !== null ? parseFloat(saved) : 0.5;
    });
    
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
        const saved = localStorage.getItem(SOUND_EFFECTS_ENABLED_KEY);
        return saved !== null ? saved === 'true' : true;
    });

    // При первом рендере применяем сохраненные настройки
    useEffect(() => {
        if (isMusicEnabled) {
            dispatch(setVolume(musicVolume));
        } else {
            dispatch(setVolume(0));
        }
        dispatch(setButtonVolume(isSoundEnabled ? 2.1 : 0));
    }, []);

    const handleCloseModal = () => {
        closeModal(MODALS.SOUND_SETTINGS);
    };

    const toggleMusic = () => {
        const newValue = !isMusicEnabled;
        setIsMusicEnabled(newValue);
        
        // Сразу применяем настройки звука
        dispatch(setVolume(newValue ? musicVolume : 0));
        // Сохраняем в localStorage
        localStorage.setItem(MUSIC_ENABLED_KEY, String(newValue));
    };
    
    const handleMusicVolumeChange = (value: number) => {
        setMusicVolume(value);
        
        // Сразу применяем настройки громкости
        dispatch(setVolume(value));
        // Сохраняем в localStorage
        localStorage.setItem(MUSIC_VOLUME_KEY, String(value));
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
                        showVolumeSlider={true}
                        volumeValue={musicVolume}
                        onVolumeChange={handleMusicVolumeChange}
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
