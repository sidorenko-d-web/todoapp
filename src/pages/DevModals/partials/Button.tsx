import { PropsWithChildren } from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';
import { Button as ButtonBase } from '../../../components/shared';

interface Props {
  variant: 'blue' | 'red' | 'gray' | 'purple';
  onClick?: () => any;
}

export default function Button({ variant, children, onClick }: PropsWithChildren<Props>) {
  return (
    <ButtonBase
      onClick={() => onClick?.()}
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
