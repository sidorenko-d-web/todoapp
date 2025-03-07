import s from './ExpandableBottomModal.module.scss';
import { FC, PropsWithChildren, useEffect, useState, useRef } from 'react';
import { Overlay, Fade } from '../common';
import closeIcon from '../../../assets/icons/close.svg';
import classNames from 'classnames';
import { useModal } from '../../../hooks';
import modalGripIcon from '../../../assets/icons/modal-grip.svg';

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
    overlayOpacity?: number;
}

export const ExpandableBottomModal: FC<PropsWithChildren<ExpandableBottomModalProps>> = ({
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
                                                                                             overlayOpacity,
                                                                                         }) => {
    const { getModalState } = useModal();
    const { isOpen } = getModalState(modalId);
    const [isClosing, setIsClosing] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(false);

    // Handle scroll lock for body
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
            setExpanded(false);
        }, 80);
    };

    // Handle content scroll attempt
    const handleScrollAttempt = (e: React.WheelEvent | React.TouchEvent) => {
        if (!expanded) {
            e.preventDefault();
            setExpanded(true);
        }
    };

    // Handle touch start on content for detecting scroll attempts
    const handleTouchStart = (e: React.TouchEvent) => {
        if (expanded) return; // If already expanded, do nothing special

        const touchStartY = e.touches[0].clientY;

        const handleTouchMove = (moveEvent: TouchEvent) => {
            if (expanded) return;

            const currentY = moveEvent.touches[0].clientY;
            const diff = currentY - touchStartY;

            // If trying to scroll up (negative diff), expand the modal
            if (diff < -10) {
                setExpanded(true);
                endTouch();
            }
        };

        const endTouch = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', endTouch);
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', endTouch);
    };

    // Simple drag handlers for header
    const handleDragStart = (e: React.TouchEvent) => {
        const touchStartY = e.touches[0].clientY;

        // Handle the drag movement
        const handleMove = (moveEvent: TouchEvent) => {
            const currentY = moveEvent.touches[0].clientY;
            const diff = currentY - touchStartY;

            // If dragged down significantly, collapse or close
            if (diff > 50) {
                if (expanded) {
                    setExpanded(false);
                } else {
                    handleClose();
                }
                endDrag();
            }

            // If dragged up significantly, expand
            if (diff < -50 && !expanded) {
                setExpanded(true);
                endDrag();
            }
        };

        // Clean up event listeners
        const endDrag = () => {
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', endDrag);
        };

        // Add event listeners
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', endDrag);
    };

    if (!isOpen) return null;

    const overlayStyle = {
        backgroundColor: `rgba(0, 0, 0, ${overlayOpacity || 0.5})`
    };

    return (
      <Overlay
        className={classNames(s.overlay, containerStyles)}
        onClick={handleClose}
        style={overlayStyle}
      >
          <Fade open>
              <div
                className={classNames(
                  s.modal,
                  modalStyles,
                  {
                      [s.expanded]: expanded,
                      [s.closing]: isClosing,
                      [s.disabled]: disabled,
                      [s.noScroll]: !expanded
                  }
                )}
                onClick={(e) => e.stopPropagation()}
                ref={modalRef}
              >
                  <div className={s.dragHandle} onTouchStart={handleDragStart}>
                      <header className={classNames(s.header, headerStyles)}>
                          <img src={modalGripIcon} alt="Grip" className={s.gripIcon} />
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
                  </div>
                  <div
                    className={s.content}
                    onWheel={handleScrollAttempt}
                    onTouchStart={handleTouchStart}
                  >
                      {children}
                  </div>
              </div>
          </Fade>
      </Overlay>
    );
};