import { PropsWithChildren } from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';

interface Props {
  variant: 'blue' | 'red' | 'gray';
  onClick?: () => any;
}

export default function Button({ variant, children, onClick }: PropsWithChildren<Props>) {
  return (
    <button
      onClick={() => onClick?.()}
      className={clsx(
        styles.button,
        variant === 'blue'
          ? styles.buttonBlue
          : variant === 'red'
          ? styles.buttonRed
          : styles.buttonGray,
      )}
    >
      {children}
    </button>
  );
}
