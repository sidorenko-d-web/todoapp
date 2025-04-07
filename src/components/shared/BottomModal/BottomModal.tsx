import s from './BottomModal.module.scss';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import closeIcon from '../../../assets/icons/close.svg';
import classNames from 'classnames';
import { useModal } from '../../../hooks';
import modalGripIcon from '../../../assets/icons/modal-grip.svg';
import { useTranslation } from 'react-i18next';

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
  isCopiedLink?: boolean;
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
  isCopiedLink,
}) => {
  const { getModalState } = useModal();
  const { isOpen } = getModalState(modalId);
  const [isClosing, setIsClosing] = useState(false);
  const { t } = useTranslation('promotion');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle scroll lock
  useEffect(() => {
    if (!mounted) return;

    if (isOpen && !disableScrollLock) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Apply fixed positioning to body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore scroll position when modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, disableScrollLock, mounted]);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 80);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className={classNames(s.backdropContainer, containerStyles)} onClick={handleBackdropClick}>
      {isCopiedLink && <div className={s.save}>{t('p59')}</div>}
      <div
        className={classNames(s.modalWrapper, {
          [s.opening]: isOpen && !isClosing,
          [s.closing]: isClosing,
        })}
      >
        <div className={classNames(s.modal, modalStyles)} onClick={e => e.stopPropagation()}>
          <div className={classNames({ [s.disabled]: disabled })}>
            <header className={classNames(s.header, headerStyles)}>
              <div className={s.gripContainer}>
                <img src={modalGripIcon} alt="Grip" width={26} height={3} className={s.gripIcon} />
              </div>
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
            <div className={classNames(s.content, { [s.topUsers]: title === 'Топ 10 000 инфлюенсеров' })}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default BottomModal;
