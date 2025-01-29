import { PropsWithChildren } from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';

interface Props {
  variant: 'blue' | 'red';
}

export default function Button({ variant, children }: PropsWithChildren<Props>) {
  return (
    <button className={clsx(styles.button, variant === 'blue' ? styles.buttonBlue : styles.buttonRed)}>
      {children}
    </button>
  );
}
