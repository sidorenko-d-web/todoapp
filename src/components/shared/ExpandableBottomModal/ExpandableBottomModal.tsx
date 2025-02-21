import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Fade, Overlay } from '../common';
import { useModal } from '../../../hooks';
import closeIcon from '../../../assets/icons/close.svg';
import modalGripIcon from '../../../assets/icons/modal-grip.svg';
import s from './ExpandableBottomModal.module.scss';

interface ExpandableBottomModalProps {
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
  initialHeight?: string
  expandOnScroll?: boolean;
}

export const ExpandableBottomModal: FC<PropsWithChildren<ExpandableBottomModalProps>> = ({
                                                                modalId,
                                                                title,
                                                                onClose,
                                                                disabled = false,
                                                                disableScrollLock = false,
                                                                containerStyles,
                                                                modalStyles,
                                                                titleWrapperStyles,
                                                                headerStyles,
                                                                titleIcon,
                                                                children,
                                                                initialHeight = "50vh",
                                                                expandOnScroll = false,
                                                              }) => {
  const { getModalState } = useModal();
  const { isOpen } = getModalState(modalId);
  const [isExpanded, setIsExpanded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (isOpen && !disableScrollLock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, disableScrollLock]);

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setIsExpanded(false);
      if (modalRef.current) {
        modalRef.current.style.transition = 'height 0.5s ease-in';
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose()
    setIsExpanded(false)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!expandOnScroll) return;
    const currentScroll = e.currentTarget.scrollTop;

    // Expand when scrolling down from initial position
    if (!isExpanded && currentScroll > 0) {
      setIsExpanded(true);
    }

    lastScrollY.current = currentScroll;
  };

  if (!isOpen) return null;

  const modalHeight = isExpanded ? '90vh' : initialHeight;

  return (
    <Overlay className={classNames(s.overlay, containerStyles)}>
      <Fade open>
        <div
          ref={modalRef}
          className={classNames(s.modal, modalStyles)}
          style={{ height: modalHeight }}
          onClick={e => e.stopPropagation()}
          onScroll={handleScroll}
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
            <div ref={contentRef} className={s.content}>
              {children}
            </div>
          </div>
        </div>
      </Fade>
    </Overlay>
  );
}