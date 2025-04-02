import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { useButtonSound } from '../../../hooks/useButtonSound';
import { SOUNDS } from '../../../constants';

interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  onClick?: () => any;
  soundEnabled?: boolean;
  soundType?: keyof typeof SOUNDS;
  volumeMultiplier?: number;
}

export const Button = ({
  children,
  onClick,
  soundEnabled = true,
  soundType = 'buttonClick',
  volumeMultiplier = 7,
  ...props
}: Props) => {
  const isVibrationSupported =
    typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function';

  // Используем новый хук для звука кнопки
  const handleSoundClick = useButtonSound({
    sound: soundType,
    enabled: soundEnabled,
    volumeMultiplier,
  });

  const handleOnClick = () => {
    if (isVibrationSupported) {
      navigator.vibrate(200);
    }

    // Используем обработчик звука с колбэком
    handleSoundClick(onClick);
  };

  return (
    <button onClick={handleOnClick} {...props}>
      {children}
    </button>
  );
};
