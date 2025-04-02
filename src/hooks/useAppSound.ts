import { useSelector } from 'react-redux';
import useSound from 'use-sound';
import { SOUNDS } from '../constants';
import { selectButtonVolume, selectVolume } from '../redux';

type SoundType = keyof typeof SOUNDS;

interface UseAppSoundOptions {
  isButtonSound?: boolean; // Определяет, использовать ли громкость кнопок или музыки
  volumeMultiplier?: number; // Множитель громкости
  enabled?: boolean; // Разрешить или запретить звук
}

/**
 * Хук для воспроизведения звуков в приложении с учетом настроек
 * @param soundType Тип звука из констант SOUNDS
 * @param options Дополнительные параметры
 * @returns Функция для воспроизведения звука
 */
export const useAppSound = (
  soundType: SoundType,
  options: UseAppSoundOptions = {}
) => {
  const {
    isButtonSound = false,
    volumeMultiplier = 1,
    enabled = true
  } = options;
  
  // Выбираем подходящий селектор громкости
  const volumeSelector = isButtonSound ? selectButtonVolume : selectVolume;
  const volume = useSelector(volumeSelector);
  
  // Применяем параметры к громкости
  const effectiveVolume = enabled ? volume * volumeMultiplier : 0;
  
  // Создаем звук с настроенной громкостью
  const [play, { stop, duration }] = useSound(SOUNDS[soundType], {
    volume: effectiveVolume
  });
  
  // Возвращаем объект с функциями для работы со звуком
  return {
    play,
    stop,
    duration,
    isEnabled: effectiveVolume > 0
  };
}; 