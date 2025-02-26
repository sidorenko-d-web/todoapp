import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import useSound from 'use-sound';
import { SOUNDS } from '../../../constants';
import { useSelector } from 'react-redux';
import { selectButtonVolume } from '../../../redux';

interface Props
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  onClick?: () => any;
}

export const Button = ({ children, onClick, ...props }: Props) => {
  const [playClickSound] = useSound(SOUNDS.buttonClick, {
    volume: useSelector(selectButtonVolume) * 7,
  });

  const handleOnClick = () => {
    playClickSound();
    onClick?.();
  };

  return (
    <button onClick={handleOnClick} {...props}>
      {children}
    </button>
  );
};