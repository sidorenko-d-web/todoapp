import { PropsWithChildren } from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';
import { Button as ButtonBase } from '../../../components/shared';

interface Props {
  variant: 'blue' | 'red' | 'gray' | 'purple';
  onClick?: () => void;
  onClose?: () => void;
}

export default function Button({
  variant,
  children,
  onClick,
  onClose,
}: PropsWithChildren<Props>) {
  const handleClick = () => {
    onClick?.();

    onClose?.();
  };

  return (
    <ButtonBase
      onClick={handleClick}
      className={clsx(
        styles.button,
        variant === 'blue'
          ? styles.buttonBlue
          : variant === 'red'
          ? styles.buttonRed
          : variant === 'purple'
          ? styles.buttonPurple
          : styles.buttonGray,
      )}
    >
      {children}
    </ButtonBase>
  );
}
