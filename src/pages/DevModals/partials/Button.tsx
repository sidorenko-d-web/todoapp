import { PropsWithChildren } from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';

interface Props {
  variant: 'blue' | 'red' | 'gray';
}

export default function Button({ variant, children }: PropsWithChildren<Props>) {
  return (
    <button
      className={clsx(
        styles.button,
        variant === 'blue' ? styles.buttonBlue : variant === 'red' ? styles.buttonRed : styles.buttonGray,
      )}
    >
      {children}
    </button>
  );
}
