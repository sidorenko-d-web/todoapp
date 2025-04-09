import { MODALS } from "../../../constants/modals";
import { useModal } from "../../../hooks/useModal";
import styles from "./SoundSettingsModal.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import tick from "../../../assets/icons/input-tick.svg";
import circle from "../../../assets/icons/circle-blue.svg";
import { useTranslation } from 'react-i18next';
import { CentralModal } from "../../shared";
import { useDispatch, useSelector } from 'react-redux';
import { selectButtonVolume, selectVolume, setButtonVolume, setVolume } from '../../../redux';

// Ключи для localStorage
const MUSIC_ENABLED_KEY = 'musicEnabled';
const SOUND_EFFECTS_ENABLED_KEY = 'soundEffectsEnabled';
const MUSIC_VOLUME_KEY = 'musicVolume';
const BUTTON_VOLUME_KEY = 'buttonVolume';

interface SoundOptionProps {
    title: string;
    isEnabled: boolean;
    onToggle: () => void;
    showVolumeSlider?: boolean;
    volumeValue?: number;
    onVolumeChange?: (value: number) => void;
    onVolumeChangeComplete?: () => void;
}

const SoundOption = ({ 
    title, 
    isEnabled, 
    onToggle, 
    showVolumeSlider,
    volumeValue = 0.5,
    onVolumeChange,
    onVolumeChangeComplete
}: SoundOptionProps) => {
    const { t } = useTranslation('settings');
    const sliderRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        if (sliderRef.current) {
            const percent = volumeValue * 100;
            sliderRef.current.style.setProperty('--value-percent', `${percent}%`);
        }
    }, [volumeValue, isEnabled]);
    
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onVolumeChange) {
            const newValue = parseFloat(e.target.value);
            onVolumeChange(newValue);
        }
    };
    
    const handleVolumeChangeComplete = () => {
        console.error("Music enabled?", localStorage.getItem("musicEnabled"))
        if (onVolumeChangeComplete) {
            onVolumeChangeComplete();
        }
    };
    
    return (
        <div className={`${styles.soundWrapper} ${isEnabled ? styles.selected : ''}`}>
            <div className={styles.mainContent} onClick={onToggle}>
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
                        onMouseUp={handleVolumeChangeComplete}
                        onTouchEnd={handleVolumeChangeComplete}
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
    const currentButtonVolume = useSelector(selectButtonVolume);
    
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
        return saved !== null ? saved === 'true' : currentButtonVolume > 0;
    });

    // Инициализация громкости звуковых эффектов кнопок
    const [buttonVolume, setButtonVolumeState] = useState(() => {
        const saved = localStorage.getItem(BUTTON_VOLUME_KEY);
        return saved !== null ? parseFloat(saved) : 2.1;
    });
    
    // Используем локальное состояние для плавного изменения громкости
    const [tempMusicVolume, setTempMusicVolume] = useState(musicVolume);
    const [tempButtonVolume, setTempButtonVolume] = useState(buttonVolume);

    // При первом рендере применяем сохраненные настройки
    useEffect(() => {
        if (isMusicEnabled) {
            dispatch(setVolume(musicVolume));
        } else {
            dispatch(setVolume(0));
        }
        
        // Устанавливаем громкость кнопок в зависимости от того, включены звуки или нет
        dispatch(setButtonVolume(isSoundEnabled ? buttonVolume : 0));
        
        // Если значение еще не сохранено в localStorage, сохраняем его
        if (!localStorage.getItem(BUTTON_VOLUME_KEY)) {
            localStorage.setItem(BUTTON_VOLUME_KEY, String(buttonVolume));
        }
    }, []);

    const handleCloseModal = () => {
        closeModal(MODALS.SOUND_SETTINGS);
    };

    const toggleMusic = () => {
        const newValue = !isMusicEnabled;
        setIsMusicEnabled(newValue);
        
        // Сразу применяем настройки звука
        dispatch(setVolume(newValue ? tempMusicVolume : 0));
        // Сохраняем в localStorage
        localStorage.setItem(MUSIC_ENABLED_KEY, String(newValue));
    };
    
    // Функция для временного изменения громкости музыки без сохранения
    const handleTempMusicVolumeChange = useCallback((value: number) => {
        setTempMusicVolume(value);
        
        // Обновляем громкость в Redux, но не сохраняем в localStorage
        if (isMusicEnabled) {
            dispatch(setVolume(value));
        }
    }, [isMusicEnabled, dispatch]);
    
    // Функция для окончательного сохранения громкости музыки
    const handleMusicVolumeChangeComplete = useCallback(() => {
        setMusicVolume(tempMusicVolume);
        
        // Сохраняем в localStorage только после завершения изменения
        localStorage.setItem(MUSIC_VOLUME_KEY, String(tempMusicVolume));
    }, [tempMusicVolume]);

    const toggleSoundEffects = () => {
        const newValue = !isSoundEnabled;
        setIsSoundEnabled(newValue);
        
        // Сразу применяем настройки звуковых эффектов
        dispatch(setButtonVolume(newValue ? tempButtonVolume : 0));
        // Сохраняем в localStorage состояние (включено/выключено)
        localStorage.setItem(SOUND_EFFECTS_ENABLED_KEY, String(newValue));
    };
    
    // Функция для временного изменения громкости звуков кнопок без сохранения
    const handleTempButtonVolumeChange = useCallback((value: number) => {
        setTempButtonVolume(value);
        
        // Применяем новую громкость только если звуки включены
        if (isSoundEnabled) {
            dispatch(setButtonVolume(value));
        }
    }, [isSoundEnabled, dispatch]);
    
    // Функция для окончательного сохранения громкости звуков кнопок
    const handleButtonVolumeChangeComplete = useCallback(() => {
        setButtonVolumeState(tempButtonVolume);
        
        // Сохраняем значение громкости в localStorage
        localStorage.setItem(BUTTON_VOLUME_KEY, String(tempButtonVolume));
    }, [tempButtonVolume]);

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
                        volumeValue={tempMusicVolume}
                        onVolumeChange={handleTempMusicVolumeChange}
                        onVolumeChangeComplete={handleMusicVolumeChangeComplete}
                    />
                    <SoundOption
                        title={t('s10')}
                        isEnabled={isSoundEnabled}
                        onToggle={toggleSoundEffects}
                        showVolumeSlider={true}
                        volumeValue={tempButtonVolume}
                        onVolumeChange={handleTempButtonVolumeChange}
                        onVolumeChangeComplete={handleButtonVolumeChangeComplete}
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
