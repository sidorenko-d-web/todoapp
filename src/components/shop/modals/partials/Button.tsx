import { PropsWithChildren } from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';
import { Button as ButtonBase } from '../../../shared';

interface Props {
  variant: 'blue' | 'red';
  onClick?: () => void;
}

export default function Button({ variant, children, onClick }: PropsWithChildren<Props>) {
  return (
    <ButtonBase
      onClick={() => onClick?.()}
      className={clsx(styles.button, variant === 'blue' ? styles.buttonBlue : styles.buttonRed)}
    >
      {children}
    </ButtonBase>
  );
}
