import { PropsWithChildren } from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';

interface Props {
  variant: 'blue' | 'red';
  onClick?: () => void;
}

export default function Button({ variant, children, onClick }: PropsWithChildren<Props>) {
  return (
    <button
      onClick={onClick}
      className={clsx(styles.button, variant === 'blue' ? styles.buttonBlue : styles.buttonRed)}
    >
      {children}
    </button>
  );
}
