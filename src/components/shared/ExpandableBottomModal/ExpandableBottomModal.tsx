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
  initialHeight?: string;
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
                                                                                           initialHeight = '50vh',
                                                                                           expandOnScroll = false,
                                                                                         }) => {
  const { getModalState } = useModal();
  const { isOpen } = getModalState(modalId);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const expandThreshold = 20;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (!disableScrollLock) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (modalRef.current) {
        modalRef.current.style.transform = 'translateY(100%)';
      }
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (!disableScrollLock) {
          document.body.style.overflow = 'auto';
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, disableScrollLock]);

  useEffect(() => {
    if (isOpen && isVisible && modalRef.current) {
      // Force browser to handle these separately
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (modalRef.current) {
            modalRef.current.style.transform = 'translateY(0)';
          }
        });
      });
    }
  }, [isOpen, isVisible]);

  useEffect(() => {
    if (isOpen) {
      setIsExpanded(false);
      setIsAnimating(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    setIsExpanded(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!expandOnScroll || isAnimating) return;

    const currentScroll = e.currentTarget.scrollTop;

    if (!isExpanded && currentScroll > expandThreshold) {
      setIsAnimating(true);
      setIsExpanded(true);

      if (modalRef.current) {
        modalRef.current.style.transform = 'scale(1.005)';

        setTimeout(() => {
          if (modalRef.current) {
            modalRef.current.style.transform = 'scale(1)';
          }
          setIsAnimating(false);
        }, 400);
      }
    }

    lastScrollY.current = currentScroll;
  };

  if (!isVisible) return null;

  const modalHeight = isExpanded ? '85vh' : initialHeight;

  return (
    <Overlay className={classNames(s.overlay, containerStyles)}>
      <Fade open>
        <div
          ref={modalRef}
          className={classNames(s.modal, modalStyles, {
            [s.expanding]: isAnimating,
          })}
          style={{
            height: modalHeight,
            transform: 'translateY(50%)',
          }}
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
};

