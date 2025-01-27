import { createPortal } from 'react-dom';
import classNames from 'classnames';

import styles from './Overlay.module.scss';

type OverlayProps = {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
};

export const Overlay: React.FC<React.PropsWithChildren<OverlayProps>> = ({ onClick, className, children }) => {
  return createPortal(
    <div className={classNames(styles.overlay, className)} onClick={onClick}>
      <div className={styles.content}>{children}</div>
    </div>,
    document.body,
  );
};
