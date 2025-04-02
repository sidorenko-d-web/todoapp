import { useSelector } from 'react-redux';
import useSound from 'use-sound';
import { SOUNDS } from '../constants';
import { selectButtonVolume } from '../redux';

type SoundType = keyof typeof SOUNDS;

interface UseButtonSoundOptions {
  sound?: SoundType;
  enabled?: boolean;
  volumeMultiplier?: number;
}

/**
 * Хук для воспроизведения звука при нажатии на кнопку
 * @param options Опции для настройки звука
 * @returns Функция для воспроизведения звука и обработки клика
 */
export const useButtonSound = (options: UseButtonSoundOptions = {}) => {
  const {
    sound = 'buttonClick',
    enabled = true,
    volumeMultiplier = 7
  } = options;
  
  const buttonVolume = useSelector(selectButtonVolume);
  
  // Используем звук только если он включен в настройках (buttonVolume > 0) и передан флаг enabled
  const effectiveVolume = buttonVolume > 0 && enabled ? buttonVolume * volumeMultiplier : 0;
  
  const [playSound] = useSound(SOUNDS[sound], {
    volume: effectiveVolume
  });
  
  // Функция для обработки клика и воспроизведения звука
  const handleSoundClick = (callback?: () => void) => {
    // Воспроизводим звук только если громкость > 0
    if (effectiveVolume > 0) {
      playSound();
    }
    
    // Вызываем колбэк, если он предоставлен
    if (callback) {
      callback();
    }
  };
  
  return handleSoundClick;
}; 