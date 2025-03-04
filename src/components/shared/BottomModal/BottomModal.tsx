import s from './BottomModal.module.scss';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Overlay } from '../common';
import closeIcon from '../../../assets/icons/close.svg';
import classNames from 'classnames';
import { useModal } from '../../../hooks';
import modalGripIcon from '../../../assets/icons/modal-grip.svg';

interface BottomModalProps {
  modalId: string;
  title: string;
  onClose: () => void;
  disabled?: boolean;
  disableScrollLock?: boolean;
  containerStyles?: string;
  modalStyles?: string;
  titleWrapperStyles?: string;
  headerStyles?: string;
  titleIcon?: string;
}

const BottomModal: FC<PropsWithChildren<BottomModalProps>> = ({
  modalId,
  title,
  onClose,
  disabled = false,
  disableScrollLock = false,
  containerStyles,
  modalStyles,
  children,
  titleWrapperStyles,
  headerStyles,
  titleIcon,
}) => {
  const { getModalState } = useModal();
  const { isOpen } = getModalState(modalId);
  const [isClosing, setIsClosing] = useState(false);

  // Handle scroll lock
  useEffect(() => {
    if (isOpen && !disableScrollLock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, disableScrollLock]);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 80); 
  };

  if (!isOpen) return null;

  return (
    <Overlay
      className={classNames(s.overlay, containerStyles)}
      onClick={handleClose}
      style={{backgroundColor: `rgba(0, 0, 0, 0.7)`}}
    >
      <div
        className={classNames(
          s.modal,
          modalStyles,
          {
            [s.opening]: isOpen && !isClosing,
            [s.closing]: isClosing
          }
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className={classNames({ [s.disabled]: disabled })}>
          <header className={classNames(s.header, headerStyles)}>
            <img src={modalGripIcon} alt="Grip" width={26} height={3} />
            <div className={classNames(s.titleWrapper, titleWrapperStyles)}>
              <h2 className={s.title}>
                {title}
                {titleIcon && <img src={titleIcon} alt="title" />}
              </h2>
              <button className={s.closeBtn} onClick={handleClose}>
                <img src={closeIcon} alt="Close" />
              </button>
            </div>
          </header>
          <div className={s.content}>{children}</div>
        </div>
      </div>
    </Overlay>
  );
};

export default BottomModal