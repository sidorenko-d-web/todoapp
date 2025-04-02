import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useSound from 'use-sound';
import { MODALS, SOUNDS } from '../constants';
import { selectButtonVolume, selectVolume } from '../redux';
import { useModal } from './useModal';

type modal_keys = keyof typeof MODALS;
type sound_keys = keyof typeof SOUNDS;

interface UseAutoPlaySoundOptions {
  isButtonSound?: boolean; // Флаг, указывающий, что это звук кнопки
  volumeMultiplier?: number;
}

/**
 * Хук для автоматического воспроизведения звука при открытии модального окна
 * @param modal Идентификатор модального окна
 * @param sound Звук для воспроизведения
 * @param options Дополнительные опции
 */
export const useAutoPlaySound = (
  modal: (typeof MODALS)[modal_keys],
  sound: (typeof SOUNDS)[sound_keys],
  options: UseAutoPlaySoundOptions = {}
) => {
  const { getModalState } = useModal();
  const state = getModalState(modal);
  
  const { isButtonSound = false, volumeMultiplier = 1 } = options;
  
  // Используем правильный селектор громкости в зависимости от типа звука
  const volume = useSelector(isButtonSound ? selectButtonVolume : selectVolume);
  
  // Вычисляем эффективную громкость
  const effectiveVolume = volume * volumeMultiplier;
  
  const [playSound] = useSound(sound, { volume: effectiveVolume });

  useEffect(() => {
    // Воспроизводим звук только если он включен (громкость > 0) и модальное окно открыто
    if (state.currentModal === modal && state.isOpen && effectiveVolume > 0) {
      playSound();
    }
  }, [state, effectiveVolume]);
};
