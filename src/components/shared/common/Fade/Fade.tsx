import { useLayoutEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './Fade.module.scss';

type FadeProps = {
  open?: boolean;
};

export const Fade: React.FC<React.PropsWithChildren<FadeProps>> = ({ open = false, children }) => {
  const [classes, setClasses] = useState(classNames(styles.fade));

  useLayoutEffect(() => {
    requestAnimationFrame(() => setClasses(classNames(styles.fade, open && styles.visible)));
  }, [open]);

  return <div className={classes}>{children}</div>;
};
