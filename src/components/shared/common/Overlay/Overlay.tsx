import { createPortal } from 'react-dom';
import classNames from 'classnames';

import styles from './Overlay.module.scss';
import { CSSProperties } from 'react';

type OverlayProps = {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  style?: CSSProperties;
};

export const Overlay: React.FC<React.PropsWithChildren<OverlayProps>> = ({ onClick, className, children, style }) => {
  return createPortal(
    <div className={classNames(styles.overlay, className)} onClick={onClick} style={style}>
      <div className={styles.content}>{children}</div>
    </div>,
    document.body,
  );
};
