import { useEffect } from 'react';
import styles from './CentralModal.module.scss'
import { useModal } from '../../../hooks';
import { Fade, Overlay } from '../common';
import classNames from 'classnames';
import closeIcon from '../../../assets/icons/close.svg';

interface CentralModalProps {
  modalId: string;
  title: string;
  onClose: () => void;
  disabled?: boolean;
  disableScrollLock?: boolean;
  containerStyles?: string;
  modalStyles?: string;
  headerStyles?: string;
}

const CentralModal: React.FC<React.PropsWithChildren<CentralModalProps>> = ({
                                                                             modalId,
                                                                             title,
                                                                             onClose,
                                                                             disabled = false,
                                                                             disableScrollLock = false,
                                                                             containerStyles,
                                                                             modalStyles,
                                                                             children,
                                                                             headerStyles,
                                                                           }) => {
  const { getModalState } = useModal();

  const { isOpen } = getModalState(modalId);



  useEffect(() => {
    if (isOpen && !disableScrollLock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <Overlay className={classNames(styles.overlay, containerStyles)}>
      <Fade open>
        <div className={classNames(styles.modal, modalStyles)} onClick={e => e.stopPropagation()}>
          <div className={classNames({ [styles.disabled]: disabled })}>
            <div className={classNames(styles.header, headerStyles)}>
              <h2 className={styles.title}>{title}</h2>
              <button className={styles.closeBtn} onClick={onClose}>
                <img src={closeIcon} alt={''} width={32} height={32}/>
              </button>
            </div>
            <div>{children}</div>
          </div>
        </div>
      </Fade>
    </Overlay>
  );
};

export default CentralModal;