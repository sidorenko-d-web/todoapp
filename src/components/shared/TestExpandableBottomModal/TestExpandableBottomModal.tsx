import s from './TestExpandableBottomModal.module.scss';
import { FC, PropsWithChildren, useEffect, useState, useRef } from 'react';
import { Overlay, Fade } from '../common';
import closeIcon from '../../../assets/icons/close.svg';
import classNames from 'classnames';
import { useModal } from '../../../hooks';
import modalGripIcon from '../../../assets/icons/modal-grip.svg';

interface TestExpandableBottomModalProps {
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

export const TestExpandableBottomModal: FC<PropsWithChildren<TestExpandableBottomModalProps>> = ({
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
            setExpanded(false);
        }, 80);
    };

    // Simple drag handlers
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
                            [s.disabled]: disabled
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
                    <div className={s.content}>{children}</div>
                </div>
            </Fade>
        </Overlay>
    );
};